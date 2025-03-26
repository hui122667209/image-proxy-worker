addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')
  
  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  // 不进行额外的 URL 编码，直接使用传递的 imageUrl
  // 之前的代码是错误的：const encodedImageUrl = encodeURIComponent(imageUrl)
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': new URL(imageUrl).origin,
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  })

  try {
    // 使用原始的 imageUrl 而不是编码后的 URL
    const response = await fetch(imageUrl, { headers: headers })

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
