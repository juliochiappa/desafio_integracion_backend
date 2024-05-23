import productModel from "./models/products.models.js";

const productManager = (io) => {
  return {
    getAllProducts: async (req, res) => {
      try {
        const products = await productModel.find();
        res.status(200).send({ origin: config.SERVER, payload: products });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos");
      }
    },

    getProductById: async (req, res) => {
      try {
        const product = await productModel.findById(req.params.pid);
        if (product) {
          res.status(200).send({ origin: config.SERVER, payload: product });
        } else {
          res.status(404).send("Producto no encontrado");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el producto");
      }
    },

    addProduct: async (req, res) => {
      try {
        const { title, description, code, price, stock, category, thumbnails } =
          req.body;
        const newProduct = new Product({
          title,
          description,
          code,
          price,
          stock,
          category,
          thumbnails,
        });

        const savedProduct = await newProduct.save();
        io.emit("productAdded", savedProduct); // Emitir evento de Socket.IO
        res.status(200).send({ origin: config.SERVER, payload: savedProduct });
      } catch (error) {
        if (error.code === 11000) {
          res
            .status(400)
            .send({ error: "El código del producto ya está siendo utilizado" });
        } else {
          console.error(error);
          res.status(500).send({ error: "Error al agregar el producto" });
        }
      }
    },

    updateProduct: async (req, res) => {
      try {
        const updatedProduct = await productModel.findByIdAndUpdate(
          req.params.pid,
          req.body,
          { new: true, runValidators: true }
        );
        if (updatedProduct) {
          io.emit("productUpdated", updatedProduct); // Emitir evento de Socket.IO
          res
            .status(200)
            .send({ origin: config.SERVER, payload: updatedProduct });
        } else {
          res.status(404).send("Producto no encontrado");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el producto");
      }
    },

    deleteProduct: async (req, res) => {
      try {
        const deletedProduct = await productModel.findByIdAndDelete(
          req.params.pid
        );
        if (deletedProduct) {
          io.emit("productDeleted", deletedProduct); // Emitir evento de Socket.IO
          res.send("Producto eliminado correctamente");
        } else {
          res.status(404).send("Producto no encontrado");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el producto");
      }
    },
  };
};

export default productManager;
