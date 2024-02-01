
let module = {
    name: "user",
    title: "Aetherion Stats",
    handler: async function (req) {

        const url = new URL(req.url);
        let username = url.searchParams.get("username");

        let file = Bun.file("./files/user.html");
        let data = await file.text();

        return {
            type:"html",
            body: data,
            title: `${username}'s stats`,
        }
        
    }
};

export default module;