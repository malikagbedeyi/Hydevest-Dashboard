import api from "../api";

export const BdcOperatorService = {
  create(payload) {
    return api.post("/systemuser/account/bdcoperator/create",payload
    );
  },

  edit(payload) {
    return api.post("/systemuser/account/bdcoperator/edit",payload
    );
  },

  editBank(payload) {
    return api.post("/systemuser/account/bdcoperator/editbank",payload
    );
  },

  list(params) {
    return api.get("/systemuser/account/bdcoperator/list",{ params }
    );
  },
};
