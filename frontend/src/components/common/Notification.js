import Swal from 'sweetalert2'

export const showAlert = (options) => {
  return Swal.fire(options)
}