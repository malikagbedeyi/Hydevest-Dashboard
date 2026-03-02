// hooks/useSaleCalculations.js

export const totalPurchase = (pallet) => {
  const price = Number(pallet.purchasePrice) || 0;
  const pallets = Number(pallet.noOfPallets) || 0;
  const piecesPerPallet = Number(pallet.palletOption) || 0;

  return price * pallets * piecesPerPallet;
};

export const totalSaleAmount = (items = []) =>
  items.reduce((sum, i) => sum + (Number(i.total) || 0), 0);

export const totalPalletCount = (containerSales = {}) =>
  Object.values(containerSales).reduce(
    (sum, c) =>
      sum +
      c.pallets.reduce(
        (s, p) => s + (Number(p.noOfPallets) || 0),
        0
      ),
    0
  );

export const totalPurchasePricePerPiece = (containerSales = {}) =>
  Object.values(containerSales).reduce(
    (sum, c) =>
      sum +
      c.pallets.reduce(
        (s, p) => s + (Number(p.purchasePrice) || 0),
        0
      ),
    0
  );