
let module = {
    name: "files",
    handler: async function (req) {
        const url = new URL(req.url);
        console.log(url.pathname)
        try {
            let file = Bun.file(`./public/${url.pathname.replace("/files/", "")}`);
            if (!file) {
                return {
                    type: "file",
                    data: new Response("Not found", { status: 404 })
                }
            }
            return {
                type: "file",
                data: new Response(file)
            }
        } catch (e) {
            return {
                type: "file",
                data: new Response("Not found", { status: 404 })
            }
        }
    }
};

export default module;