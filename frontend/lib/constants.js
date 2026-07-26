export const EXPENSE_CATEGORIES = [
  { value: 'seeds', label: 'Seeds' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'pesticides', label: 'Pesticides' },
  { value: 'labor', label: 'Labor' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'miscellaneous', label: 'Miscellaneous' }
];

export const INCOME_SOURCES = [
  { value: 'crop_sales', label: 'Crop Sales' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'government_support', label: 'Government Support' },
  { value: 'other_income', label: 'Other Income' }
];

export const CROP_STATUSES = [
  { value: 'growing', label: 'Growing' },
  { value: 'harvested', label: 'Harvested' },
  { value: 'failed', label: 'Failed' }
];

// Helper to format currency in NPR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Helper to format dates cleanly
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
