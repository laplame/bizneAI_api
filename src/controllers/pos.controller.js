const POS = require('../models/pos.model');
const Product = require('../models/product.model');

exports.createSale = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    // Validate items and update stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Generate sale number
    const saleNumber = `SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const sale = new POS({
      saleNumber,
      items,
      paymentMethod,
      cashier: req.user.userId
    });

    await sale.save();
    res.status(201).json(sale, 'Sale created successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale', error: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await POS.find()
      .populate('items.product')
      .populate('cashier', 'username');
    res.json(sales, 'Sales retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await POS.findById(req.params.id)
      .populate('items.product')
      .populate('cashier', 'username');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale, 'Sale retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale', error: error.message });
  }
};

exports.cancelSale = async (req, res) => {
  try {
    const sale = await POS.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.status !== 'completed') {
      return res.status(400).json({ message: 'Sale is already cancelled or refunded' });
    }

    // Return items to stock
    for (const item of sale.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    sale.status = 'cancelled';
    await sale.save();
    res.json(sale, 'Sale cancelled successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling sale', error: error.message });
  }
};

exports.getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sales = await POS.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('items.product')
    .populate('cashier', 'username');
    
    res.json(sales, 'Sales retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales by date range', error: error.message });
  }
}; 