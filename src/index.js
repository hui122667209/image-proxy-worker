addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')
  
  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  // URL 编码，确保中文字符正确传递
  const encodedImageUrl = encodeURIComponent(imageUrl)

  // 设置请求头
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': new URL(imageUrl).origin,
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  })

  try {
    // 发起请求，传递正确的 URL 编码
    const response = await fetch(encodedImageUrl, { headers: headers })

    // 记录响应状态，帮助调试
    console.log(`Fetched image with status: ${response.status}`)

    if (!response.ok) {
      return new Response('Error fetching image', { status: 500 })
    }

    // 将响应的头部更新以允许跨域
    const newHeaders = new Headers(response.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    newHeaders.set('Cache-Control', 'public, max-age=31536000')

    // 返回成功响应
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    })
  } catch (e) {
    // 捕获任何异常并记录错误信息
    console.log('Error occurred: ', e.message)
    return new Response('Error fetching image: ' + e.message, { status: 500 })
  }
}
