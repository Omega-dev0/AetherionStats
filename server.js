import chalk from "chalk";

var fs = require('fs');
var path = require('path');
const routesFolder = "./routes";

let routes = {}

const HTMLGenerator = require("./modules/HTMLConstants.js").default;


async function loadConfig() {

    // Load routes
    fs.readdir(routesFolder, function (err, files) {
        if (err) { console.error("Could not list the routes directory.", err); process.exit(1); }
        for (var index = 0; index < files.length; index++) {
            let filePath = files[index];
            console.log(chalk.yellow(`[${index + 1}/${files.length}]`) + ` - Loading route ${filePath}`);
            let route = require(`./routes/${filePath}`).default;
            routes[route.name] = route;
        }
    })

    
}

loadConfig();

Bun.serve({
    development: true,
    port: 80,
    hostname: "0.0.0.0",
    async fetch(req) {
        const url = new URL(req.url);
        console.log(url.pathname,url.pathname.split(".")[0].split("/")[1]);
        let route = routes[url.pathname.split(".")[0].split("/")[1]];
        if (url.pathname == "/") {
            return Response.redirect('/home', 302);
        }
        if (route) {
            let response = await route.handler(req);
            if(response.type == "html"){
                let body = response.body;
                body = body.replaceAll("{{metadata}}", HTMLGenerator.getMetadataHTML(route.title || route.name));

                body = HTMLGenerator.replaceConstants(body)

                return new Response(body, { headers: { "Content-Type": "text/html" } });
            }else{
                return response.data
            }
        } else {
            return new Response("Not found", { status: 404 })
        }
    },
})


