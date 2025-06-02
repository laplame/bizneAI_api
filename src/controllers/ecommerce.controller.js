const Ecommerce = require('../models/ecommerce.model');

// Create new e-commerce store
exports.createStore = async (req, res) => {
  try {
    const storeData = {
      ...req.body,
      userId: req.user.userId
    };

    const store = new Ecommerce(storeData);
    await store.save();
    res.status(201).json(store, 'Store created successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error creating store', error: error.message });
  }
};

// Get all stores (with pagination)
exports.getAllStores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stores = await Ecommerce.find()
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email');

    const total = await Ecommerce.countDocuments();

    res.json({
      stores,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStores: total
    }, 'Stores retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stores', error: error.message });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Ecommerce.findById(req.params.id)
      .populate('userId', 'username email');

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(store, 'Store retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store', error: error.message });
  }
};

// Get store by user ID
exports.getStoreByUserId = async (req, res) => {
  try {
    const store = await Ecommerce.findOne({ userId: req.user.userId })
      .populate('userId', 'username email');

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(store, 'Store retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store', error: error.message });
  }
};

// Update store
exports.updateStore = async (req, res) => {
  try {
    const store = await Ecommerce.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    Object.assign(store, req.body);
    await store.save();

    res.json(store, 'Store updated successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error updating store', error: error.message });
  }
};

// Delete store
exports.deleteStore = async (req, res) => {
  try {
    const store = await Ecommerce.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await store.deleteOne();
    res.json(null, 'Store deleted successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error deleting store', error: error.message });
  }
};

// Search stores
exports.searchStores = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { storeName: { $regex: query, $options: 'i' } },
        { storeDescription: { $regex: query, $options: 'i' } },
        { 'contactInfo.city': { $regex: query, $options: 'i' } },
        { 'contactInfo.country': { $regex: query, $options: 'i' } }
      ]
    };

    const stores = await Ecommerce.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email');

    const total = await Ecommerce.countDocuments(searchQuery);

    res.json({
      stores,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStores: total
    }, 'Search results retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error searching stores', error: error.message });
  }
}; 