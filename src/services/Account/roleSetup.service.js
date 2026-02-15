import api from "../api";

export const RoleService = {
  list: (params) =>
    api.get("/systemuser/account/systemuser/rolelist", { params }),

  create: (payload) =>
    api.post("/systemuser/account/systemuser/rolecreate", payload),
};
