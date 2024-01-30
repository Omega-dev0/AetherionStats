
let module = {
    name: "file",
    handler: async function (req) {
        return new Response(Bun.file("./hello.txt"));
    }
};

export default module;