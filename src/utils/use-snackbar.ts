import { ref } from 'vue';

export const useSnackbarError = () => {
  const showSnackbar = ref(false);
  const errorMessage = ref('');
  const errorDetail = ref('');

  const showSnackbarError = (message: string, detail?: string) => {
    errorMessage.value = message;
    errorDetail.value = detail || '';
    showSnackbar.value = true;
  };

  return {
    showSnackbar,
    errorMessage,
    errorDetail,
    showSnackbarError,
  };
};

export const useSnackbarSuccess = () => {
  const snackbarSuccess = ref(false);
  const successMessage = ref('');

  const showSnackbarSuccess = (messageString: string) => {
    successMessage.value = messageString;
    snackbarSuccess.value = true;
  };

  return {
    snackbarSuccess,
    successMessage,
    showSnackbarSuccess,
  };
};
