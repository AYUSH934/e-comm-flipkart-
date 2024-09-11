const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Sign up route
router.post('/signup', async (req, res) => {



    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/getloginuser', async (req, res) => {
  const {email} = req.body

  const user = await Product.find({email})

  res.json({
    user
});
})


router.get('/getLoginUserDetail',async (req,res)=>{

    const userId = req.headers.userid

    const user = await User.find({_id:userId})

    res.json({
        user
    });
    
})

module.exports = router;
