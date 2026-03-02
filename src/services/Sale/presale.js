import api from "../api";
import qs from "qs";

export const PresaleServices = {
  /* ---------------------------------
     LIST & READ
  ---------------------------------- */
  list: (params) =>
    api.get("/systemuser/sales/presale/list", { params }),

  containerList: (params) =>
    api.get("/systemuser/sales/presale/containerList", { params }),

  log: (params) =>
    api.get("/systemuser/sales/presale/logs", { params }),

  /* ---------------------------------
     BOX SALE (JSON – backend accepts it)
  ---------------------------------- */
  createBoxSale: (payload) =>
    api.post(
      "/systemuser/sales/presale/boxsale/createBoxSale",
      payload
    ),

  editBoxSale: (payload) =>
    api.post(
      "/systemuser/sales/presale/boxsale/editBoxSale",
      payload
    ),

  /* ---------------------------------
     SPLIT SALE (URL-ENCODED – REQUIRED)
  ---------------------------------- */
  createSplitSale: (payload) =>
    api.post(
      "/systemuser/sales/presale/splitsale/createSplitSale",
      qs.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ),

  editSplitSale: (payload) =>
    api.post(
      "/systemuser/sales/presale/splitsale/editSplitSale",
      qs.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ),

  /* ---------------------------------
     MIXED SALE (URL-ENCODED – REQUIRED)
  ---------------------------------- */
  createMixedSale: (payload) =>
    api.post(
      "/systemuser/sales/presale/mixedsale/createMixedSale",
      qs.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ),

  editMixedSale: (payload) =>
    api.post(
      "/systemuser/sales/presale/mixedsale/editMixedSale",
      qs.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ),

  /* ---------------------------------
     APPROVAL
  ---------------------------------- */
  changeApproval: (payload) =>
  api.post("/systemuser/sales/presale/changeapproval", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  }),
    /* ---------------------------------
   PRESALE DETAILS
---------------------------------- */
details: (params) =>
  api.get("/systemuser/sales/presale/details", { params }),
};
