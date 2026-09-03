const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1'; // Servidor local[cite: 2]
const port = 3000; // Porta do servidor[cite: 2]

// Conecta e cria o banco SQLite3 (arquivo enderecos.db na raiz do projeto)
const db = new sqlite3.Database('./enderecos.db');

// Cria a tabela 'enderecos' se ela ainda não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS enderecos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cep TEXT,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        uf TEXT
    )`);
});

const server = http.createServer((req, res) => {
    // Configurações de CORS para autorizar requisições vindas do front-end[cite: 2]
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Trata a requisição PREFLIGHT (OPTIONS) que o navegador envia antes do POST
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    // ROTA POST: Recebe os dados do formulário e salva no banco de dados
    if (req.method === 'POST') {
        let body = '';

        // Recebe os pedaços (chunks) dos dados enviados pelo front-end
        req.on('data', chunk => {
            body += chunk;
        });

        // Quando terminar de receber todos os dados:
        req.on('end', () => {
            try {
                const d = JSON.parse(body);

                // SQL para inserir os dados na tabela
                const sql = `INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                db.run(sql, [d.cep, d.logradouro, d.numero, d.complemento, d.bairro, d.cidade, d.uf], function (err) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ erro: err.message }));
                        return;
                    }

                    res.statusCode = 201;
                    res.end(JSON.stringify({ status: 'Sucesso', id: this.lastID }));
                });
            } catch (erro) {
                res.statusCode = 400;
                res.end(JSON.stringify({ erro: 'Formato de JSON inválido.' }));
            }
        });
    }
    // ROTA GET: Busca todos os endereços salvos e envia para o front-end
    else if (req.method === 'GET') {
        db.all(`SELECT * FROM enderecos`, [], (err, rows) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ erro: err.message }));
                return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify(rows));
        });
    }
    // Caso o navegador chame uma rota inexistente
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ erro: 'Rota não encontrada.' }));
    }
});

// Inicia o servidor
server.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});