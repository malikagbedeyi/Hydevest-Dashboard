export const calcContainerAmountUSD = (item) => {
  const base =
    (Number(item.unit_price_usd) || 0) *
    (Number(item.pieces) || 0);

  const shipping = Number(item.shipping_amount_usd || 0);
  const surcharge =
    item.funding === "partner"
      ? Number(item.surcharge || 0)
      : 0;

  return base + shipping + surcharge;
};

export const calcContainerAmountNGN = (item, rate) => {
  return calcContainerAmountUSD(item) * Number(rate || 0);
};

export const calcQuotedNGN = (item, rate) => {
  return (Number(item.quoted_price_usd || 0)) * Number(rate || 0);
};