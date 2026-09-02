async function chama_back(){
    const campoTexto = document.getElementById('resposta');
    campoTexto.innerText = "Carregando";

    try {
        const respostaServidor = await fetch('http://127.0.0.1:3000');
        const dados = await respostaServidor.json();
        
        campoTexto.innerText = dados.mensagem; 
        
        console.log("Resto dos dados recebidos:", dados);
        
    } catch (erro) {
        campoTexto.innerText = "Erro ao tentar carregar...";
        console.error(erro);
    }
}

const form = document.getElementById('formEndereco');
const aviso = document.getElementById('aviso');
const corpoTabela = document.getElementById('corpoTabela');

function lerFormulario(formulario) {
    const dados = {};
    const campos = new FormData(formulario);
        campos.forEach(function (valor, chave) {
            dados[chave] = valor;
        });
        return dados;
}
function mostarAviso(texto, ehError) {
    aviso.textContent = texto;
    aviso.className = ehError ? 'erro' : '';
}