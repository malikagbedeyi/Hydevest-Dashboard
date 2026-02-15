export const totalPurchase = (pallet) => {
    const pieces = Number(pallet.pieces) || 0;
    const saleAmount = Number(pallet.saleAmount) || 0;
    const price = Number(pallet.palletOption) || 0;
  
    return pieces * saleAmount * price;
  };
  
  export const calculateTotals = (pallets = []) => {
    return pallets.reduce(
      (acc, p) => {
        acc.pieces += Number(p.pieces) || 0;
        acc.pallets += Number(p.saleAmount) || 0;
        acc.totalPalletOption += Number(p.palletOption) || 0;
        acc.amount += totalPurchase(p);
        return acc;
      },
      { pieces: 0, pallets: 0, totalPalletOption: 0, amount: 0 }
    );
  };
  
  export const totalSaleAmount = (items = []) =>
    items.reduce((sum, i) => sum + (Number(i.total) || 0), 0);


  export const totalPalletCount = (containerSales) =>
    Object.values(containerSales).reduce(
      (sum, c) =>
        sum + c.pallets.reduce((s, p) => s + (Number(p.saleAmount) || 0), 0),
      0
    );
  
  export const totalPurchasePricePerPiece = (containerSales) =>
    Object.values(containerSales).reduce(
      (sum, c) =>
        sum + c.pallets.reduce((s, p) => s + (Number(p.pieces) || 0), 0),
      0
    );
  