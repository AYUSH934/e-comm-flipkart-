const express = require('express');
const router = express.Router();
const Cart = require('../Model/Cart');
const Product = require('../Model/Product')

// Add product to cart
router.post('/add', async (req, res) => {

   const userid = req.headers['userId'];

   console.log(userid)

  const { userId, productId, quantity } = req.body;

  console.log(userId)
  
  try {
    let cart = await Cart.findOne({ user: userId });

    

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Find the product and check if it exists
    const product = await Product.findById(productId);
  
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Update totalPrice if product exists
    cart.totalPrice += quantity * product.price;
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});


// Remove product from cart
router.post('/remove', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/getcart', async (req, res) => {
  try {
    const userId = req.headers.userid
    console.log(userId)
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log(cart);
    

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
