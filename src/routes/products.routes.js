const { Router } = require('express')
const ProductManager = require("./../../ProductManager.js");
const router = Router()

const pathDB = 'productos.json'
const products = new ProductManager(pathDB)

//products routes
router.get('/',async (req, res) => {
    try {
        return res.json({
            ok: true,
            productos: await products.getProducts(),
        })
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: error
        });
    }
})


// POST /api/products/:pid
router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;

    try {
        const product = await products.getProductById(pid);

        return res.json({
            ok: true,
            producto: product
        });
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: error
        });
    }
});

// POST
router.post('/', async (req, res) => {
    try{
    const product = req.body;
        return res.json({
            ok: true,
            productos: await products.addProduct(product),
        });
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: error
        });
    }
})


//PUT 
router.put('/:pid',async (req,res) =>{
    try{
        const id = req.params.pid
        const product = products.getProductById(id);
            return res.json({
                ok: true,
                updatedProduct: await products.updateProduct(id,product),
            });
    } catch (error) {
            return res.status(404).json({
                ok: false,
                message: error
            });
    }
})

//DELETE
router.delete('delete/:pid',async (req,res) =>{

})

module.exports = router

