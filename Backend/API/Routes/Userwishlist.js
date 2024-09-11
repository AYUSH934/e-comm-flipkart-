const express = require('express');
const router = express.Router();
const Wishlist = require('../Model/Wishlist');

// Add product to wishlist
router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;

  console.log(req.body);
  

  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Remove product from wishlist
router.post('/remove', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(product => product.toString() !== productId);
      await wishlist.save();
      res.json(wishlist);
    } else {
      res.status(404).send('Wishlist not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});




module.exports = router;
