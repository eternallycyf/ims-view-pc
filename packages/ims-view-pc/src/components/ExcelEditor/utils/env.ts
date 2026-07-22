/** 服务端口：优先 IMS_SERVER_PORT，其次 PORT */
export const getServerPort = () =>
  Number(process.env.IMS_SERVER_PORT || process.env.PORT || 3010);

/**
 * Excel 导入导出服务地址
 * 优先 IMS_EXCHANGE_ENDPOINT，否则按端口拼本地地址
 */
export const getDefaultExchangeEndpoint = () =>
  process.env.IMS_EXCHANGE_ENDPOINT ||
  process.env.EXCHANGE_ENDPOINT ||
  `http://localhost:${getServerPort()}`;
