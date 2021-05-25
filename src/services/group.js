export default httpClient => ({
  getAll: async () => {
    const response = await httpClient.get('/group', { showLoading: false })

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
  }
})
