// This code is provided only for educational purpose. It is not intended for production use

const http = require("http");

const server = new http.Server(); //inherits from EventEmitter


server.on("request", (req, res) => { //listen for incoming HTTP requests ("request" event)
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
    <form action="/" method="POST">
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="text" name="password" id="password">
        </div>
        <div>
            <input type="submit" value="Send">
        </div>
    </form>
</body>
</html>
`);
        res.end();

    } 


});

server.listen(3000);
