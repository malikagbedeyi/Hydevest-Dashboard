
import api from "../api";

export const SaleServices = {
  containerPreSales: (params) =>
    api.get("/systemuser/sales/containerList", { params }),

  getCustomer: (params) =>
    api.get("/systemuser/sales/getCustomer", { params }),

  getPallets: (params) =>
    api.get("/systemuser/sales/getPallets", { params }),

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

  list: (params) =>
    api.get("/systemuser/sales/list", { params }),

  details: (params) =>
    api.get("/systemuser/sales/saleDetails", { params }),

  payments: (params) =>
    api.get("/systemuser/sales/salePayments", { params }),

  ExtendDiscount: (payload) => {
    const formDate = new URLSearchParams()

    formDate.append("sale_uuid",payload.sale_uuid);
    formDate.append('discount',payload.discount);
    formDate.append('desc' , payload.desc)
  return api.post(
    "/systemuser/sales/extenddiscount",
    formDate.toString(),
    {
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
    },
    }

  );
},
  extendExcess: (payload) => {
    const formDate = new URLSearchParams()

    formDate.append("sale_uuid",payload.sale_uuid);
    formDate.append('excess',payload.excess);
    formDate.append('excess_comment' , payload.excess_comment)
  return api.post(
    "/systemuser/sales/extendexcess",
    formDate.toString(),
    {
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
    },
    }

  );
},

  delete: (sale_uuid) => {
  return api.post(
    "/systemuser/sales/delete",
    { sale_uuid }, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
},

  logs: (params) =>
    api.get("/systemuser/sales/logs", { params }),
};