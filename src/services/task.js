export default httpClient => ({
  getTasks: async () => {
    const response = await httpClient.get('/tasks', { showLoading: false })

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
  registerTask: async ({ data }) => {
    const response = await httpClient.post('/tasks', data, { showLoading: true })

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
  updateTask: async ({ id, data }) => {
    const response = await httpClient.put(`/tasks/${id}`, data, { showLoading: true })

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
  deleteTask: async (id) => {
    const response = await httpClient.delete(`/tasks/${id}`, { showLoading: true })

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
