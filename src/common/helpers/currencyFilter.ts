export const currencyFilter = (value: number, currency: string) => {
  if (!value) return 0;

  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency
  }).format(value);
};
