
let module = {
    name: "leaderboards",
    title: "Aetherion leaderboards",
    handler: async function (req) {

        let file = Bun.file("./files/leaderboards.html");
        let data = await file.text();

        return {
            type:"html",
            body: data
        }
        
    }
};

export default module;