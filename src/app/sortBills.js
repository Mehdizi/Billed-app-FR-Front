export const sortBills = (bills) => {
  return bills.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};
