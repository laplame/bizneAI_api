const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Get default role if not provided
    let userRole = role;
    if (!userRole) {
      const defaultRole = await Role.findOne({ name: 'user' });
      if (!defaultRole) {
        return res.status(500).json({ message: 'Default role not found' });
      }
      userRole = defaultRole._id;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: userRole
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    }, 'User registered successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    }, 'Login successful');
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
}; 