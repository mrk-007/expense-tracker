import moment from 'moment';

/**
 * Format a number as currency (INR)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (date, fmt = 'DD MMM YYYY') => {
  if (!date) return '';
  return moment(date).format(fmt);
};

/**
 * Download a blob as a CSV file
 */
export const downloadBlobAsCSV = (blobData, filename = 'transactions.csv') => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Aggregate transactions by month for chart display
 * Returns array of { month, income, expense }
 */
export const aggregateByMonth = (transactions) => {
  const monthMap = {};

  transactions.forEach((t) => {
    const month = moment(t.date).format('MMM YY');
    if (!monthMap[month]) {
      monthMap[month] = { month, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthMap[month].income += t.amount;
    } else {
      monthMap[month].expense += t.amount;
    }
  });

  // Sort chronologically
  return Object.values(monthMap).sort((a, b) =>
    moment(a.month, 'MMM YY').valueOf() - moment(b.month, 'MMM YY').valueOf()
  );
};

/**
 * Aggregate expenses by category for pie chart
 */
export const aggregateByCategory = (transactions) => {
  const catMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

  return Object.entries(catMap).map(([name, value]) => ({ name, value }));
};
