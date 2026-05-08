import React, { useEffect, useState, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import InfoCard from '../../components/cards/InfoCard';
import CustomBarChart from '../../components/charts/CustomBarChart';
import CustomPieChart from '../../components/charts/CustomPieChart';
import TransactionItem from '../../components/TransactionItem';
import { useUser } from '../../context/UserContext';
import useUserAuth from '../../hooks/useUserAuth';
import { formatCurrency, aggregateByMonth, aggregateByCategory } from '../../utils/helper';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { fetchTransactions, transactions, loading, getSummary } = useUser();

  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  const loadData = useCallback(async () => {
    await fetchTransactions();
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  }, [fetchTransactions, getSummary]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chartData = aggregateByMonth(transactions);
  const pieData = aggregateByCategory(transactions);
  const recentTransactions = [...transactions].slice(0, 6);

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      <Sidebar />

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <Navbar title="Dashboard" />

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <InfoCard
              title="Total Balance"
              amount={formatCurrency(summary.balance)}
              icon={<Wallet size={20} />}
              color="purple"
              trend="Net worth"
            />
            <InfoCard
              title="Total Income"
              amount={formatCurrency(summary.totalIncome)}
              icon={<TrendingUp size={20} />}
              color="green"
              trend="All time income"
            />
            <InfoCard
              title="Total Expenses"
              amount={formatCurrency(summary.totalExpense)}
              icon={<TrendingDown size={20} />}
              color="red"
              trend="All time expenses"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#111827]">Income vs Expenses</h3>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">Monthly comparison</p>
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center h-[240px] text-[13px] text-[#9CA3AF]">
                  Loading chart...
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[240px] text-[13px] text-[#9CA3AF]">
                  No transaction data yet
                </div>
              ) : (
                <CustomBarChart data={chartData} />
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-2">
                <h3 className="text-[15px] font-bold text-[#111827]">Expense Breakdown</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">By category</p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center h-[240px] text-[13px] text-[#9CA3AF]">
                  Loading...
                </div>
              ) : (
                <CustomPieChart data={pieData} />
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#111827]">Recent Transactions</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">Latest activity</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/income')}
                  className="flex items-center gap-1 text-[12px] text-[#22C55E] font-semibold hover:underline"
                >
                  Income <ArrowRight size={13} />
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => navigate('/expense')}
                  className="flex items-center gap-1 text-[12px] text-[#EF4444] font-semibold hover:underline"
                >
                  Expenses <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-[13px] text-[#9CA3AF] text-center py-8">Loading transactions...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] text-center py-8">
                No transactions yet. Add your first income or expense!
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentTransactions.map((t) => (
                  <TransactionItem key={t._id} transaction={t} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;