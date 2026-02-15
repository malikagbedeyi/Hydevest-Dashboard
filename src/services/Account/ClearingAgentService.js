import api from "../api";

export const ClearingAgentService = {
  list: (params) =>
    api.get("/systemuser/account/clearingagent/list", { params }),

  create: (payload) =>
    api.post("/systemuser/account/clearingagent/create", payload),

  edit: (payload) =>
    api.post("/systemuser/account/clearingagent/edit", payload),

  editBank: (payload) =>
    api.post("/systemuser/account/clearingagent/editbank", payload),
};
