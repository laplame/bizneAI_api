const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('role');
    res.json(users, 'Users retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user, 'User retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();
    res.json(user, 'User updated successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json(null, 'User deleted successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}; 