
let module = {
    name: "api",
    handler: async function (req) {
        const url = new URL(req.url);
        let path = url.pathname.replace("/api/", "")


        //SENDS BACK DATA ABOUT REGISTERED KILLS
        if(path == "kills"){
            let userId = url.searchParams.get("userId");
            let stats = {
                averageFps: 0,
                averagePing: 0,
                kills: 0,
                deaths: 0,

                killDistanceDistribution: {},
                deathDistanceDistribution: {},

                kd: 0,

                userId: userId
            }
            if(!userId){
                return {
                    type: "json",
                    data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
                }
            }

            
            let count = 0

            for(kill of process.KILLS){
                if(kill.killerData.userId == userId && kill.victimData.userId != userId){
                    stats.averageFps += kill.killerData.fps;
                    stats.averagePing += kill.killerData.ping;

                    stats.kills++;
                    let distance = Math.floor(kill.distance);
                    if(stats.killDistanceDistribution[distance]){
                        stats.killDistanceDistribution[distance]++;
                    }else{
                        stats.killDistanceDistribution[distance] = 1;
                    }

                    count++;
                }else if(kill.victimData.userId == userId && kill.killerData.userId != userId){
                    tats.averageFps += kill.killerData.fps;
                    stats.averagePing += kill.killerData.ping;
                    stats.deaths++;

                    let distance = Math.floor(kill.distance);
                    if(stats.deathDistanceDistribution[distance]){
                        stats.deathDistanceDistribution[distance]++;
                    }else{
                        stats.deathDistanceDistribution[distance] = 1;
                    }

                    count++;
                }
            }

            if(count == 0){
                return {
                    type: "json",
                    data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
                }
            }

            stats.averageFps = Math.floor(stats.averageFps / count);
            stats.averagePing = Math.floor(stats.averagePing / count);
            stats.kd = Math.floor(stats.kills / stats.deaths * 100) / 100;

            return {
                type: "json",
                data: new Response(JSON.stringify(stats), { headers: { "Content-Type": "application/json" } })
            }
        }



        if(path == "rblxData"){
            let userId = url.searchParams.get("userId");

            

            if(!userId){
                return {
                    type: "json",
                    data: new Response(JSON.stringify({}), { headers: { "Content-Type": "application/json" } })
                }
            }
        }

        return {
            type: "json",
            data: new Response(JSON.stringify({status:404}), { headers: { "Content-Type": "application/json" } })
        }
       
    }
};

export default module;