const { error } = require('console');

const fs = require('fs').promises;
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id = this.id
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

}

class ProductManager {
    constructor(filePath) {
        // this.products = [];
        this.path = filePath;
        //this.loadProductsFromFile();
    }

    async saveProductsToFile(obj) {
        try {
            const data = JSON.stringify(obj,null,2);
            await fs.writeFile(this.path, data, 'utf-8');
        } catch (error) {
            console.error("Error al guardar productos en el archivo:", error.message);
        }
    }

    // async readJSONFile(path) {
    //     try {
    //         const data = await fs.readFile(path, 'utf-8');
    //         if (!data.trim()) {
    //             // Si el archivo está vacío, devolver un array vacío
    //             return [];
    //         }
    //         return JSON.parse(data);
    //     } catch (error) {
    //         throw new Error(`Error al leer el archivo ${path}: ${error.message}`);
    //     }
    // }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        return new Promise(async (resolve, reject) => {
            try {
                // Valido que todos los campos sean obligatorios
                if (!title || !description || !price || !thumbnail || !code || !stock) {
                    reject("Todos los campos son obligatorios.");
                    return;
                }
                const products = await this.getProducts();
                if (products.some(product => product.code === code)) {
                    reject("El código ya existe. Debe ser único.");
                    return;
                }
    
                // Obtengo el ID del último producto si hay productos en la lista
                const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
                // Creo un nuevo producto
                const newProduct = new Product(title, description, price, thumbnail, code, stock)
                // Asigno el ID al nuevo producto
                newProduct.id = lastProductId + 1;
                // Agrego el nuevo producto al arreglo
                products.push(newProduct);
                // Guardo los productos actualizados en el archivo
                await this.saveProductsToFile(products);
    
                resolve(`Producto ${title} agregado con éxito. ID: ${newProduct.id}`);
            } catch (error) {
                reject("Error al agregar el producto.");
            }
        });
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
            
        } catch (error) {
            // Si hay un error (por ejemplo, el archivo no existe), simplemente dejamos el arreglo vacío
            return error
        }
    }

    async getProductById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await this.getProducts();
                const product = products.find(product => product.id === Number(id));
                if (product) {
                    resolve(product);
                } else {
                    reject("Producto no encontrado.");
                }
            } catch (error) {
                console.error('Error al obtener el producto por ID:',error.message)
                reject(error.message)
            }
        });
    }

     async updateProduct(id, updatedProduct) {
         return new Promise(async (resolve, reject) => {
             const products = await this.getProducts()
             const index = products.findIndex(product => product.id === Number(id));
             if (index !== -1) {
                 products[index] = { ...products[index], ...updatedProduct };
                 // Guardo los productos actualizados en el archivo
                 await this.saveProductsToFile(products);

                 resolve(`Producto con ID ${id} actualizado con éxito.`);
             } else {
                 reject("Producto no encontrado. No se pudo actualizar.");
             }
         });
     }

    async deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            const products = await this.getProducts()
            const index = products.findIndex(product => product.id === Number(id));
            console.log(index)
            if (index !== -1) {
                const deletedProduct = products.splice(index, 1)[0];

                // Guardo los productos actualizados en el archivo
                await this.saveProductsToFile(products);

                resolve(`Producto con ID ${id} eliminado con éxito.`);
            } else {
                reject("Producto no encontrado. No se pudo eliminar.");
            }
        });
    }
}

module.exports = ProductManager 





// // Ejemplo de uso
 //const filePath = 'productos.json'; // Ruta del archivo donde se guardarán los productos
 //const productManager = new ProductManager(filePath);

// //  const productIdToUpdate = 1;
//  const updatedProductInfo = {
//      title: "Nuevo Producto",
//      description: "Nueva Descripción",
//      price: 25.99,
//      thumbnail: "nueva_imagen.jpg",
//      code: "DEF456",
//      stock: 60
//  };

//  const main = async() => {
//      try {
//          //await productManager.addProduct("Producto 1", "Descripción 1", 20.99, "imagen1.jpg", "ABC123", 50)
//          //await productManager.addProduct("Producto 2", "Descripción 2", 15.49, "imagen2.jpg", "XYZ789", 30)
//          //await productManager.addProduct("Producto 3", "Descripción 3", 15.49, "imagen2.jpg", "XYZ790", 30)
//          //await productManager.addProduct("Producto 4", "Descripción 4", 15.49, "imagen2.jpg", "XYZ781", 30)
//          //await productManager.addProduct("Producto 5", "Descripción 5", 15.49, "imagen2.jpg", "XYZ783", 30)
//          //const products = await productManager.getProducts()
//          //console.log({products})
//          //await productManager.updateProduct(2, updatedProductInfo)
//          const product = await productManager.getProductById(1)
//          console.log({productUpdated: product})
//          //await productManager.deleteProduct(3)
//          //const finished = await productManager.getProducts()
//          //console.log({finished})
//      } catch (error) {
//          console.log(error)
//      }
//  }


 //main()



