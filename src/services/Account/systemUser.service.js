import api from "../api";

export const SystemUserService = {
  list: (params) =>
    api.get("/systemuser/account/systemuser/list", { params }),

  create: (payload) =>
    api.post("/systemuser/account/systemuser/create", payload),

  edit: (payload) =>
    api.post("/systemuser/account/systemuser/edit", payload),

  delete: (user_uuid) =>
    api.post("/systemuser/account/systemuser/delete", { user_uuid }),

  changeStatus: (user_uuid, status) =>
    api.post("/systemuser/account/systemuser/changestatus", {
      user_uuid,
      status
    }),

  changeRole: (user_uuid, role_uuid) =>
    api.post("/systemuser/account/systemuser/changesystemuserrole", {
      user_uuid,
      role_uuid
    }),

  changeAccess: (user_uuid, is_system_user) =>
    api.post("/systemuser/account/systemuser/changesystemuseraccess", {
      user_uuid,
      is_system_user
    }),

  changePassword: (user_uuid, password) =>
    api.post("/systemuser/account/systemuser/changesystemuserpassword", {
      user_uuid,
      password
    }),
};
