export const formatAmount = (amount: number) => {
  // Round the number to the nearest whole number.
  const numAsString = Math.round(amount).toString();
  // Use a regular expression to insert commas as thousands separators from the right.
  return numAsString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};