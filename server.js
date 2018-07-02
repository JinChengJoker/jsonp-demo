var http = require('http')
var url = require('url')
var fs = require('fs')
var port = process.argv[2]

// 判断是否传入端口号参数
if(!port) {
    console.log('请指定端口号！\n例如：node server.js 8888')
    process.exit(1)
}

// 创建服务器
var server = http.createServer(
    function(request, response) {
        var temp = url.parse(request.url, true)
        var path = temp.pathname
        var query = temp.query
        console.log('HTTP 请求路径为：\n' + path)
        // 判断 HTTP 请求路径
        if(path === '/') {
            var amount = fs.readFileSync('./db', 'utf8')
            var data = fs.readFileSync('./index.html', 'utf8')
            data = data.replace('&&amount&&', amount)
            response.setHeader('Content-Type', 'text/html; charset=utf-8')
            response.write(data)
            response.end()
        } else if(path === '/pay') {
            var amount = fs.readFileSync('./db', 'utf8')
            amount -= 1
            fs.writeFileSync('./db', amount)
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/javascript')
            response.write('amount.innerText = ' + amount)
            response.end()
        } else {
            // 找不到对应的请求路径，返回错误码404
            response.statusCode = 404
            response.end()
        }
    }
)

// 监听传入的端口号
server.listen(port)
console.log('监听' + port + '成功！\n请在浏览器打开 http://localhost:' + port)