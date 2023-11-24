/**
 * 生成一个随机的ID。
 * @returns {string} 随机生成的ID。
 */
function getId(): string {
  return (~~(Math.random() * (1 << 30))).toString(32);
}

/**
 * 随机生成指定长度的字符串。
 * @param {number} length - 字符串的长度，默认为32。
 * @returns {string} 生成的随机字符串。
 */
function randomString(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

/**
 * 随机生成一个包含4个横杠的16位UUID。
 * @returns {string} 生成的UUID。
 */
function getUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // @ts-ignore
    // tslint:disable-next-line: no-bitwise
    return (c === 'x' ? (Math.random() * 16) | 0 : (Math.random() * 4) | 8).toString(16);
  });
}

/**
 * 包含生成随机值的工具对象。
 */
const random = {
  getId,
  randomString,
  getUUID,
};

export default random;
