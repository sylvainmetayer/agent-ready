ServeMe = require('serve-me');

let serveMe = ServeMe({
    debug: true,
    log: true,
    home: "index.html",
    directory: "./",
});

serveMe.start(8080);
