import { getUser } from './user';
import Router from 'next/router'
import { getLocationOnly } from './geo-location';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';


// if(isNode){
//     import('peerjs');
// }
// const Peer = dynamic(() => {
//     return import('peerjs').then(mod=>mod.default)
// },
//     { ssr: false }
// )


let peer = null;


const connect = {};
const usersLocation = {};


const onPeerData = (data) => {
    const msg = data.split('##');
    console.log("Mess", msg)
    if (msg[0].includes('user')) {
        const username = msg[1];
        const loc = JSON.parse(msg[2]);
        usersLocation[username] = loc;
    }
}
const onPeerOpen = () => {
    try {
        // console.log("call made",connect);
        const user = getUser();
        Object.values(connect).forEach((v, i) => {
            const location = getLocationOnly();
            (v as any).send(`user##${user}##${JSON.stringify(location)}##`);
        })
    } catch (error) {
        console.log(error);
    }
}
let isMsgSendOn = false;
const startMsgDataSending = () => {
    isMsgSendOn = true;
    console.log("Peer Msg sending start");
    setInterval(onPeerOpen, 1000)
}
export async function setPeer() {
    // useEffect(() => {
    (async () => {
        console.log('Effect')
        const { default: Peer } = await import('peerjs')
        if (!peer) {
            peer = new (window as any).Peer();
            peer.on('connection', (conn) => {
                conn.on('data', onPeerData);
                conn.on('open', () => {
                    conn.send("Hi");
                });
                conn.on('error', (err) => { console.log("Peer Error", err) })
            });
        }
    })();
    // }, [])
}

export function connectToOther(id) {
    if (!peer) {
        Router.replace('/');
        return null;
    }
    debugger;
    const user = getUser();
    const conn = peer.connect(id)
    connect[id] = conn;
    conn?.on('open', () => {
        conn.send(`${user} : Hi!!`);
    });
    !isMsgSendOn && startMsgDataSending();
    return connect; // return connection
}

export function getPeer() {
    return peer; // return Peer
}
export function getUsersLocation() {
    return Object.entries(usersLocation); // return Peer
}