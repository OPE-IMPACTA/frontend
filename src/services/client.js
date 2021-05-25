export default httpClient => ({
  getClients: async () => {
    const response = await httpClient.get('/clients', { showLoading: false })

    let errors = null
    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      data: response.data,
      errors
    }
  },
  registerClient: async ({ data }) => {
    const response = await httpClient.post('/clients', data, { showLoading: true })

    let errors = null
    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      data: response.data,
      errors
    }
  },
  updateClient: async ({ id, data }) => {
    const response = await httpClient.put(`/clients/${id}`, data, { showLoading: true })

    let errors = null
    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      data: response.data,
      errors
    }
  },
  deleteClient: async (id) => {
    const response = await httpClient.delete(`/clients/${id}`, { showLoading: true })

    let errors = null
    if (response.status !== 200) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      errors
    }
  }
})
