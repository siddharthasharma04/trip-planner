import { getUser } from './user';
import Router from 'next/router'
import { getLocationOnly } from './geo-location';


// if(isNode){
//     import('peerjs');
// }
// const Peer = dynamic(() => {
//     return import('peerjs').then(mod=>mod.default)
// },
//     { ssr: false }
// )


let peer = null;
let lastPeerId = null;

let connect = {};
const usersLocation = {};


const onPeerData = (data, cb) => {
    const msg = data.split('##');
    console.log("Mess", msg)
    if (msg[0].includes('user')) {
        const username = msg[1];
        const loc = JSON.parse(msg[2]);
        usersLocation[username] = { location: loc, color: msg[3] };
        cb(usersLocation);
    }
}
const msgSendToPeers = (color) => {
    try {
        // console.log("call made",connect);
        const user = getUser();
        Object.values(connect).forEach((v, i) => {
            const location = getLocationOnly();
            (v as any).send(`user##${user}##${JSON.stringify(location)}##${color}`);
        })
    } catch (error) {
        console.log(error);
    }
}
export function setPeer(cb = (d: any) => { }, localUserStorage: { id: string, setId: (a: string) => void }): Promise<any> {
    // useEffect(() => {
    // (async () => {

    const { usr, id } = JSON.parse(localUserStorage.id || '{}');
    return new Promise(async (res, rej) => {
        console.log('Effect')
        const { default: Peer } = await import('peerjs')
        if (!peer) {
            const user = getUser()
            peer = new Peer((id || null), {
                debug: 2
            });
            peer.on('open', (id) => {
                // Workaround for peer.reconnect deleting previous id
                if (peer.id === null) {
                    console.log('Received null id from peer open');
                    peer.id = lastPeerId;
                } else {
                    lastPeerId = peer.id;
                }
                localUserStorage.setId(JSON.stringify({ usr: user, id: peer.id }));
                console.log('ID: ' + peer.id);
                res(peer);
            })
            peer.on('disconnected', () => {
                console.log('Connection lost. Please reconnect');
                // Workaround for peer.reconnect deleting previous id
                // peer.id = lastPeerId;
                peer._lastServerId = lastPeerId;
                peer.reconnect();
            });

            peer.on('close', () => {
                connect = {};
                console.log('Connection destroyed');
            });
            peer.on('error', async (err) => {
                console.log("Peer Error", err);
                await setPeer(cb, { ...localUserStorage, id: undefined })
            })

            peer.on('connection', (conn) => {
                if (conn && conn.open) {
                    peer.on('open', () => {
                        peer.send("Hi");
                        // setTimeout(() => { peer.close(); }, 500);
                    });
                    return;
                }
                conn.on('data', (data) => { onPeerData(data, cb) });
            });
        }
    });//{peer,id:lastPeerId};
    // })();
    // }, [])
}


let isMsgSendOn = false;
const startMsgDataSending = () => {
    isMsgSendOn = true;
    console.log("Peer Msg sending start");
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setInterval(() => { msgSendToPeers(color) }, 1000)
}

function setOtherUserInLocal(id){
    let otherUsers = window.localStorage.getItem('_oid')
    if(otherUsers){
        otherUsers += `#,#${id}`;
    }
    window.localStorage.setItem('_oid',(otherUsers || id));
}

export function connectToOther(id) {
    if (!peer) {
        Router.replace('/');
        return null;
    }
    const user = getUser();
    const conn = peer.connect(id)
    connect[id] = conn;
    setOtherUserInLocal(id);
    conn?.on('open', () => {
        conn.send(`${user} : Hi!!`);
    });
    !isMsgSendOn && startMsgDataSending();
    return connect; // return connection
}

export function initOthersConnections() {
    const otherUsers = window.localStorage.getItem('_oid');
    const user = getUser();
    if (otherUsers) {
        const _uArr = otherUsers.split('#,#');
        _uArr.forEach(v => {
            if (v) {
                const conn = peer.connect(v);
                connect[v] = conn;
                conn?.on('open', () => {
                    conn.send(`${user} : Hi!! Reconnected`);
                });
                !isMsgSendOn && startMsgDataSending();
            }
        })
    }
}

export function getPeer() {
    return peer; // return Peer
}
export function getUsersLocation() {
    return Object.entries(usersLocation); // return Peer
}