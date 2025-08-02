import type { Attachment } from 'ims-view-pc';
import mockjs from 'mockjs';

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = isProd
  ? 'https://ims-view-pc-eternallycyfs-projects.vercel.app'
  : 'http://localhost:8000/ims-view-pc';

const initFileList: Attachment[] = [
  {
    fileName: 'origin.png',
    id: 'rc-upload-1734098585253-8',
    status: 'done',
    percent: 100,
    fileId: '1',
    uploadDateTime: '2023-04-07T07:06:05.000Z',
    url: `${baseUrl}/images/origin.png`,
  },
  {
    fileName: 'word.docx',
    id: 'rc-upload-1734098585253-10',
    status: 'done',
    percent: 100,
    fileId: 'b6bdc21f-6d82-47ed-b329-6d47af66e9af',
    url: `${baseUrl}/word.docx`,
  },
  {
    fileName: '1.json',
    id: 'rc-upload-1734098585253-12',
    status: 'done',
    percent: 100,
    fileId: '14a57c3a-0864-409e-ab3b-3e5510d9c8dc',
    url: `${baseUrl}/1.json`,
  },
  {
    fileName: 'excel.xlsx',
    id: 'rc-upload-1734098585253-15',
    status: 'done',
    percent: 100,
    fileId: 'excelxlsx',
    url: `${baseUrl}/excel.xlsx`,
  },
  {
    fileName: 'pdf.pdf',
    id: 'rc-upload-1734098585253-16',
    status: 'done',
    percent: 100,
    fileId: 'pdf',
    url: `${baseUrl}/pdf.pdf`,
  },
];

export default {
  'POST /login': {
    code: 200,
    msg: '请求成功',
    success: true,
    data: 'JSKJDLLSDH',
  },
  'POST /fetchUserInfo': {
    code: 200,
    msg: '请求成功',
    success: true,
    data: mockjs.mock({
      userId: '@float(100, 10000, 2, 2)',
      usename: '@city',
    }),
  },
  'POST /fetchAccessCollection': {
    code: 200,
    msg: '请求成功',
    success: true,
    data: ['class-editButton', 'class-deleteButton'],
  },
  'POST /flow/upload': (req, res) => {
    setTimeout(() => {
      const item = initFileList[~~(Math.random() * 4)];
      const fileName = item?.fileName;
      const fileId = item?.fileId;
      const url = item?.url;

      res.send({
        code: 200,
        data: mockjs.mock({
          fileId,
          id: fileId,
          url,
          fileSize: 646983,
          fdDownLoadUrl: url,
          fdEntitykey: 'file',
          fdExternalAttachId: fileId,
          fdFileSize: fileId,
          flowId: fileId,
          fileName,
          name: fileName,
          fdFileName: fileName,
        }),
      });
    }, 1000);
  },
};
