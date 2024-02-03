import chalk from "chalk";
import { MongoClient, ServerApiVersion }from "mongodb"

var fs = require('fs');
var path = require('path');
const routesFolder = "./routes";
const uri = "mongodb+srv://aetherionStatsServer:xkHspArl0qbU2c5U@cluster0.qldugy4.mongodb.net/?retryWrites=true&w=majority";

let args = {}
let slice = process.argv.slice(2);
for(var i = 0; i < slice.length; i+=2){
    args[slice[i]] = slice[i+1];
}
console.log(args);

let routes = {}
process.KILLS = [];


const HTMLGenerator = require("./modules/HTMLConstants.js").default;
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true}});



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


const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    'Access-Control-Allow-Headers': 'Content-Type',
}

Bun.serve({
    development: args["--dev"] == "true",
    port: args["--port"] || 80,
    hostname: "0.0.0.0",
    async fetch(req) {
        const url = new URL(req.url);
        let route = routes[url.pathname.split(".")[0].split("/")[1]];


        if (url.pathname == "/") {
            return Response.redirect('/home', 302);
        }
        if (req.method === 'OPTIONS') {
            const res = new Response('Departed', {headers: CORS_HEADERS});
            return res;
        }
        if (route) {
            let response = await route.handler(req);

            if(response.type == "html"){
                let body = response.body;
                body = body.replaceAll("{{metadata}}", HTMLGenerator.getMetadataHTML(response.title || route.title || route.name));

                body = HTMLGenerator.replaceConstants(body)

                return new Response(body, { headers: { "Content-Type": "text/html", ...CORS_HEADERS} });
            }else{
                return response.data
            }
        } else {
            return new Response("Not found", { status: 404 })
        }
    },
})

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(chalk.green("Connected to database"));

        const database = client.db("Aetherion");
        const collection = database.collection('kills');
        const changeStream = collection.watch();
        changeStream.on('change', next => {
            console.log(next);
            process.KILLS.push(next.fullDocument)
        });

        if(args["--dev"] == "false"){
            const docs = await collection.find().toArray();
            process.KILLS.push(...docs);
            console.log(chalk.green(`Loaded ${docs.length} kills from database`));
        }else{
            console.log(chalk.yellow("Skipping loading kills from database"));
        }
        
        
    } catch (e) {
        console.error(chalk.red("Could not connect to database"));
        console.error(e);
    }
}

if(args["--db"] != "false"){
    connectToDatabase()
}