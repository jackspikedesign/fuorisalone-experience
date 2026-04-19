const data = require('../src/data/events.json')

function escape(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

module.exports = function handler(req, res) {
  const { id } = req.query
  const installation = data.find(i => i.id === id)

  if (!installation) {
    res.redirect(302, '/')
    return
  }

  const host = req.headers.host
  const baseUrl = `https://${host}`
  const appUrl = `${baseUrl}/?id=${id}`

  const image = installation.image?.startsWith('http')
    ? installation.image
    : `${baseUrl}${installation.image}`

  const title = escape(`${installation.name} — ${installation.artist_studio}`)
  const description = escape(installation.description)
  const imageEsc = escape(image)
  const urlEsc = escape(appUrl)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.send(`<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageEsc}">
  <meta property="og:url" content="${urlEsc}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageEsc}">
  <meta http-equiv="refresh" content="0;url=${urlEsc}">
</head>
<body>
  <a href="${urlEsc}">${title}</a>
</body>
</html>`)
}
