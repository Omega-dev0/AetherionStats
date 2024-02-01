
let module = {
    name: "error",
    title: "Aetherion Stats",
    handler: async function (req) {
        let file = Bun.file("./files/error.html");
        let data = await file.text();

        return {
            type:"html",
            body: data,
            title: `ERROR`,
        }
        
    }
};

export default module;