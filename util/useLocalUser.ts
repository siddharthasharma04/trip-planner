import { useState } from 'react';
import isNode from 'detect-node'
const useLocalUser = (): { localUserId: string, setLocalUserId: (a: string) => void } => {
    const getUserId = (): string => (!isNode && window.localStorage.getItem('_mid')) || '';

    const [localUserId, setUserIdInternal] = useState(getUserId);

    const setLocalUserId = (_userId: string) => {
        const d = _userId; //JSON.stringify(_userId);
        window.localStorage.setItem('_mid', d);
        setUserIdInternal(d);
    };

    return { localUserId, setLocalUserId };
};

export const deleteUser = () =>{
    window.localStorage.removeItem('_mid');
    window.localStorage.removeItem('_oid');
    setTimeout(()=>{window.location.reload();},200);
}

export default useLocalUser;