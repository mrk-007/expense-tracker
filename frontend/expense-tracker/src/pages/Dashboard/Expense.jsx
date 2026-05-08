import React, { useEffect, useState, useCallback } from 'react';
import { TrendingDown, Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import InfoCard from '../../components/cards/InfoCard';
import CustomLineChart from '../../components/charts/CustomLineChart';
import CustomPieChart from '../../components/charts/CustomPieChart';
import TransactionItem from '../../components/TransactionItem';
import Modal from '../../components/Modal';
import EmojiPickerPopup from '../../components/EmojiPickerPopup';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { useUser } from '../../context/UserContext';
import useUserAuth from '../../hooks/useUserAuth';
import { formatCurrency, aggregateByMonth, aggregateByCategory, downloadBlobAsCSV } from '../../utils/helper';
import { EXPENSE_CATEGORIES } from '../../utils/data';

const INITIAL_FORM = { icon: '💸', category: '', amount: '', date: '', description: '' };

const Expense = () => {
  useUserAuth();
  const { fetchTransactions, transactions, addTransaction, deleteTransaction, downloadCSV, loading } = useUser();

  const [expenseList, setExpenseList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadExpenses = useCallback(async () => {
    await fetchTransactions('expense');
  }, [fetchTransactions]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    setExpenseList(transactions.filter((t) => t.type === 'expense'));
  }, [transactions]);

  const totalExpense = expenseList.reduce((sum, t) => sum + t.amount, 0);
  const chartData = aggregateByMonth(expenseList);
  const pieData = aggregateByCategory(expenseList);

  // ---------- Form validation ----------
  const validateForm = () => {
    const errors = {};
    if (!form.category.trim()) errors.category = 'Category is required';
    if (!form.amount || Number(form.amount) <= 0) errors.amount = 'Amount must be greater than 0';
    if (!form.date) errors.date = 'Date is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      await addTransaction({ ...form, type: 'expense', amount: Number(form.amount) });
      toast.success('Expense added!');
      setShowAddModal(false);
      setForm(INITIAL_FORM);
      await loadExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success('Expense deleted');
      await loadExpenses();
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteTarget(null);
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadCSV('expense');
      downloadBlobAsCSV(blob, 'expenses.csv');
      toast.success('CSV downloaded!');
    } catch {
      toast.error('No data to download');
    }
  };

  const inputClass = (err) =>
    `w-full h-10 px-3 rounded-[10px] border text-[13px] text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
      err ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-gray-200 bg-gray-50 focus:ring-[#7DD3FC] focus:border-[#0EA5E9]'
    }`;

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      <Sidebar />

      <div className="flex-1 ml-[240px] flex flex-col">
        <Navbar title="Expense" />

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <InfoCard
              title="Total Expenses"
              amount={formatCurrency(totalExpense)}
              icon={<TrendingDown size={20} />}
              color="red"
              trend="All time"
            />
            <div className="flex gap-3 ml-6">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-gray-200 text-[13px] font-semibold text-[#6B7280] hover:bg-white hover:border-[#6C5DD3] hover:text-[#6C5DD3] transition-all"
              >
                <Download size={15} /> CSV
              </button>
              <button
                id="add-expense-btn"
                onClick={() => { setForm(INITIAL_FORM); setFormErrors({}); setShowAddModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white text-[13px] font-semibold shadow-md shadow-red-200 hover:opacity-90 transition-all"
              >
                <Plus size={15} /> Add Expense
              </button>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Line chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[15px] font-bold text-[#111827] mb-1">Expense Trend</h3>
              <p className="text-[12px] text-[#9CA3AF] mb-4">Monthly expense overview</p>
              {loading || chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[220px] text-[13px] text-[#9CA3AF]">
                  {loading ? 'Loading...' : 'No data yet — add your first expense!'}
                </div>
              ) : (
                <CustomLineChart data={chartData} dataKey="expense" color="#F97316" gradientId="expenseGrad" />
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[15px] font-bold text-[#111827] mb-1">By Category</h3>
              <p className="text-[12px] text-[#9CA3AF] mb-2">Expense breakdown</p>
              {loading ? (
                <div className="flex items-center justify-center h-[260px] text-[13px] text-[#9CA3AF]">Loading...</div>
              ) : (
                <CustomPieChart data={pieData} />
              )}
            </div>
          </div>

          {/* Transaction list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-[15px] font-bold text-[#111827] mb-4">Expense History</h3>
            {loading ? (
              <p className="text-[13px] text-[#9CA3AF] text-center py-8">Loading...</p>
            ) : expenseList.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] text-center py-8">No expense records yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {expenseList.map((t) => (
                  <TransactionItem
                    key={t._id}
                    transaction={t}
                    onDelete={(id) => setDeleteTarget(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Expense"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Emoji + Category row */}
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <label className="text-[11px] font-semibold text-[#374151] mb-1 block">Icon</label>
              <EmojiPickerPopup
                selectedEmoji={form.icon}
                onSelect={(emoji) => setForm({ ...form, icon: emoji })}
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-[#374151] mb-1 block">Category *</label>
              <input
                id="expense-category"
                list="expense-category-suggestions"
                type="text"
                placeholder="e.g. Food & Dining"
                value={form.category}
                onChange={(e) => { setForm({ ...form, category: e.target.value }); setFormErrors({ ...formErrors, category: '' }); }}
                className={inputClass(formErrors.category)}
              />
              <datalist id="expense-category-suggestions">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label} />
                ))}
              </datalist>
              {formErrors.category && <span className="text-[11px] text-red-500 mt-0.5 block">{formErrors.category}</span>}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-[11px] font-semibold text-[#374151] mb-1 block">Amount (USD) *</label>
            <input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => { setForm({ ...form, amount: e.target.value }); setFormErrors({ ...formErrors, amount: '' }); }}
              className={inputClass(formErrors.amount)}
            />
            {formErrors.amount && <span className="text-[11px] text-red-500 mt-0.5 block">{formErrors.amount}</span>}
          </div>

          {/* Date */}
          <div>
            <label className="text-[11px] font-semibold text-[#374151] mb-1 block">Date *</label>
            <input
              id="expense-date"
              type="date"
              value={form.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => { setForm({ ...form, date: e.target.value }); setFormErrors({ ...formErrors, date: '' }); }}
              className={inputClass(formErrors.date)}
            />
            {formErrors.date && <span className="text-[11px] text-red-500 mt-0.5 block">{formErrors.date}</span>}
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-[#374151] mb-1 block">Description (optional)</label>
            <input
              id="expense-description"
              type="text"
              placeholder="e.g. Lunch at restaurant"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass(false)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-11 w-full rounded-[12px] bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white text-[13.5px] font-semibold shadow-md shadow-red-200 hover:opacity-90 transition-all disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        itemName="this expense entry"
      />
    </div>
  );
};

export default Expense;