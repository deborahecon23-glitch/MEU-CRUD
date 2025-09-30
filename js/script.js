
const STORAGE_KEY = 'produtosCRUD';
let produtos = [];


function carregarProdutos() {
    const dados = localStorage.getItem(STORAGE_KEY);
    produtos = dados ? JSON.parse(dados) : [];
}


function salvarProdutos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}




if (document.getElementById('formulario-produto')) {
    carregarProdutos(); 

    const formulario = document.getElementById('formulario-produto');
    const inputIdEdicao = document.getElementById('produto-id-edicao');
    const urlParams = new URLSearchParams(window.location.search);
    const idParaEdicao = urlParams.get('id');

    
    if (idParaEdicao) {
        document.getElementById('titulo-pagina').textContent = 'Editar Produto';
        document.getElementById('botao-salvar').textContent = 'Salvar Alterações';
        
        const produtoParaEditar = produtos.find(p => p.id == idParaEdicao);
        
        if (produtoParaEditar) {
            
            document.getElementById('nome').value = produtoParaEditar.nome;
            document.getElementById('preco').value = produtoParaEditar.preco;
            document.getElementById('categoria').value = produtoParaEditar.categoria;
            document.getElementById('origem').value = produtoParaEditar.origem;
            document.getElementById('lote').value = produtoParaEditar.lote;
            document.getElementById('validade').value = produtoParaEditar.validade;
            
            
            inputIdEdicao.value = idParaEdicao;
        }
    }

    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

       
        let precoFormatado = document.getElementById('preco').value.replace(',', '.');

        const dadosProduto = {
            id: inputIdEdicao.value ? parseInt(inputIdEdicao.value) : 0, 
            nome: document.getElementById('nome').value,
            preco: parseFloat(precoFormatado),
            categoria: document.getElementById('categoria').value,
            origem: document.getElementById('origem').value,
            lote: document.getElementById('lote').value,
            validade: document.getElementById('validade').value
        };

        if (dadosProduto.id) {
            
            const index = produtos.findIndex(p => p.id == dadosProduto.id);
            if (index !== -1) {
                produtos[index] = dadosProduto;
            }
        } else {
            
            dadosProduto.id = Date.now(); // Gera um ID único
            produtos.push(dadosProduto);
        }

        salvarProdutos();
        
        window.location.href = 'lista.html';
    });
}



if (document.getElementById('tabela-produtos')) {
    carregarProdutos();
    renderizarLista();
}


function renderizarLista() {
    const corpoTabela = document.getElementById('corpo-tabela-produtos');
    const msgVazia = document.getElementById('lista-vazia-msg');
    
    corpoTabela.innerHTML = ''; 
    if (produtos.length === 0) {
        msgVazia.style.display = 'block';
        return;
    }

    msgVazia.style.display = 'none';

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        const precoFormatado = 'R$ ' + produto.preco.toFixed(2).replace('.', ',');

        
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${precoFormatado}</td>
            <td>${produto.categoria}</td>
            <td>${produto.lote}</td>
            <td>${produto.validade}</td>
            <td>
                <button class="botao-editar" data-id="${produto.id}">Editar</button>
                <button class="botao-excluir" data-id="${produto.id}">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });

   
    anexarListenersAcoes();
}


function anexarListenersAcoes() {
    
    document.querySelectorAll('.botao-excluir').forEach(button => {
        button.addEventListener('click', function() {
            const idExcluir = this.getAttribute('data-id');
            excluirProduto(idExcluir);
        });
    });

   
    document.querySelectorAll('.botao-editar').forEach(button => {
        button.addEventListener('click', function() {
            const idEditar = this.getAttribute('data-id');
            window.location.href = `cadastro.html?id=${idEditar}`;
        });
    });
}



function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos = produtos.filter(produto => produto.id != id);
        
        salvarProdutos(); 
        renderizarLista(); 
    }
}