
let module = {
    name: "test",
    handler: async function (req) {
        return new Response("Hello world");
    }
};

export default module;