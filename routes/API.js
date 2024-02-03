
const RLX_API_KEY = "3MABQQL8yESygySXSvx/8ZRSxqDtFsYKZF2KBmMaZ6s/dtb+"

let module = {
    name: "api",
    handler: function (req) {
        return new Promise((resolve, reject) => {
            const url = new URL(req.url);
            let path = url.pathname.replace("/api/", "").split("?")[0].toLowerCase();

            //SENDS BACK DATA ABOUT REGISTERED KILLS
            if (path == "kills") {
                let userId = url.searchParams.get("userId");
                let stats = {
                    averageFps: 0,
                    averagePing: 0,
                    kills: 0,
                    deaths: 0,
                    averageKillReach: 0,
                    averageDeathReach: 0,

                    killDistanceDistribution: {},
                    deathDistanceDistribution: {},

                    mobileRatio: 0,

                    opponents: {},

                    kd: 0,

                    userId: userId
                }
                if (!userId) {
                    resolve({
                        type: "json",
                        data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
                    })
                }


                let count = 0
                let killCount = 0;
                let deathCount = 0;

                for (let kill of process.KILLS) {
                    if (kill.killerData.userId == userId && kill.victimData.userId != userId) {
                        killCount++;
                        stats.averageFps += kill.killerData.fps;
                        stats.averagePing += kill.killerData.ping;

                        stats.kills++;
                        let distance = Math.min(Math.max(Math.floor(kill.distance), -1), 20)
                        stats.averageKillReach += distance;
                        if (stats.killDistanceDistribution[distance]) {
                            stats.killDistanceDistribution[distance]++;
                        } else {
                            stats.killDistanceDistribution[distance] = 1;
                        }

                        if (stats.opponents[kill.victimData.userId]) {
                            stats.opponents[kill.victimData.userId].loss++; 
                        }else{
                            stats.opponents[kill.victimData.userId] = {
                                wins: 0,
                                loss: 1,
                            }
                        }

                        if(kill.killerData.isMobile == true){
                            stats.mobileRatio++;
                        }

                        count++;
                    } else if (kill.victimData.userId == userId && kill.killerData.userId != userId) {
                        deathCount++;
                        stats.averageFps += kill.victimData.fps;
                        stats.averagePing += kill.victimData.ping;
                        stats.deaths++;

                        let distance = Math.min(Math.max(Math.floor(kill.distance), -1), 20)
                        stats.averageDeathReach += distance;
                        if (stats.deathDistanceDistribution[distance]) {
                            stats.deathDistanceDistribution[distance]++;
                        } else {
                            stats.deathDistanceDistribution[distance] = 1;
                        }

                        if (stats.opponents[kill.victimData.userId]) {
                            stats.opponents[kill.victimData.userId].win++;
                        }else{
                            stats.opponents[kill.killerData.userId] = {
                                wins: 1,
                                loss: 0,
                            }
                        }

                        count++;
                    }
                }

                if (count == 0) {
                    resolve({
                        type: "json",
                        data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
                    })
                }

                /*
                stats.opponents = stats.opponents.map((key, value) => {
                    return {
                        userId: key,
                        wins: value.wins,
                        loss: value.loss
                    }
                })
                stats.opponents.sort((a, b) => {
                    return a.wins + a.loss - (b.wins + b.loss); 
                })

                stats.opponents = stats.opponents.slice(0, 10);
                */
                stats.opponents = {}

                stats.averageFps = Math.floor(stats.averageFps / count);
                stats.averagePing = Math.floor(stats.averagePing / count);
                stats.averageKillReach = Math.floor(stats.averageKillReach / killCount * 100) / 100;
                stats.averageDeathReach = Math.floor(stats.averageDeathReach / deathCount * 100) / 100;
                stats.mobileRatio = Math.floor(stats.mobileRatio / killCount * 100) / 100;
                stats.kd = Math.floor(stats.kills / stats.deaths * 100) / 100;

                resolve({
                    type: "json",
                    data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
                })
            }

            if (path == "leaderboards") {
                let players = {};
                for (let kill of process.KILLS) {
                    if (players[kill.killerData.userId]) {
                        players[kill.killerData.userId].killCount++;
                    } else {
                        players[kill.killerData.userId] = {
                            killCount: 1,
                            deathCount: 0,
                            KD: 0
                        }
                    }

                    if (players[kill.victimData.userId]) {
                        players[kill.victimData.userId].deathCount++;
                    } else {
                        players[kill.victimData.userId] = {
                            killCount: 0,
                            deathCount: 1,
                            KD: 0
                        }
                    }
                }


                for (let player in players) {
                    players[player].KD = Math.floor(players[player].killCount / players[player].deathCount * 100) / 100;
                }

                let KillsSortedPlayers = Object.keys(players).sort((a, b) => players[b].killCount - players[a].killCount).slice(0, 10);
                let DeathsSortedPlayers = Object.keys(players).sort((a, b) => players[b].deathCount - players[a].deathCount).slice(0, 10);
                
                let KDSortedPlayers = Object.keys(players).filter((a) => players[a].deathCount > 5 && players[a].killCount > 50);
                //console.log(KDSortedPlayers,KDSortedPlayers.map((a) => players[a]))
                KDSortedPlayers = KDSortedPlayers.sort((a, b) => players[b].KD - players[a].KD).slice(0, 10);

                let uniqueUserIds = []

                let FinalData = {
                    kills: [],
                    deaths: [],
                    KD: []
                }

                for (let player of KillsSortedPlayers) {
                    FinalData.kills.push({userId:player, killCount: players[player].killCount})
                    if(!uniqueUserIds.includes(player)){
                        uniqueUserIds.push(player)
                    }
                }
                for (let player of DeathsSortedPlayers) {
                    FinalData.deaths.push({userId:player, deathCount: players[player].deathCount})
                    if(!uniqueUserIds.includes(player)){
                        uniqueUserIds.push(player)
                    }
                }
                for (let player of KDSortedPlayers) {
                    FinalData.KD.push({userId:player, KD: players[player].KD})
                    if(!uniqueUserIds.includes(player)){
                        uniqueUserIds.push(player)
                    }
                }

                fetch('https://users.roblox.com/v1/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        userIds: uniqueUserIds,
                        excludeBannedUsers: false
                    })
                }).then(response => response.json().then(data => {
                    resolve({
                        type: "json",
                        data: new Response(JSON.stringify({
                            kills: FinalData.kills,
                            deaths: FinalData.deaths,
                            KD: FinalData.KD,
                            userInfo: data.data,
                            uniqueUserIds: uniqueUserIds
                        }), { headers: { "Content-Type": "application/json" } })
                    })
                }))

                
            }

            else if (path == "rblxdata") {
                let userId = url.searchParams.get("userId");



                if (!userId) {
                    resolve({
                        type: "json",
                        data: new Response(JSON.stringify({}), { headers: { "Content-Type": "application/json" } })
                    })
                }
            }

            else if (path == "rblxid") {
                let username = url.searchParams.get("username");
                fetch('https://users.roblox.com/v1/usernames/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        usernames: [username],
                        excludeBannedUsers: false
                    })

                }).then(response => response.json())
                    .then(data => {
                        resolve({
                            type: "json",
                            data: new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
                        })
                    })
                    .catch((error) => {
                        resolve({
                            type: "json",
                            data: new Response(JSON.stringify({ status: 500 }), { headers: { "Content-Type": "application/json" } })
                        })
                    });


            }

            else if (path == "rblxinfo") {
                let userId = url.searchParams.get("userId");
                fetch('https://users.roblox.com/v1/users/'+userId, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },

                }).then(response => response.json())
                    .then(data => {
                        resolve({
                            type: "json",
                            data: new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
                        })
                    })
                    .catch((error) => {
                        resolve({
                            type: "json",
                            data: new Response(JSON.stringify({ status: 500 }), { headers: { "Content-Type": "application/json" } })
                        })
                    });


            }

            
            else if (path == "rblxavatar") {
                let userId = url.searchParams.get("userId");
                fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=png`, {
                    method: 'GET',
                    headers: {'Accept': 'application/json' },
                }).then(response => response.json())
                    .then(data => {
                        resolve({
                            type: "json",
                            data: new Response(JSON.stringify(data.data), { headers: { "Content-Type": "application/json" } })
                        })
                    })
                    .catch((error) => {
                        resolve({
                            type: "json",
                            data: new Response(JSON.stringify({ status: 500 }), { headers: { "Content-Type": "application/json" } })
                        })
                    });
            }



            else {
                resolve({
                    type: "json",
                    data: new Response(JSON.stringify({ status: 404 }), { headers: { "Content-Type": "application/json" } })
                })
            }

        })
    }
};

export default module;