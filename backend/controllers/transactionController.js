const Transaction = require('../models/Transaction');

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, description, icon } = req.body;

    // Validation
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: 'Type, category, amount, and date are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      category,
      amount: Number(amount),
      date: new Date(date),
      description: description || '',
      icon: icon || '💰',
    });

    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all transactions for current user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure the transaction belongs to the current user
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Download transactions as CSV
// @route   GET /api/transactions/download-csv
// @access  Private
const downloadCSV = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    // Build CSV manually
    const header = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Icon'];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString('en-US'),
      t.type,
      t.category,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.icon,
    ]);

    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="transactions_${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    console.error('CSV download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard summary stats
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addTransaction, getTransactions, deleteTransaction, downloadCSV, getSummary };
