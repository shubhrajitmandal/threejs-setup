const express = require("express");
const http = require("http");
const path = require("path");

const port = 8000;

class App {
  constructor(port) {
    this.port = port;
    const app = express();
    app.use("/", express.static(path.join(__dirname, "/public")));
    app.use(
      "/build/",
      express.static(path.join(__dirname, "node_modules/three/build"))
    );
    app.use(
      "/jsm/",
      express.static(path.join(__dirname, "node_modules/three/examples/jsm/"))
    );
    app.use(
      "/shader/",
      express.static(path.join(__dirname, "/public/shader/"))
    );

    this.server = new http.Server(app);
  }

  Start() {
    this.server.listen(this.port, () => {
      console.log(`Server Running :: Visit http://127.0.0.1:${this.port}.`);
    });
  }
}

new App(port).Start();
