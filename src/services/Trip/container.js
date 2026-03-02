import api from "../api";

export const ContainerServices = {

  list: async (params) => {
    return api.get('/systemuser/trip/container/list', { params });
  },

 create: async (payload) => api.post('/systemuser/trip/container/create', payload, {
  headers: { "Content-Type": "multipart/form-data" }
}),

  edit: async (payload) => {
    return api.post('/systemuser/trip/container/edit', payload);
  },
  change_approval: async (payload) => {
  const formData = new URLSearchParams();

  formData.append("container_uuid", payload.container_uuid);
  formData.append("status", payload.status);

  return api.post(
    "/systemuser/trip/container/changeapproval",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
},
   entityList: async (params) => {
    return api.get('/systemuser/trip/container/entitylist', { params });
  },

  log: async (params) => {
    return api.get('/systemuser/trip/container/logs', { params });
  },
   commentList: (params) =>
    api.get("/systemuser/trip/container/comment/list", { params }),

  commentCreate: (payload) =>
    api.post("/systemuser/trip/container/comment/create", payload),

 attachmentList: (params) =>
    api.get(
      "/systemuser/trip/container/attachment/list",
      { params }
    ),

  attachmentCreate: (payload) =>
    api.post(
      "/systemuser/trip/container/attachment/create",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),

  attachmentEdit: (payload) =>
    api.post(
      "/systemuser/trip/container/attachment/edit",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),
};
