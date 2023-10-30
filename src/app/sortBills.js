export const sortBills = (bills) => {
  if (bills === undefined) {
    return;
  }
  if (bills.length === 1) {
    return bills;
  }
  return bills.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};
