// src/services/SaleServices.js
import api from "../api";

export const SaleServices = {
  containerPreSales: (params) =>
    api.get("/systemuser/sales/containerList", { params }),

  getCustomer: (params) =>
    api.get("/systemuser/sales/getCustomer", { params }),

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
  return api.post(
    "/systemuser/sales/delete",
    { sale_uuid }, // JSON body
    {
      headers: {
        "Content-Type": "application/json", // <-- important
      },
    }
  );
},

  // 🔹 Logs
  logs: (params) =>
    api.get("/systemuser/sales/logs", { params }),
};