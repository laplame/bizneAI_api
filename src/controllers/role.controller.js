const Role = require('../models/role.model');
const User = require('../models/user.model');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role', error: error.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = new Role({
      name,
      permissions,
      description
    });

    await role.save();
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if new name conflicts with existing role
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'Role name already exists' });
      }
    }

    // Update fields
    if (name) role.name = name;
    if (permissions) role.permissions = permissions;
    if (description) role.description = description;

    await role.save();
    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if role is in use
    const usersWithRole = await User.countDocuments({ role: role._id });
    if (usersWithRole > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete role that is assigned to users',
        usersCount: usersWithRole
      });
    }

    await role.deleteOne();
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error: error.message });
  }
}; 