



import api from "../api";

export const CustomerDeptServices = {

  DeptCommentlist: async (sale_uuid) => {
    return api.get('systemuser/sales/debtcomment/list', {
      params :{ sale_uuid }
    
    })
  },
   DeptCommentCreate: async (payload) => {
    return api.post('/systemuser/sales/debtcomment/create', payload)
  },


}
