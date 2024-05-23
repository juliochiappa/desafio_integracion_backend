import cartModel from './models/carts.models.js';

const cartManager = (io) => {
  return {
    
    getAllCarts: async (req, res) => {
      try {
        const carts = await cartModel.find();
        res.status(200).send({ origin: config.SERVER, payload: carts });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los carritos");
      }
    },
  
    createCart: async (req, res) => {
      try {
        const newCart = new Cart({ products: [] });
        const savedCart = await newCart.save();
        io.emit('cartUpdated', savedCart); // Emitir evento de Socket.IO
        res.status(200).send({ origin: config.SERVER, payload: savedCart });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al crear el carrito" });
      }
    },
  
    getCartById: async (req, res) => {
      try {
        const cart = await cartModel.findById(req.params.cid);
        if (cart) {
          res.status(200).send({ origin: config.SERVER, payload: cart });
        } else {
          res.status(404).send("Carrito no encontrado");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el carrito");
      }
    },
  
    addProductToCart: async (req, res) => {
      try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
  
        const cart = await cartModel.findById(cartId);
        if (!cart) {
          return res.status(404).send({ error: "Carrito no encontrado" });
        }
  
        const productInCart = cart.products.find(
          (item) => item.product.toString() === productId
        );
        if (productInCart) {
          productInCart.quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }
  
        const updatedCart = await cart.save();
        io.emit('cartUpdated', updatedCart); // Emitir evento de Socket.IO
        res.status(200).send({ origin: config.SERVER, payload: updatedCart });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al agregar el producto al carrito" });
      }
    },
  };
};

export default cartManager;
