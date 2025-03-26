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
    console.log(`Fetching image from: ${imageUrl}`); // 调试：输出URL
    const response = await fetch(imageUrl, { headers: headers })
    
    console.log(`Response status: ${response.status}`); // 调试：输出状态码

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
    console.log(`Error: ${e.message}`); // 调试：输出错误信息
    return new Response('Error fetching image: ' + e.message, { status: 500 })
  }
}
