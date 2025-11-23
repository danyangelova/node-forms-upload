// This code is provided only for educational purpose. It is not intended for production use

const http = require("http");
const queryString = require("querystring");
const path = require("path");
const fs = require("fs");
const { EOL } = require("os");

const server = new http.Server(); //inherits from EventEmitter


server.on("request", (req, res) => { //"request" event passes req and res to the handler
    // console.log(req.url);
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, {
            "Content-type": "text/html",
        });
        res.write(`
        <!DOCTYPE html>
            <html lang="en">
                <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js form</title>
</head>
<body>
    <form action="/upload" method="POST" enctype="multipart/form-data"> <!-- html obiknovena forma ne moje da izprati image -->
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password">
        </div>
        <div>
            <label for="avatar">Avatar</label>
            <input type="file" name="avatar" id="avatar">
        </div>
        <div>
            <input type="submit" value="Send">
        </div>
    </form>
</body>
</html>
`);
        res.end();

    } else if (req.url === "/" && req.method === "POST") {
        console.log('----POST DATA----');
        let body = "";
        req.on("data", chunk => {
            // console.log(`chunk: ${chunk}`); //query string expecting //cqlata forma ni idva kato edin string
            body += chunk;
        });
        req.on("end", () => {
            // console.log(body); //the query string
            const data = queryString.parse(body); //query string -> js object
            // console.log(data);
            res.end();
        });

    } else if (req.url === "/upload" && req.method === "POST") {
        console.log('----POST DATA 2----');

        const body = [];
        req.on("data", chunk => { //every chunk is a Buffer containing raw multipart data (boundary, headers, text, binary)
            body.push(chunk);
        });

        req.on("end", () => {
            const fullBody = Buffer.concat(body); //in one Buffer
            const data = fullBody.toString("binary"); //default: utf8 - to moje da decode-ne greshno binary baitovete; "binary" - dai mi baitovete kato 8 bitovi binarni stoinosti
            const boundary = req.headers['content-type'].split("boundary=")[1];

            const parts = data.split(`--${boundary}`); //because --<boundary>
            // console.log(parts[3]); //the img: headers,   , binary body

            const [meta, imageData] = parts[3].split(EOL + EOL); 
            const fileName = meta.match(/filename="(.+)"/)[1];

            //where we want to save the uploaded file on the server
            const savePath = path.join(__dirname, 'uploads', fileName); //example: /Users/Dani/Projects/node-forms-upload/uploads/image-heart.jpg

            //now save the file on the disk
            fs.writeFile(savePath, imageData, 'binary', (err) => {  //zapazvame faila lokalno na savePath (na servera)
                if (err) {
                    return res.end();
                }
                console.log('Image uploaded');
                res.end();
            });
        });

    }


});

server.listen(3000);
