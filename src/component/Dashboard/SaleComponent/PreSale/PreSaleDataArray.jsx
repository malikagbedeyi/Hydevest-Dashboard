export const preSaleData = [
  {
    id: 1,
    saleOption: "split",
    container: "C1",
    wcAvgWeight: 2.1,
    wcPieces: 350,
    pricePerKg: 1500,
    numPallets: 4,
    pallets: [
      { pieces: 100, palletsCount: 1 },
      { pieces: 90, palletsCount: 1 },
      { pieces: 80, palletsCount: 1 },
      { pieces: 80, palletsCount: 1 }
    ],
    expectedRevenue: 1102500,
    status: "Pending",
    createdAt: "2025-02-01"
  },
  {
    id: 2,
    saleOption: "box",
    container: "C2",
    wcAvgWeight: 2.3,
    wcPieces: 420,
    pricePerKg: 1600,
    expectedRevenue: 1545600,
    status: "Pending",
    createdAt: "2025-02-02"
  },
  {
    id: 3,
    saleOption: "mixed",
    container: "C3",
    wcAvgWeight: 2.0,
    wcPieces: 500,
    pricePerKg: 1550,
    numPallets: 5,
    pallets: [
      { pieces: 120, palletsCount: 1 },
      { pieces: 100, palletsCount: 1 },
      { pieces: 90, palletsCount: 1 },
      { pieces: 100, palletsCount: 1 },
      { pieces: 90, palletsCount: 1 }
    ],
    expectedRevenue: 1550000,
    status: "Completed",
    createdAt: "2025-02-03"
  },
  {
    id: 4,
    saleOption: "box",
    container: "C1",
    wcAvgWeight: 1.9,
    wcPieces: 300,
    pricePerKg: 1500,
    expectedRevenue: 855000,
    status: "Pending",
    createdAt: "2025-02-04"
  },
  {
    id: 5,
    saleOption: "split",
    container: "C4",
    wcAvgWeight: 2.4,
    wcPieces: 280,
    pricePerKg: 1650,
    numPallets: 3,
    pallets: [
      { pieces: 100, palletsCount: 1 },
      { pieces: 90, palletsCount: 1 },
      { pieces: 90, palletsCount: 1 }
    ],
    expectedRevenue: 1108800,
    status: "Pending",
    createdAt: "2025-02-05"
  },
  {
    id: 6,
    saleOption: "mixed",
    container: "C2",
    wcAvgWeight: 2.2,
    wcPieces: 410,
    pricePerKg: 1500,
    numPallets: 4,
    pallets: [
      { pieces: 110, palletsCount: 1 },
      { pieces: 100, palletsCount: 1 },
      { pieces: 100, palletsCount: 1 },
      { pieces: 100, palletsCount: 1 }
    ],
    expectedRevenue: 1353000,
    status: "Completed",
    createdAt: "2025-02-06"
  },
  {
    id: 7,
    saleOption: "box",
    container: "C5",
    wcAvgWeight: 2.5,
    wcPieces: 500,
    pricePerKg: 1700,
    expectedRevenue: 2125000,
    status: "Approved",
    createdAt: "2025-02-07"
  },
  {
    id: 8,
    saleOption: "split",
    container: "C3",
    wcAvgWeight: 2.0,
    wcPieces: 330,
    pricePerKg: 1550,
    numPallets: 3,
    pallets: [
      { pieces: 110, palletsCount: 1 },
      { pieces: 110, palletsCount: 1 },
      { pieces: 110, palletsCount: 1 }
    ],
    expectedRevenue: 1023000,
    status: "Pending",
    createdAt: "2025-02-08"
  },
  {
    id: 9,
    saleOption: "mixed",
    container: "C4",
    wcAvgWeight: 2.3,
    wcPieces: 290,
    pricePerKg: 1600,
    numPallets: 3,
    pallets: [
      { pieces: 100, palletsCount: 1 },
      { pieces: 100, palletsCount: 1 },
      { pieces: 90, palletsCount: 1 }
    ],
    expectedRevenue: 1067200,
    status: "Declined",
    createdAt: "2025-02-09"
  },
  {
    id: 10,
    saleOption: "box",
    container: "C5",
    wcAvgWeight: 1.8,
    wcPieces: 420,
    pricePerKg: 1500,
    expectedRevenue: 1134000,
    status: "Completed",
    createdAt: "2025-02-10"
  }
];
