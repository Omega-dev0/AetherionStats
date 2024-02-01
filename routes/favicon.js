
let module = {
    name: "favicon",
    handler: async function (req) {
        return {
            type:"file",
            data: new Response(Bun.file("./files/favicon.png"))
        }
    }
};

export default module;