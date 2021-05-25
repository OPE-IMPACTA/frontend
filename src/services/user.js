export default httpClient => ({
  login: async ({
    email,
    password
  }) => {
    const response = await httpClient.post('/auth/login', {
      email,
      password
    }, { showLoading: true })

    let errors = null
    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      data: response.data,
      headers: response.headers,
      errors
    }
  },
  logout: async () => {
    const response = await httpClient.post('/auth/logout', {}, { showLoading: true })
    let errors = null
    if (response.status !== 204) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      errors
    }
  },
  getUsers: async () => {
    const response = await httpClient.get('/users', { showLoading: false })

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
  registerUser: async ({ data }) => {
    const response = await httpClient.post('/users', data, { showLoading: true })

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
  updateUser: async ({ id, data }) => {
    const response = await httpClient.put(`/users/${id}`, data, { showLoading: true })

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
  deleteUser: async (id) => {
    const response = await httpClient.delete(`/users/${id}`, { showLoading: true })

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
