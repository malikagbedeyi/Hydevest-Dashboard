import api from "../api";

export const InvestorService = {
  list: (params) =>
    api.get("/systemuser/account/hynvest/list", { params }),

  create: (payload) =>
    api.post("/systemuser/account/hynvest/create", payload),

  edit: (payload) =>
    api.post("/systemuser/account/hynvest/edit", payload),

  editBank: (payload) =>
    api.post("/systemuser/account/hynvest/editbank", payload),

  changeStatus: (user_uuid, status) =>
    api.post("/systemuser/account/hynvest/changeaccountstatus", {
      user_uuid,
      status,
    }),

  changePassword: (user_uuid, password) =>
    api.post("/systemuser/account/hynvest/changeaccountpassword", {
      user_uuid,
      password,
    }),
};
