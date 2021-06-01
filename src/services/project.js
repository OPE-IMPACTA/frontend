const defaultPagination = {
  limit: 5,
  offset: 0
}

export default httpClient => ({
  getProjects: async () => {
    const response = await httpClient.get('/projects', { showLoading: false })
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
  getAll: async ({ type, limit, offset } = defaultPagination) => {
    const query = { limit, offset }
    if (type) {
      query.type = type
    }
    const response = await httpClient.get('/projects', { params: query, showLoading: false })
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
  getSummary: async () => {
    const response = await httpClient.get('/projects/summary', { showLoading: false })
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
  registerProject: async ({ data }) => {
    const response = await httpClient.post('/projects', data, { showLoading: true })

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
  updateProject: async ({ id, data }) => {
    const response = await httpClient.put(`/projects/${id}`, data, { showLoading: true })

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
  deleteProject: async (id) => {
    const response = await httpClient.delete(`/projects/${id}`, { showLoading: true })

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
