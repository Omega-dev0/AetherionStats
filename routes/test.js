
let module = {
    name: "test",
    handler: async function (req) {
        return {
            type:"html",
            body: "Hello world"
        }
    }
};

export default module;