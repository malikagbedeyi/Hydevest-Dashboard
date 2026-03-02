// src/services/SaleServices.js
import api from "../api";

export const SaleServices = {
  // 🔹 List container pre-sales
  containerPreSales: (params) =>
    api.get("/systemuser/sales/containerList", { params }),

  // 🔹 Get customer by phone
  getCustomer: (params) =>
    api.get("/systemuser/sales/getCustomer", { params }),

  // 🔹 Get pallets for a pre-sale
  getPallets: (params) =>
    api.get("/systemuser/sales/getPallets", { params }),

  // 🔹 Create sale
  create: (payload) => {
    const formData = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    return api.post("/systemuser/sales/create", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  // 🔹 List sales
  list: (params) =>
    api.get("/systemuser/sales/list", { params }),

  // 🔹 Sale details
  details: (params) =>
    api.get("/systemuser/sales/saleDetails", { params }),

  // 🔹 Sale payments
  payments: (params) =>
    api.get("/systemuser/sales/salePayments", { params }),

  // 🔹 Delete sale
  delete: (sale_uuid) => {
    const formData = new URLSearchParams();
    formData.append("sale_uuid", sale_uuid);

    return api.post("/systemuser/sales/delete", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  // 🔹 Logs
  logs: (params) =>
    api.get("/systemuser/sales/logs", { params }),
};