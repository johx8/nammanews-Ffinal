const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash= await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hash,
        });
        await newUser.save();
        // res.status(201).json({ message: 'User created successfully' });
        const userId = newUser._id;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({message: 'User created successfully', token, userId });

    }
    catch(error){
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = async(req,res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const userId = user._id;
        const token = jwt.sign({ userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ success:true, token, userId, name: user.name, email: user.email, role: user.role });
    }catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Login error' });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};