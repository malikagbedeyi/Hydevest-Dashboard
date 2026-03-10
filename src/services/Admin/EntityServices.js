import api from  '../api'

export const EntityServices = {
     list:async  (params) => {
         return await api.get('/systemuser/account/entity/list', {params})
     },

     create:async  (payload) => {
      return await  api.post('/systemuser/account/entity/create', payload)
     },
     edit:async  (payload) => {
      return await  api.post('/systemuser/account/entity/edit', payload)
     },
     editBank:async  (payload) => {
      return await  api.post('/systemuser/account/entity/editbank', payload)
     },
     log: async (params)=>{
      return await  api.get('/systemuser/account/entity/logs', {params})
     },
       change_approval: async (payload) => {
  const formData = new URLSearchParams();

  formData.append("user_uuid", payload.user_uuid);
  formData.append("status", payload.status);

  return api.post(
    "/systemuser/account/entity/changeaccountstatus",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
},
     
}

