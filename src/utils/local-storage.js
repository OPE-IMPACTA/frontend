const clearLocalStorage = () => {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
}

export {
  clearLocalStorage
}
