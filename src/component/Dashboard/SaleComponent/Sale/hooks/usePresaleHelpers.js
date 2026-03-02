import { useMemo } from "react";

export const usePresaleHelpers = (preSales) => {
  const presaleByContainerId = useMemo(() => {
    const map = {};
    preSales.forEach(ps => {
      if (ps.container_id) {
        map[ps.container_id] = ps;
      }
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

  return {
    presaleByContainerId,
    isPurchasePriceLowerThanPresale,
  };
};