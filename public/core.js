async function getRBLXIDFromUsername(username){
    let resp =  await fetch(`/api/rblxId?username=${username}`)
    let data = await resp.json()
    return data
}

async function getRBLXAvatar(userId){
    let resp =  await fetch(`/api/rblxavatar?userId=${userId}`)
    let data = await resp.json()
    return data
}

async function getRBLXInfo(userId){
    let resp =  await fetch(`/api/rblxinfo?userId=${userId}`)
    let data = await resp.json()
    return data
}

async function getRBLXKills(userId){
    let resp =  await fetch(`/api/kills?userId=${userId}`)
    let data = await resp.json()
    return data
}

async function getLeaderboards(){
    let resp =  await fetch(`/api/leaderboards`)
    let data = await resp.json()
    return data
}