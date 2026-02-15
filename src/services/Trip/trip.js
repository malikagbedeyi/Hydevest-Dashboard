import api from "../api";

export const TripServices = {
  list: async (params) => {
    return api.get('/systemuser/trip/trip/list', { params })
  },

  create: async (payload) => {
    return api.post('/systemuser/trip/trip/create', payload)
  },

  edit: async (payload) => {
    return api.post('/systemuser/trip/trip/edit', payload)
  },

  log: async (params) => {
    return api.get('/systemuser/trip/trip/logs', { params })
  }
}
