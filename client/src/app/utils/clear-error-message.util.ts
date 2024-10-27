export const clearErrorMessage = (error: unknown): string => {
  let errorMessage = `${error}`;
  if (errorMessage.startsWith('Error:')) errorMessage = errorMessage.replace('Error:', '');
  if (errorMessage.startsWith('TypeError:')) errorMessage = errorMessage.replace('TypeError:', '');

  return errorMessage.trim();
};
