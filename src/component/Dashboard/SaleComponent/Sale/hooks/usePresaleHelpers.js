import { useMemo } from "react";

export const usePresaleHelpers = (preSales) => {
  const presaleByContainerId = useMemo(() => {
    const map = {};
    preSales.forEach(ps => {
      ps.selectedContainers?.forEach(c => {
        map[c.id] = ps;
      });
    });
    return map;
  }, [preSales]);

  const isPurchasePriceLowerThanPresale = (pallet) => {
    const presale = presaleByContainerId[pallet.containerId];
    if (!presale) return false;

    return (
      Number(pallet.pieces) > 0 &&
      Number(pallet.pieces) < Number(presale.pricePerPic || 0)
    );
  };

  const getPalletOptionsForContainer = (containerId) => {
    const presale = presaleByContainerId[containerId];
    if (!presale?.pallets) return [];

    return [...new Set(presale.pallets.map(p => Number(p.pieces)).filter(Boolean))];
  };

  return {
    presaleByContainerId,
    isPurchasePriceLowerThanPresale,
    getPalletOptionsForContainer,
  };
};
