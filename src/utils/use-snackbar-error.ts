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
