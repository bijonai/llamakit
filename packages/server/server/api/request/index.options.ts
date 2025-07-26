export default defineEventHandler((event) => {
  // 设置CORS头部
  event.node.res.setHeader('Access-Control-Allow-Origin', '*')
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  event.node.res.setHeader('Access-Control-Max-Age', '86400')

  // 返回204状态码
  event.node.res.statusCode = 204
  return null
})
