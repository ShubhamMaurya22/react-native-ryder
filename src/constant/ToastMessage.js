import { showMessage } from "react-native-flash-message"

const showError = (message) => {
  showMessage({
      message,
      type: 'danger',
      icon: 'danger'
  })
}

const showSuccess = (message) => {
  showMessage({
      message,
      type: 'success',
      icon: 'success'
  })
}

export {
  showError,
  showSuccess
}


