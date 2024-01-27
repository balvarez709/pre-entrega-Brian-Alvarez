const express = require("express")
const http = require('http')
const productsRoutes = require('./routes/products.routes.js')
const cartsRoutes = require('./routes/carts.routes.js')

const PORT = 8080
const app = express();
const API_PREFIX = 'api'

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//products app
app.use(`/${API_PREFIX}/products`, productsRoutes);

//carts routes
// app.get(`${API_PREFIX}/carts`,(req, res) => {
//     return res.json({
//         ok: true,
//         carts: carts
//     })
// })

app.listen(PORT, () =>{
    console.log('SERVIDOR EJECUTANDOSE')
})

