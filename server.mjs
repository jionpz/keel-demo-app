/**
 * 零依赖静态服务器：public/ 提供页面，src/ 提供浏览器复用的纯函数模块。
 *
 * 只做三件事：限根目录、给 MIME、404。没有框架 —— 这个仓库的存在意义
 * 是给 Keel 的闭环当靶子，不是展示 Web 工程。
 */

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'

const ROOT = resolve(import.meta.dirname)
const PUBLIC = join(ROOT, 'public')
const PORT = Number(process.env.PORT ?? 3000)
const HOST = process.env.HOST ?? '127.0.0.1'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

function inside(base, file) {
  return file === base || file.startsWith(base + sep)
}

function resolveFile(pathname) {
  if (pathname.startsWith('/src/')) {
    const file = join(ROOT, normalize(pathname))
    return inside(ROOT, file) ? file : null
  }
  const rel = pathname === '/' ? '/index.html' : pathname
  const file = join(PUBLIC, normalize(rel))
  return inside(PUBLIC, file) ? file : null
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}`)
  const file = resolveFile(url.pathname)

  if (file === null) {
    res.writeHead(403).end('forbidden')
    return
  }

  try {
    const body = await readFile(file)
    res.writeHead(200, {
      'content-type': MIME[extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-cache',
    })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`todo app: http://${HOST}:${PORT}`)
})
