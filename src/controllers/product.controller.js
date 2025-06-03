const Product = require('../models/product.model');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products, 'Products retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product, 'Product retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      cost,
      description,
      category,
      photoFilename,
      photoUrl,
      isWeightBased,
      metadata
    } = req.body;

    // Validate required fields
    if (!name || !price || !cost || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create product with metadata
    const product = new Product({
      name,
      price,
      cost,
      description,
      category,
      photoFilename,
      photoUrl,
      isWeightBased,
      metadata: {
        ...metadata,
        createdAt: metadata?.createdAt || new Date(),
        platform: metadata?.platform || 'web',
        hasLocalPhoto: metadata?.hasLocalPhoto || false,
        hasCloudinaryUrl: metadata?.hasCloudinaryUrl || false,
        isWeightBased: metadata?.isWeightBased || false
      }
    });

    await product.save();
    res.status(201).json(product, 'Product created successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      price,
      cost,
      description,
      category,
      photoFilename,
      photoUrl,
      isWeightBased,
      metadata
    } = req.body;

    // Update product fields
    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (cost !== undefined) product.cost = cost;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (photoFilename !== undefined) product.photoFilename = photoFilename;
    if (photoUrl !== undefined) product.photoUrl = photoUrl;
    if (isWeightBased !== undefined) product.isWeightBased = isWeightBased;

    // Update metadata if provided
    if (metadata) {
      product.metadata = {
        ...product.metadata,
        ...metadata,
        createdAt: metadata.createdAt || product.metadata.createdAt,
        platform: metadata.platform || product.metadata.platform,
        hasLocalPhoto: metadata.hasLocalPhoto ?? product.metadata.hasLocalPhoto,
        hasCloudinaryUrl: metadata.hasCloudinaryUrl ?? product.metadata.hasCloudinaryUrl,
        isWeightBased: metadata.isWeightBased ?? product.metadata.isWeightBased
      };
    }

    await product.save();
    res.json(product, 'Product updated successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json(null, 'Product deleted successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock += quantity;
    await product.save();
    res.json(product, 'Stock updated successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
}; 