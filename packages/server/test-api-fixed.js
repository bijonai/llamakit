// 测试API路由的脚本
// 运行: node test-api-fixed.js

const POSSIBLE_PORTS = [3000, 3001, 3002, 3003]
let BASE_URL = null

async function findServerPort() {
  for (const port of POSSIBLE_PORTS) {
    try {
      const testUrl = `http://localhost:${port}/api/test`
      const response = await fetch(testUrl)
      if (response.ok) {
        BASE_URL = `http://localhost:${port}`
        console.log(`✅ 发现服务器运行在端口 ${port}`)
        return true
      }
    }
    catch (error) {
      // 继续尝试下一个端口
    }
  }
  return false
}

async function testAPI() {
  let clientId = null

  try {
    // 1. 测试创建客户端
    console.log('1️⃣ 测试创建客户端 (POST /api/client/create)')
    const createResponse = await fetch(`${BASE_URL}/api/client/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Client',
        apiKey: 'sk-test-key',
        baseUrl: 'https://api.openai.com',
      }),
    })

    if (!createResponse.ok) {
      throw new Error(`创建客户端失败: ${createResponse.status}`)
    }

    const createResult = await createResponse.json()
    clientId = createResult.id
    console.log('✅ 创建成功, Client ID:', clientId)

    // 2. 测试获取客户端列表
    console.log('\n2️⃣ 测试获取客户端列表 (GET /api/client)')
    const listResponse = await fetch(`${BASE_URL}/api/client?limit=10&offset=0`)

    if (!listResponse.ok) {
      throw new Error(`获取列表失败: ${listResponse.status}`)
    }

    const listResult = await listResponse.json()
    console.log('✅ 获取列表成功, 客户端数量:', listResult.total)

    // 3. 测试更新客户端 (新的路径参数方式)
    console.log('\n3️⃣ 测试更新客户端 (PUT /api/client/:id)')
    const updateResponse = await fetch(`${BASE_URL}/api/client/${clientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated Test Client',
      }),
    })

    if (!updateResponse.ok) {
      throw new Error(`更新客户端失败: ${updateResponse.status}`)
    }

    const updateResult = await updateResponse.json()
    console.log('✅ 更新成功:', updateResult.message)

    // 4. 测试获取日志 (即使为空)
    console.log('\n4️⃣ 测试获取日志 (GET /api/log/:clientId)')
    const logsResponse = await fetch(`${BASE_URL}/api/log/${clientId}`)

    if (!logsResponse.ok) {
      throw new Error(`获取日志失败: ${logsResponse.status}`)
    }

    const logsResult = await logsResponse.json()
    console.log('✅ 获取日志成功, 日志数量:', logsResult.total)

    // 5. 测试清空日志
    console.log('\n5️⃣ 测试清空日志 (DELETE /api/log/:clientId)')
    const clearLogsResponse = await fetch(`${BASE_URL}/api/log/${clientId}`, {
      method: 'DELETE',
    })

    if (!clearLogsResponse.ok) {
      throw new Error(`清空日志失败: ${clearLogsResponse.status}`)
    }

    const clearResult = await clearLogsResponse.json()
    console.log('✅ 清空日志成功:', clearResult.message)

    // 6. 测试删除客户端 (新的路径参数方式)
    console.log('\n6️⃣ 测试删除客户端 (DELETE /api/client/:id)')
    const deleteResponse = await fetch(`${BASE_URL}/api/client/${clientId}`, {
      method: 'DELETE',
    })

    if (!deleteResponse.ok) {
      throw new Error(`删除客户端失败: ${deleteResponse.status}`)
    }

    const deleteResult = await deleteResponse.json()
    console.log('✅ 删除成功:', deleteResult.message)

    console.log('\n🎉 所有API路由测试通过!')
  }
  catch (error) {
    console.error('\n❌ 测试失败:', error.message)

    // 清理：如果有创建的客户端，尝试删除
    if (clientId) {
      try {
        await fetch(`${BASE_URL}/api/client/${clientId}`, { method: 'DELETE' })
        console.log('🧹 已清理测试数据')
      }
      catch (cleanupError) {
        console.log('⚠️ 清理测试数据失败，请手动清理')
      }
    }
  }
}

// 检查服务器是否运行
async function checkServer() {
  return await findServerPort()
}

async function main() {
  if (await checkServer()) {
    await testAPI()
  }
  else {
    console.log('❌ 服务器未运行在任何端口，请先启动服务器: pnpm dev')
  }
}

main()
