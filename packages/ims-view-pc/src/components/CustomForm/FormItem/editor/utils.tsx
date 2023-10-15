export const getBase64 = (file: Blob, cb: (result: string | ArrayBuffer | null) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => cb(reader.result));
  reader.readAsDataURL(file);
};

export const uploadImg = (file, insertFn) => {
  let imgData = new FormData();
  imgData.append('file', file);
  getBase64(file, (result) => {
    insertFn(result);
  });
};

export const insertImg = (file) => {};
