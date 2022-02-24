const User = {
    username : undefined
}

export function setUser(username){
    User.username = username;
}

export function getUser(){
    return User.username;
}

