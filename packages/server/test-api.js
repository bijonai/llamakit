/**
 * AI DevTools API 测试脚本
 * 使用方法: node test-api.js
 */

const BASE_URL = 'http://localhost:3000'

// 测试用的AI API配置
const TEST_CLIENT = {
  name: 'Test OpenAI Client',
  baseUrl: 'https://api.openai.com',
  apiKey: 'sk-test-key-replace-with-real-key',
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, options)
  const data = await response.json()

  console.log(`${method} ${path}:`, response.status, data)
  return { status: response.status, data }
}

async function runTests() {
  console.log('🚀 开始API测试...\n')

  try {
    // 1. 创建Client
    console.log('1️⃣ 测试创建Client')
    const createResult = await request('POST', '/api/client/create', TEST_CLIENT)

    if (createResult.status !== 200) {
      console.error('❌ 创建Client失败')
      return
    }

    const clientId = createResult.data.id
    console.log('✅ Client创建成功，ID:', clientId)
    console.log()

    // 2. 获取Client列表
    console.log('2️⃣ 测试获取Client列表')
    await request('GET', '/client?limit=5&offset=0')
    console.log()

    // 3. 更新Client
    console.log('3️⃣ 测试更新Client')
    await request('PUT', '/client/update', {
      id: clientId,
      name: 'Updated Test Client',
    })
    console.log()

    // 4. 获取日志（初始为空）
    console.log('4️⃣ 测试获取日志（应该为空）')
    await request('GET', `/log/${clientId}`)
    console.log()

    // 5. 测试Chat Completions（需要真实的API Key才能工作）
    console.log('5️⃣ 测试Chat Completions（注意：需要真实API Key）')
    const chatBody = {
      messages: [
        {
          role: 'user',
          content: 'Hello, this is a test message',
          id: 'test-msg-1',
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 50,
    }

    try {
      await request('POST', `/client/${clientId}/completions`, chatBody)
    }
    catch (error) {
      console.log('⚠️ Chat Completions测试可能失败（需要真实API Key）:', error.message)
    }
    console.log()

    // 6. 再次获取日志（应该有记录）
    console.log('6️⃣ 测试获取日志（应该有记录）')
    await request('GET', `/log/${clientId}`)
    console.log()

    // 7. 清空日志
    console.log('7️⃣ 测试清空日志')
    await request('DELETE', `/log/${clientId}`)
    console.log()

    // 8. 删除Client
    console.log('8️⃣ 测试删除Client')
    await request('DELETE', '/client/remove', { id: clientId })
    console.log()

    console.log('🎉 所有API测试完成！')
  }
  catch (error) {
    console.error('❌ 测试过程中出错:', error)
  }
}

// 错误处理测试
async function runErrorTests() {
  console.log('\n🔍 开始错误处理测试...\n')

  // 测试无效请求
  console.log('1️⃣ 测试创建Client时缺少必填字段')
  await request('POST', '/client/create', { name: 'Test' }) // 缺少apiKey和baseUrl

  console.log('2️⃣ 测试获取不存在的Client日志')
  await request('GET', '/log/non-existent-client-id')

  console.log('3️⃣ 测试删除不存在的Client')
  await request('DELETE', '/client/remove', { id: 'non-existent-id' })

  console.log('\n✅ 错误处理测试完成！')
}

// 运行测试
async function main() {
  await runTests()
  await runErrorTests()
}

// 检查是否直接运行此脚本
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { runTests, runErrorTests }
