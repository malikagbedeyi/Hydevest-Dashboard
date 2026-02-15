import api from "../api";

export const PartnerService = {
  list: (params) =>
    api.get("/systemuser/account/partner/list", { params }),

  create: (payload) =>
    api.post("/systemuser/account/partner/create", payload),

  edit: (payload) =>
    api.post("/systemuser/account/partner/edit", payload),

  editBank: (payload) =>
    api.post("/systemuser/account/partner/editbank", payload),

  changeStatus: (user_uuid, status) =>
    api.post("/systemuser/account/partner/changeaccountstatus", {
      user_uuid,
      status,
    }),

  changePassword: (user_uuid, password) =>
    api.post("/systemuser/account/partner/changeaccountpassword", {
      user_uuid,
      password,
    }),
};
