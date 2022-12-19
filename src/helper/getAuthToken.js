export default function getAuthToken() {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken'))
    ?.split('=')[1];
}
