import axios from 'axios';
import getAuthToken from '@/helper/getAuthToken';

export default class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve) => {
          this.sendRequest(file, resolve);
        }),
    );
  }

  sendRequest(file, resolve) {
    const data = new FormData();
    data.append('upload', file);
    axios({
      method: 'post',
      url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/upload`,
      headers: {
        Authorization: getAuthToken(),
      },
      data,
    }).then((res) => {
      if (!res.data.success) return;
      this.loader.imageUrl = res.data.imageUrl;
      resolve({ default: res.data.imageUrl });
    });
  }
}
