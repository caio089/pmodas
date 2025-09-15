// Sistema de Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

// Inicializar carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarContadorCarrinho();
    
    // Adicionar event listeners para botões do carrinho
    setTimeout(() => {
        const botoesCarrinho = document.querySelectorAll('.btn-carrinho');
        
        botoesCarrinho.forEach((button) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const nome = this.getAttribute('data-nome');
                const preco = this.getAttribute('data-preco');
                const imagem = this.getAttribute('data-imagem');
                
                adicionarAoCarrinho(id, nome, preco, imagem);
            });
        });
    }, 1000);
});

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('carrinhoContador');
    if (contador) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'block' : 'none';
    }
}

// Função para mostrar feedback visual do carrinho
function mostrarFeedbackCarrinho() {
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    feedback.textContent = 'Produto adicionado ao carrinho!';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(id, nome, preco, imagem) {
    const item = {
        id: parseInt(id),
        nome: nome || 'Produto sem nome',
        preco: parseFloat(preco) || 0,
        imagem: imagem || '',
        quantidade: 1
    };
    
    // Verificar se o item já existe no carrinho
    const itemExistente = carrinho.find(existingItem => existingItem.id === item.id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push(item);
    }
    
    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Mostrar feedback visual
    mostrarFeedbackCarrinho();
    
    // Atualizar contador do carrinho
    atualizarContadorCarrinho();
}

// Sistema de Galeria
let galeriaAtual = null;
let fotoAtual = 0;

// Função para abrir galeria
function abrirGaleria(produto) {
    galeriaAtual = produto;
    fotoAtual = 0;
    
    const modal = document.getElementById('galeriaModal');
    const imagem = document.getElementById('imagemGaleria');
    const nome = document.getElementById('nomeGaleria');
    const preco = document.getElementById('precoGaleria');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProximo = document.getElementById('btnProximo');
    
    if (modal && imagem && nome && preco) {
        nome.textContent = produto.nome;
        preco.textContent = produto.preco;
        
        if (produto.fotos && produto.fotos.length > 0) {
            imagem.src = produto.fotos[fotoAtual];
            btnAnterior.style.display = produto.fotos.length > 1 ? 'block' : 'none';
            btnProximo.style.display = produto.fotos.length > 1 ? 'block' : 'none';
        } else {
            imagem.src = produto.imagem || 'placeholder.jpg';
            btnAnterior.style.display = 'none';
            btnProximo.style.display = 'none';
        }
        
        modal.classList.remove('hidden');
    }
}

// Função para fechar galeria
function fecharGaleria() {
    const modal = document.getElementById('galeriaModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    galeriaAtual = null;
    fotoAtual = 0;
}

// Função para foto anterior
function anteriorFoto() {
    if (galeriaAtual && galeriaAtual.fotos && galeriaAtual.fotos.length > 1) {
        fotoAtual = (fotoAtual - 1 + galeriaAtual.fotos.length) % galeriaAtual.fotos.length;
        const imagem = document.getElementById('imagemGaleria');
        if (imagem) {
            imagem.src = galeriaAtual.fotos[fotoAtual];
        }
    }
}

// Função para próxima foto
function proximaFoto() {
    if (galeriaAtual && galeriaAtual.fotos && galeriaAtual.fotos.length > 1) {
        fotoAtual = (fotoAtual + 1) % galeriaAtual.fotos.length;
        const imagem = document.getElementById('imagemGaleria');
        if (imagem) {
            imagem.src = galeriaAtual.fotos[fotoAtual];
        }
    }
}

// Função para comprar da galeria
function comprarDaGaleria() {
    if (galeriaAtual) {
        abrirWhatsApp(galeriaAtual.nome);
        fecharGaleria();
    }
}

// Função para abrir WhatsApp
function abrirWhatsApp(nomeProduto) {
    const numero = '5511999999999'; // Substitua pelo seu número
    const mensagem = `Olá! Gostaria de saber mais sobre a roupa: ${nomeProduto}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Sistema de Carrinho Modal
function abrirCarrinho() {
    const modal = document.getElementById('carrinhoModal');
    if (modal) {
        modal.classList.remove('hidden');
        atualizarCarrinhoModal();
    }
}

function fecharCarrinho() {
    const modal = document.getElementById('carrinhoModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function atualizarCarrinhoModal() {
    const itensContainer = document.getElementById('carrinhoItens');
    const totalElement = document.getElementById('carrinhoTotal');
    
    if (!itensContainer) return;
    
    if (carrinho.length === 0) {
        itensContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Carrinho vazio</p>';
        if (totalElement) totalElement.textContent = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        html += `
            <div class="flex items-center space-x-4 p-4 border-b border-gray-200">
                <img src="${item.imagem || 'placeholder.jpg'}" alt="${item.nome}" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">${item.nome}</h3>
                    <p class="text-gray-600">Quantidade: ${item.quantidade}</p>
                    <p class="text-rosa-escuro font-bold">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
                </div>
                <button onclick="removerDoCarrinho(${index})" class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `;
    });
    
    itensContainer.innerHTML = html;
    
    if (totalElement) {
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    atualizarCarrinhoModal();
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    let mensagem = 'Olá! Gostaria de finalizar a compra dos seguintes itens:\n\n';
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    mensagem += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const numero = '5511999999999'; // Substitua pelo seu número
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Sistema de Filtros
function filtrarCatalogo() {
    const busca = document.getElementById('catalogSearch')?.value.toLowerCase() || '';
    const categoria = document.getElementById('catalogCategory')?.value || '';
    const preco = document.getElementById('catalogPrice')?.value || '';
    
    const cards = document.querySelectorAll('.catalog-card');
    let visiveis = 0;
    
    cards.forEach(card => {
        const nome = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const categoriaCard = card.getAttribute('data-categoria') || '';
        const precoCard = parseFloat(card.getAttribute('data-preco')) || 0;
        
        let mostrar = true;
        
        if (busca && !nome.includes(busca)) {
            mostrar = false;
        }
        
        if (categoria && categoriaCard !== categoria) {
            mostrar = false;
        }
        
        if (preco) {
            const [min, max] = preco.split('-').map(p => parseFloat(p) || 0);
            if (max === 0) {
                if (precoCard < min) mostrar = false;
            } else {
                if (precoCard < min || precoCard > max) mostrar = false;
            }
        }
        
        if (mostrar) {
            card.style.display = 'block';
            visiveis++;
        } else {
            card.style.display = 'none';
        }
    });
    
    const noResults = document.getElementById('catalogNoResults');
    if (noResults) {
        noResults.style.display = visiveis === 0 ? 'block' : 'none';
    }
}

// Inicializar filtros
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('catalogSearch');
    const categoryFilter = document.getElementById('catalogCategory');
    const priceFilter = document.getElementById('catalogPrice');
    
    if (searchInput) searchInput.addEventListener('input', filtrarCatalogo);
    if (categoryFilter) categoryFilter.addEventListener('change', filtrarCatalogo);
    if (priceFilter) priceFilter.addEventListener('change', filtrarCatalogo);
});
