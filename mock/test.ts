import mockjs from 'mockjs';

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
};
