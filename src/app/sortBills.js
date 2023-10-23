export const sortBills = (bills) => {
  if (bills === undefined) {
    return;
  }
  return bills.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};
