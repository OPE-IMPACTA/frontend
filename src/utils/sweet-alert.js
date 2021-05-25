import Swal from 'sweetalert2'

const warning = (title, text, confirmButtonText) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d6303e',
    cancelButtonColor: '#c4c4c4',
    cancelButtonText: 'Voltar',
    confirmButtonText: confirmButtonText
  })
}

export {
  warning
}
