import api from "../api"; // your existing api instance

export const CustomerService = {
  list: (params) =>
    api.get("/systemuser/account/customer/list", { params }),

  create: (payload) =>
    api.post("/systemuser/account/customer/create", payload),

  edit: (payload) =>
    api.post("/systemuser/account/customer/edit", payload),
};
