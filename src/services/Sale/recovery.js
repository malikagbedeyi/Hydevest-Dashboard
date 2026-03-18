import api from "../api";

export const RecoveryServices = {

  /* ================= GET CUSTOMER BY PHONE ================= */
getCustomer: (search) => {
  const isNumber = /^[0-9]+$/.test(search);

  return api.get(`/systemuser/sales/recovery/getCustomer`, {
    params: {
      phone_no: isNumber ? search : "",
      search_fullname: !isNumber ? search : ""
    }
  });
},

  /* ================= GET CUSTOMER SALES ================= */
  getCustomerSales: (customer_uuid) =>
    api.get(`/systemuser/sales/recovery/getCustomerSalesList`, {
      params: { customer_uuid }
    }),

  /* ================= CREATE RECOVERY ================= */
  create: (formData) =>
    api.post(`/systemuser/sales/recovery/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }),

  /* ================= LIST RECOVERIES ================= */
list: (params) =>
  api.get(`/systemuser/sales/recovery/list`, { params }),

  /* ================= DELETE RECOVERY ================= */
delete: (recovery_uuid) => {
  const formData = new URLSearchParams();
  formData.append("recovery_uuid", recovery_uuid);

  return api.post(`/systemuser/sales/recovery/delete`, formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });
},

  /* ================= LOGS ================= */
logs: (params) =>
  api.get(`/systemuser/sales/recovery/logs`, { params })
};