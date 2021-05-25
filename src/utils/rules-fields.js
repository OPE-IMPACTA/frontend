const emptyField = (message) => {
  return [
    valor => !!valor || message
  ]
}

const email = () => {
  return [
    valor => !!valor || 'Email é obrigatório',
    valor => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\].,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(valor) || 'Email Inválido',
    valor => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\].,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(valor) || 'Email Inválido'
  ]
}

const password = (password) => {
  return [
    valor => !!valor || 'Senha obrigatória',
    valor => valor.length >= 6 || 'Minimo 6 caracteres',
    valor => valor === password || 'A senha é diferente, repita a senha'
  ]
}

const emptyFieldAndLength = (message, length) => {
  return [
    valor => !!valor || message,
    valor => valor.length >= length || message
  ]
}

export {
  emptyField,
  email,
  password,
  emptyFieldAndLength
}
