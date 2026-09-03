const form = document.getElementById('formEndereco'); // Pega o formulário no HTML
const aviso = document.getElementById('aviso'); // Pega o campo de avisos no HTML[cite: 1, 5]
const corpoTabela = document.getElementById('corpoTabela'); // Pega o corpo da tabela no HTML[cite: 1, 5]

// Função para transformar os campos do formulário em um objeto JavaScript[cite: 5]
function lerFormulario(formulario) {
    const dados = {};
    const campos = new FormData(formulario);
    campos.forEach(function (valor, chave) {
        dados[chave] = valor;
    });
    return dados;
}

// Função para exibir textos na tela (ex: "Salvo com sucesso")[cite: 5]
function mostarAviso(texto, ehError) {
    aviso.textContent = texto;
    aviso.className = ehError ? 'erro' : '';
}

// 1. FUNÇÃO GET: Busca os endereços cadastrados no banco e monta as linhas da tabela
async function carregarEnderecos() {
    try {
        const resposta = await fetch('http://127.0.0.1:3000');
        if (!resposta.ok) throw new Error('Erro ao buscar endereços.');

        const enderecos = await resposta.json();

        // Limpa a tabela antes de preencher novamente
        corpoTabela.innerHTML = '';

        // Cria uma linha <tr> na tabela para cada endereço recebido
        enderecos.forEach((endereco) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${endereco.id}</td>
                <td>${endereco.logradouro}</td>
                <td>${endereco.numero || ''}</td>
                <td>${endereco.bairro || ''}</td>
                <td>${endereco.cidade}</td>
                <td>${endereco.uf}</td>
                <td></td>
            `;
            corpoTabela.appendChild(linha);
        });
    } catch (erro) {
        console.error('Erro ao carregar lista de endereços:', erro);
    }
}

// 2. FUNÇÃO POST: Envia os dados digitados no formulário para o servidor
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o formulário de recarregar a página
    mostarAviso('Salvando...', false);

    const dados = lerFormulario(form);

    try {
        const resposta = await fetch('http://127.0.0.1:3000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            mostarAviso('Endereço salvo com sucesso!', false);
            form.reset(); // Limpa os campos do formulário
            await carregarEnderecos(); // Atualiza a tabela com o novo registro
        } else {
            mostarAviso('Erro ao salvar no banco de dados.', true);
        }
    } catch (erro) {
        mostarAviso('Não foi possível conectar ao servidor.', true);
        console.error('Erro no envio:', erro);
    }
});

// 3. Carrega a lista de endereços automaticamente assim que a página abre
carregarEnderecos();