import api from "../api";

export const ExpenseServices = {

  list: async (params) => {
    return api.get('/systemuser/trip/expense/list', { params });
  },

 create: async (payload) => api.post('/systemuser/trip/expense/create', payload, {
  headers: { "Content-Type": "multipart/form-data" }
}),

  edit: async (payload) => {
    return api.post('/systemuser/trip/expense/edit', payload);
  },
change_approval: async (payload) => {
  const formData = new URLSearchParams();

  formData.append("expense_uuid", payload.expense_uuid);
  formData.append("status", payload.status);

  return api.post(
    "/systemuser/trip/expense/changeapproval",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
},


  log: async (params) => {
    return api.get('/systemuser/trip/expense/logs', { params });
  },
   commentList: (params) =>
    api.get("/systemuser/trip/expense/comment/list", { params }),

  commentCreate: (payload) =>
    api.post("/systemuser/trip/expense/comment/create", payload),

 attachmentList: (params) =>
    api.get(
      "/systemuser/trip/expense/attachment/list",
      { params }
    ),

  attachmentCreate: (payload) =>
    api.post(
      "/systemuser/trip/expense/attachment/create",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),

  attachmentEdit: (payload) =>
    api.post(
      "/systemuser/trip/expense/attachment/edit",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),
};
