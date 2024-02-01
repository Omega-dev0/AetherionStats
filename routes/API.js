
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

                for (let kill of process.KILLS) {
                    if (kill.killerData.userId == userId && kill.victimData.userId != userId) {
                        stats.averageFps += kill.killerData.fps;
                        stats.averagePing += kill.killerData.ping;

                        stats.kills++;
                        let distance = Math.floor(kill.distance);
                        stats.averageKillReach += distance;
                        if (stats.killDistanceDistribution[distance]) {
                            stats.killDistanceDistribution[distance]++;
                        } else {
                            stats.killDistanceDistribution[distance] = 1;
                        }

                        count++;
                    } else if (kill.victimData.userId == userId && kill.killerData.userId != userId) {
                        stats.averageFps += kill.killerData.fps;
                        stats.averagePing += kill.killerData.ping;
                        stats.deaths++;

                        let distance = Math.floor(kill.distance);
                        stats.averageDeathReach += distance;
                        if (stats.deathDistanceDistribution[distance]) {
                            stats.deathDistanceDistribution[distance]++;
                        } else {
                            stats.deathDistanceDistribution[distance] = 1;
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

                stats.averageFps = Math.floor(stats.averageFps / count);
                stats.averagePing = Math.floor(stats.averagePing / count);
                stats.averageKillReach = Math.floor(stats.averageKillReach / count * 100) / 100;
                stats.averageDeathReach = Math.floor(stats.averageDeathReach / count * 100) / 100;
                stats.kd = Math.floor(stats.kills / stats.deaths * 100) / 100;

                resolve({
                    type: "json",
                    data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
                })
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