
let module = {
    name: "home",
    title: "Aetherion Stats",
    handler: async function (req) {

        let file = Bun.file("./files/home.html");
        let data = await file.text();

        return {
            type:"html",
            body: data
        }
        
    }
};

export default module;