const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

 let idCounter = 0;
 const path = 'carritos.json'

 // Función para obtener el ID máximo de los carritos existentes
 async function getMaxCartId() {
    try {
        const carts = await readJSONFile('carritos.json');
        const maxId = carts.reduce((max, cart) => Math.max(max, cart.id), 0);
        console.log(maxId)
        return maxId;
    } catch (error) {
        throw new Error(`Error al obtener el ID máximo de los carritos: ${error.message}`);
    }
}

// Función para generar un ID único autoincremental
async function generateID() {
    if (idCounter === 0) {
        // Obtener el último ID máximo de los carritos existentes
        const maxCartId = await getMaxCartId();
        idCounter = maxCartId + 1; 
    } else {
        idCounter++; // Incrementar el contador
    }
    return idCounter; // Devolver el ID autoincremental
}


async function readJSONFile(path) {
    try {
        const data = await fs.readFile(path, 'utf-8');
        if (!data.trim()) {
            // Si el archivo está vacío, devolver un array vacío
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error al leer el archivo ${path}: ${error.message}`);
    }
}


router.post('/', async (req, res) => {
    try {
        const carts = await readJSONFile(path);
        const newCart = {
            id: await generateID(),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(path, JSON.stringify(carts, null, 2), 'utf-8');
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Ruta para listar los productos del carrito
router.get('/:cid', async (req, res) => {
    try {
        const carts = await readJSONFile(path);
        const cartsArray = JSON.parse(carts);
        const cart = cartsArray.find(carts => carts.id === Number(req.params.cid));
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await readJSONFile(path);
        const cart = carts.find(cart => cart.id === Number(req.params.cid));
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const productId = req.params.pid;
        let product = cart.products.find(product => product.product === productId);
        if (product) {
            // Si el producto ya existe, incrementar la cantidad
            product.quantity++;
        } else {
            // Si el producto no existe, agregarlo al carrito
            product = {
                product: productId,
                quantity: 1
            };
            cart.products.push(product);
        }
        await fs.writeFile(path, JSON.stringify(carts, null, 2), 'utf-8');
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
