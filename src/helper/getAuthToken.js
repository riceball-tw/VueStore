// Get Cookie
const authToken = document.cookie
  .split('; ')
  .find((row) => row.startsWith('hexToken'))
  ?.split('=')[1];

export default authToken;
