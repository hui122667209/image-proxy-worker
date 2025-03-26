addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')
  
  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': new URL(imageUrl).origin,
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  })

  try {
    // 调试：查看传递的 URL 是否正确
    console.log(`Fetching image from URL: ${imageUrl}`)

    const response = await fetch(imageUrl, { headers: headers })

    // 调试：记录返回的状态码和响应头
    console.log(`Response status: ${response.status}`)
    console.log(`Response headers: ${JSON.stringify(response.headers)}`)

    if (!response.ok) {
      return new Response('Error fetching image', { status: 500 })
    }

    const newHeaders = new Headers(response.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    newHeaders.set('Cache-Control', 'public, max-age=31536000')

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    })
  } catch (e) {
    // 捕获异常并记录详细错误信息
    console.log('Error occurred: ', e.message)
    return new Response('Error fetching image: ' + e.message, { status: 500 })
  }
}
