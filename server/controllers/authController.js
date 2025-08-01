const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');
const disposableDomains = require('disposable-email-domains');
const dns = require('dns').promises;


exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!validator.validate(email)) {
            return res.status(400).json({ msg: 'Please enter a valid email address' });
        }

        const domain = email.split('@')[1];
        if (disposableDomains.includes(domain)) {
            return res.status(400).json({ msg: 'Disposable email addresses are not allowed' });
        }

        try {
            const addresses = await dns.resolveMx(domain);
            if (!addresses || addresses.length === 0) {
                // domain exists but has no mail servers configured.
                return res.status(400).json({ msg: 'Email domain cannot receive mail.' });
            }
        } catch (error) {
            // error occurs , means the domain doesn't exist.
            if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
                return res.status(400).json({ msg: 'Email domain does not exist.' });
            }
            // other unexpected DNS errors, log it and send a generic server error.
            console.error('DNS resolution error:', error);
            return res.status(500).send('Server error during email validation.');
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};