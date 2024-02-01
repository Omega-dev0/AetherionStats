const headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/x-www-form-urlencoded"
};

STATS_DATASTORE_NAME = "playerStatistics"

const url = "https://apis.roblox.com/datastores/v1/universes/4732907434/standard-datastores/datastore/entries/entry";

let module = {
    getPlayerStats: async function (userId) {
        const params = new URLSearchParams({
            datastoreName: STATS_DATASTORE_NAME,
            entryKey: userId
        });

        try {
            const response = await fetch(`${url}?${params}`, {
                method: "GET",
                headers: headers
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data) //TODO
                return data
            } else {
                return {}
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default module;