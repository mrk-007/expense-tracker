import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/helper';

/**
 * TransactionItem — Single row for an income or expense entry
 * Props: transaction, onDelete
 */
const TransactionItem = ({ transaction, onDelete }) => {
  const { _id, icon, category, description, date, amount, type } = transaction;

  const isIncome = type === 'income';

  return (
    <div className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors duration-150 group">
      {/* Emoji icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-[#E0F2FE]">
        {icon || (isIncome ? '💰' : '💸')}
      </div>

      {/* Category & description */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-[#111827] truncate">{category}</p>
        {description && (
          <p className="text-[11.5px] text-[#9CA3AF] truncate">{description}</p>
        )}
      </div>

      {/* Date */}
      <span className="text-[11.5px] text-[#9CA3AF] shrink-0 hidden sm:block">
        {formatDate(date)}
      </span>

      {/* Amount */}
      <span
        className={`text-[14px] font-bold shrink-0 ${
          isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'
        }`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(amount)}
      </span>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(_id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-red-50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
          aria-label="Delete transaction"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default TransactionItem;
