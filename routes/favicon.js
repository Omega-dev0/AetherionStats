
let module = {
    name: "favicon",
    handler: async function (req) {
        return new Response(Bun.file("./files/AetherionLogo320x320.png"));
    }
};

export default module;