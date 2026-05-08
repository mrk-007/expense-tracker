import React from 'react';

/**
 * InfoCard — Summary card for Balance, Income, Expense
 * Props: title, amount, icon (React element), color ('purple'|'green'|'red'|'orange'), trend (optional string)
 */
const InfoCard = ({ title, amount, icon, color = 'purple', trend }) => {
  const colorMap = {
    purple: {
      gradient: 'from-[#6ED3E5] to-[#1FB6D5]',
      bg: 'bg-[#E0F2FE]',
      text: 'text-[#0EA5E9]',
      shadow: 'shadow-cyan-200',
    },
    green: {
      gradient: 'from-[#16A34A] to-[#22C55E]',
      bg: 'bg-green-50',
      text: 'text-green-600',
      shadow: 'shadow-green-200',
    },
    red: {
      gradient: 'from-[#DC2626] to-[#EF4444]',
      bg: 'bg-red-50',
      text: 'text-red-500',
      shadow: 'shadow-red-200',
    },
    orange: {
      gradient: 'from-[#1FB6D5] to-[#169CB8]',
      bg: 'bg-[#E0F2FE]',
      text: 'text-[#1FB6D5]',
      shadow: 'shadow-cyan-200',
    },
  };

  const c = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.shadow} text-white shrink-0`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] text-[#9CA3AF] font-medium uppercase tracking-wide truncate">
          {title}
        </p>
        <p className="text-[22px] font-bold text-[#111827] leading-tight mt-0.5 truncate">
          {amount}
        </p>
        {trend && (
          <p className={`text-[11px] font-medium mt-0.5 ${c.text}`}>{trend}</p>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
