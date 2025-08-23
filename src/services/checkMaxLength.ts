export const checkLength = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return false;
  }
  return true;
}