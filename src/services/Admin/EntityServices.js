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
     }
     
}

