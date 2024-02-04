const express = require("express")
const http = require('http')
const productsRoutes = require('./routes/products.routes.js')
const cartsRoutes = require('./routes/carts.routes.js')
const path = require('path')
const handlebars = require("express-handlebars")
const { Server } = require('socket.io')




const PORT = 8080
const app = express();
const API_PREFIX = 'api'

const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", productsRoutes);

//products app
app.use(`/${API_PREFIX}/products`, productsRoutes);
app.use(`/${API_PREFIX}/carts`, cartsRoutes);

    //carts routes
    // app.get(`${API_PREFIX}/carts`,(req, res) => {
    //     return res.json({
    //         ok: true,
    //         carts: carts
//     })
// })


