
let module = {
    name: "home",
    handler: async function (req) {
        return new Response("Hello world");
    }
};

export default module;