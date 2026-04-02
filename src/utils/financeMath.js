
export const calculateWeightedRate = (financeData) => {
  const containerPayments = financeData.filter(
    (item) =>
      Number(item.is_container_payment) === 1 &&
      item.currency === "USD" &&
      Number(item.rate) > 0
  );

  if (!containerPayments.length) return 0;

  const totals = containerPayments.reduce((acc, item) => {
    const usd = Number(item.amount) || 0;
    const rate = Number(item.rate) || 0;
    acc.usd += usd;
    acc.ngn += (usd * rate);
    return acc;
  }, { usd: 0, ngn: 0 });

  return totals.usd > 0 ? totals.ngn / totals.usd : 0;
};


export const calculateOverheadShare = (financeData, containerCount) => {
  if (containerCount <= 0) return 0;
  const totalGeneralNGN = financeData.reduce((sum, item) => {
    return Number(item.is_container_payment) === 0 ? sum + Number(item.total_amount || 0) : sum;
  }, 0);
  return totalGeneralNGN / containerCount;
};