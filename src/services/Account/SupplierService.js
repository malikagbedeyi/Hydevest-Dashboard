import api from "../api"; // your existing api instance


export const SupplierService ={
  
  list: (params) =>
    api.get("/systemuser/account/supplier/list", { params }),

  create: (payload) =>
    api.post("/systemuser/account/supplier/create", payload),

  edit: (payload) =>
    api.post("/systemuser/account/supplier/edit", payload),
};
