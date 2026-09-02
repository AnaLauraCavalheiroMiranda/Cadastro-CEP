const http = require('http');
const hostname = '127.0.0.1';
const port = 3000; // Mantido na porta 3000

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    
    res.end(JSON.stringify({
        mensagem: 'essa é uma mensagem',
        status: 'Sucesso',
        autor: 'Ana Laura'
    }));
});

server.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
