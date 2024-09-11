const express = require('express');
const Product = require('../Model/Product');
const router = express.Router();
const upload = require('../middleware/upload');

// Add a new product
router.post('/addProduct', async (req, res) => {
    const { name, category, brand, price, description,rating, availability, images} = req.body;
    // const images = req.files.map(file => file.path);

    
    try {
        const product = new Product({ name, category, brand, price, description, images,rating, availability });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Get all products (with optional filters)
router.get('/getProduct', async (req, res) => {
    console.log(req.headers.userid);
    
    const { category, priceRange, brand, rating, page = 1, limit = 5 } = req.query;

    // Parse page and limit as integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).send('Invalid page number');
    }
    if (isNaN(limitNumber) || limitNumber <= 0) {
        return res.status(400).send('Invalid limit number');
    }

    let filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
            filter.price = { $gte: min, $lte: max };
        }
    }
    if (rating) filter.rating = { $gte: rating };

    try {
        // Calculate skip and limit for pagination
        const skip = (pageNumber - 1) * limitNumber;
        const products = await Product.find(filter).skip(skip).limit(limitNumber);
        const totalProducts = await Product.countDocuments(filter); // Get total number of products for pagination info

        res.json({
            products,
            page: pageNumber,
            limit: limitNumber,
            totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Get a single product by ID
router.get('/productGetById/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Search products
router.get('/search', async (req, res) => {
    const { query, flag } = req.query;


    // Handle suggestions
    if (flag === 'suggestion') {
        try {
            if (!query) {
                return res.status(400).send('Query parameter is required');
            }

            // Find unique categories that match the query
            const suggestions = await Product.distinct('category', {
                $text: { $search: query }
            });
    
            // Additionally, perform the search in the 'brand' field
            const brandSuggestions = await Product.distinct('brand', {
                $text: { $search: query }
            });
    
            // Combine and remove duplicates if necessary
            const uniqueSuggestions = Array.from(new Set([...suggestions, ...brandSuggestions]));
    
            res.json(uniqueSuggestions);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
        return;
    }

    // Handle category search
    if (flag === 'search') {
        try {
            const products = await Product.find({
                $text: { $search: query }
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
        return;
    }

    res.status(400).send('Invalid flag');
});


router.get('/getCategory', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        console.log(categories);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



module.exports = router;
