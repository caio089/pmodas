// Sistema de Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

// Variáveis para o modal de tamanho
let produtoSelecionado = null;
let tamanhoSelecionado = null;

// Função para inicializar o carrinho
function inicializarCarrinho() {
    console.log('Inicializando carrinho...');
    console.log('Carrinho atual:', carrinho);
    console.log('Total de itens:', carrinho.reduce((total, item) => total + item.quantidade, 0));
    
    atualizarContadorCarrinho();
    
    // Adicionar event listeners para botões do carrinho
    const botoesCarrinho = document.querySelectorAll('.btn-carrinho');
    console.log(`Encontrados ${botoesCarrinho.length} botões de carrinho`);
    
    botoesCarrinho.forEach((button, index) => {
        // Remover listeners existentes para evitar duplicação
        button.removeEventListener('click', handleCarrinhoClick);
        button.addEventListener('click', handleCarrinhoClick);
        console.log(`Event listener adicionado ao botão ${index + 1}`);
    });
}

// Função separada para lidar com cliques no carrinho
function handleCarrinhoClick(e) {
    e.preventDefault();
    console.log('Botão de carrinho clicado!');
    
    const id = this.getAttribute('data-id');
    const nome = this.getAttribute('data-nome');
    const preco = this.getAttribute('data-preco');
    const imagem = this.getAttribute('data-imagem');
    
    console.log('Dados do produto:', { id, nome, preco, imagem });
    
    if (id && nome && preco && imagem) {
        abrirModalTamanho(id, nome, preco, imagem);
    } else {
        console.error('Dados do produto incompletos:', { id, nome, preco, imagem });
        alert('Erro: Dados do produto incompletos. Tente novamente.');
    }
}

// Aguardar o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - inicializando carrinho');
    inicializarCarrinho();
});

// Também tentar inicializar quando a página estiver totalmente carregada
window.addEventListener('load', function() {
    console.log('Página carregada - reinicializando carrinho');
    setTimeout(inicializarCarrinho, 100);
});

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('carrinhoContador');
    const contadorDesktop = document.getElementById('carrinhoContadorDesktop');
    const contadorMobile = document.getElementById('carrinhoContadorMobile');
    
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    console.log(`Atualizando contadores: ${totalItens} itens`);
    
    if (contador) {
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'block' : 'none';
        console.log('Contador principal atualizado');
    }
    
    if (contadorDesktop) {
        contadorDesktop.textContent = totalItens;
        contadorDesktop.style.display = totalItens > 0 ? 'block' : 'none';
        console.log('Contador desktop atualizado');
    }
    
    if (contadorMobile) {
        contadorMobile.textContent = totalItens;
        contadorMobile.style.display = totalItens > 0 ? 'block' : 'none';
        console.log('Contador mobile atualizado');
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

// Função para abrir modal de seleção de tamanho
function abrirModalTamanho(id, nome, preco, imagem) {
    produtoSelecionado = { id, nome, preco, imagem };
    tamanhoSelecionado = null;
    
    // Preencher informações do produto no modal
    document.getElementById('modalProdutoImagem').src = imagem;
    document.getElementById('modalProdutoImagem').alt = nome;
    document.getElementById('modalProdutoNome').textContent = nome;
    document.getElementById('modalProdutoPreco').textContent = `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
    
    // Resetar seleção de tamanho
    document.querySelectorAll('.tamanho-btn').forEach(btn => {
        btn.classList.remove('border-rosa-escuro', 'bg-rosa-claro');
        btn.classList.add('border-gray-300');
    });
    
    // Desabilitar botão de confirmação
    document.getElementById('confirmarTamanho').disabled = true;
    
    // Mostrar modal
    document.getElementById('tamanhoModal').classList.remove('hidden');
}

// Função para selecionar tamanho
function selecionarTamanho(tamanho) {
    tamanhoSelecionado = tamanho;
    
    // Atualizar visual dos botões
    document.querySelectorAll('.tamanho-btn').forEach(btn => {
        btn.classList.remove('border-rosa-escuro', 'bg-rosa-claro');
        btn.classList.add('border-gray-300');
    });
    
    // Destacar tamanho selecionado
    event.target.classList.remove('border-gray-300');
    event.target.classList.add('border-rosa-escuro', 'bg-rosa-claro');
    
    // Habilitar botão de confirmação
    document.getElementById('confirmarTamanho').disabled = false;
}

// Função para confirmar tamanho e adicionar ao carrinho
function confirmarTamanho() {
    if (produtoSelecionado && tamanhoSelecionado) {
        adicionarAoCarrinho(produtoSelecionado.id, produtoSelecionado.nome, produtoSelecionado.preco, produtoSelecionado.imagem, tamanhoSelecionado);
        fecharTamanhoModal();
    }
}

// Função para fechar modal de tamanho
function fecharTamanhoModal() {
    document.getElementById('tamanhoModal').classList.add('hidden');
    produtoSelecionado = null;
    tamanhoSelecionado = null;
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(id, nome, preco, imagem, tamanho) {
    const item = {
        id: parseInt(id),
        nome: nome || 'Produto sem nome',
        preco: parseFloat(preco) || 0,
        imagem: imagem || '',
        tamanho: tamanho || 'Único',
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
    
    // Abrir o carrinho automaticamente
    abrirCarrinho();
}

// Função para abrir o carrinho
function abrirCarrinho() {
    const modal = document.getElementById('carrinhoModal');
    
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        atualizarCarrinhoModal();
    }
}

// Função para fechar o carrinho
function fecharCarrinho() {
    const modal = document.getElementById('carrinhoModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Função para atualizar o modal do carrinho
function atualizarCarrinhoModal() {
    const carrinhoItens = document.getElementById('carrinhoItens');
    const carrinhoTotal = document.getElementById('carrinhoTotal');
    const btnLimparCarrinho = document.getElementById('btnLimparCarrinho');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
    
    if (!carrinhoItens || !carrinhoTotal) return;
    
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = `
            <div class="text-center py-8">
                <div class="text-6xl mb-4">🛒</div>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Seu carrinho está vazio</h3>
                <p class="text-gray-500 mb-4">Adicione alguns produtos para começar!</p>
                <button onclick="fecharCarrinho()" class="bg-rosa-escuro text-white px-6 py-2 rounded-lg hover:bg-rosa-hover transition-colors">
                    Continuar Comprando
                </button>
            </div>
        `;
        carrinhoTotal.textContent = 'R$ 0,00';
        
        // Ocultar botões quando carrinho vazio
        if (btnLimparCarrinho) btnLimparCarrinho.style.display = 'none';
        if (btnFinalizarCompra) btnFinalizarCompra.style.display = 'none';
        return;
    }

    // Mostrar botões quando carrinho tem itens
    if (btnLimparCarrinho) btnLimparCarrinho.style.display = 'block';
    if (btnFinalizarCompra) btnFinalizarCompra.style.display = 'block';

    let total = 0;
    
    const htmlItens = carrinho.map((item) => {
        const preco = parseFloat(item.preco) || 0;
        const subtotal = preco * item.quantidade;
        total += subtotal;

        return `
            <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-3">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    ${item.imagem ? 
                        `<img src="${item.imagem}" alt="${item.nome}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full flex items-center justify-center text-gray-400">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        </div>`
                    }
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${item.nome}</h4>
                    <p class="text-sm text-gray-600">Tamanho: ${item.tamanho}</p>
                    <p class="text-sm text-gray-600">R$ ${preco.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="alterarQuantidade(${item.id}, -1)" class="w-8 h-8 bg-rosa-escuro text-white rounded-full hover:bg-rosa-hover transition-colors">-</button>
                    <span class="w-8 text-center font-semibold">${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 1)" class="w-8 h-8 bg-rosa-escuro text-white rounded-full hover:bg-rosa-hover transition-colors">+</button>
                </div>
                <div class="text-right">
                    <p class="font-bold text-black">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
                    <button onclick="removerItem(${item.id})" class="text-red-500 hover:text-red-700 text-sm">Remover</button>
                </div>
            </div>
        `;
    }).join('');
    
    carrinhoItens.innerHTML = htmlItens;
    carrinhoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Função para alterar quantidade de um item
function alterarQuantidade(id, mudanca) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade += mudanca;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(item => item.id !== id);
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        atualizarCarrinhoModal();
    }
}

// Função para remover item do carrinho
function removerItem(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    atualizarCarrinhoModal();
}

// Função para limpar carrinho completamente
function limparCarrinho() {
    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    atualizarCarrinhoModal();
}

// Função para comprar produto individual via WhatsApp
window.buyOnWhatsApp = function(productName, price, size, productImage) {
    const message = `🛍️ *Olá! Vim do site da Paixão Modas* 🛍️

👗 *Produto:* ${productName}
📏 *Tamanho:* ${size}
💰 *Valor:* R$ ${price.toFixed(2).replace('.', ',')}

${productImage ? `📸 *Foto do produto:* ${productImage}` : ''}

❓ *Você consegue confirmar este produto para mim?*
✅ *Está disponível?*

Obrigada! 😊`;
    
    const whatsappNumber = "5589994169377";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Função para finalizar compra
function finalizarCompra() {
    if (!carrinho.length) {
        alert('Carrinho vazio!');
        return;
    }

    // Construir mensagem melhorada
    let mensagem = `🛍️ *Olá! Vim do site da Paixão Modas* 🛍️

📋 *Resumo do meu pedido:*

`;
    let total = 0;

    carrinho.forEach((item, i) => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;
        mensagem += `${i + 1}. 👗 *${item.nome}*
   📏 Tamanho: ${item.tamanho}
   🔢 Quantidade: ${item.quantidade}
   💰 Valor: R$ ${itemTotal.toFixed(2).replace('.', ',')}
${item.imagem ? `   📸 Foto: ${item.imagem}` : ''}

`;
    });

    mensagem += `💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*

❓ *Você consegue confirmar este pedido para mim?*
✅ *Todos os produtos estão disponíveis?*
💳 *Quais as formas de pagamento?*

Obrigada! 😊`;

    const numero = '5589994169377';
    
    // Detectar dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Usar apenas a URL que funciona melhor para cada dispositivo
    let url;
    if (isMobile) {
        // Mobile: wa.me funciona melhor
        url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    } else {
        // Desktop: usar web.whatsapp.com que funciona melhor
        url = `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;
    }
    
    // Abrir WhatsApp
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
        
        // Filtro por busca
        if (busca && !nome.includes(busca)) {
            mostrar = false;
        }
        
        // Filtro por categoria
        if (categoria && categoriaCard !== categoria) {
            mostrar = false;
        }
        
        // Filtro por preço
        if (preco) {
            if (preco === '200+') {
                if (precoCard < 200) mostrar = false;
            } else {
                const [min, max] = preco.split('-').map(p => parseFloat(p) || 0);
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
    
    // Mostrar mensagem se não houver resultados
    const noResults = document.getElementById('catalogNoResults');
    if (noResults) {
        noResults.style.display = visiveis === 0 ? 'block' : 'none';
    }
    
    // Atualizar contador de resultados
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = `${visiveis} produto${visiveis !== 1 ? 's' : ''} encontrado${visiveis !== 1 ? 's' : ''}`;
    }
}

// Função debounce para otimizar a busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inicializar filtros
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('catalogSearch');
    const categoryFilter = document.getElementById('catalogCategory');
    const priceFilter = document.getElementById('catalogPrice');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filtrarCatalogo, 300));
        searchInput.addEventListener('keyup', debounce(filtrarCatalogo, 300));
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filtrarCatalogo);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filtrarCatalogo);
    }
    
    // Executar filtro inicial
    filtrarCatalogo();
});

// Sistema de Galeria de Imagens
const currentImageIndex = {};

// Inicializa o índice para cada produto
function initializeImageIndex(productId) {
    if (!currentImageIndex[productId]) {
        currentImageIndex[productId] = 0;
    }
}

// Mostra uma imagem específica
function showImage(productId, imageIndex) {
    initializeImageIndex(productId);
    
    // Esconde todas as imagens do produto
    const images = document.querySelectorAll(`[id^="img-${productId}-"]`);
    images.forEach(img => img.classList.add('hidden'));
    
    // Mostra a imagem selecionada
    const targetImage = document.getElementById(`img-${productId}-${imageIndex}`);
    if (targetImage) {
        targetImage.classList.remove('hidden');
        currentImageIndex[productId] = imageIndex;
        
        // Atualiza os indicadores
        updateIndicators(productId, imageIndex);
        
        // Atualiza o contador
        updateCounter(productId, imageIndex);
    }
}

// Próxima imagem
function nextImage(productId) {
    initializeImageIndex(productId);
    
    const totalImages = document.querySelectorAll(`[id^="img-${productId}-"]`).length;
    const nextIndex = (currentImageIndex[productId] + 1) % totalImages;
    showImage(productId, nextIndex);
}

// Imagem anterior
function previousImage(productId) {
    initializeImageIndex(productId);
    
    const totalImages = document.querySelectorAll(`[id^="img-${productId}-"]`).length;
    const prevIndex = currentImageIndex[productId] === 0 ? totalImages - 1 : currentImageIndex[productId] - 1;
    showImage(productId, prevIndex);
}

// Atualiza os indicadores de posição
function updateIndicators(productId, imageIndex) {
    const indicators = document.querySelectorAll(`[class*="indicator-${productId}-"]`);
    indicators.forEach((indicator, index) => {
        if (index === imageIndex) {
            indicator.classList.remove('bg-white/30');
            indicator.classList.add('bg-white/70');
        } else {
            indicator.classList.remove('bg-white/70');
            indicator.classList.add('bg-white/30');
        }
    });
}

// Atualiza o contador de imagens
function updateCounter(productId, imageIndex) {
    const counter = document.getElementById(`counter-${productId}`);
    if (counter) {
        counter.textContent = imageIndex + 1;
    }
}

// Inicializa todos os produtos quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Encontra todos os produtos com múltiplas imagens
    const productsWithMultipleImages = document.querySelectorAll('[id^="img-"][id$="-1"], [id^="img-"][id$="-2"]');
    const productIds = new Set();
    
    productsWithMultipleImages.forEach(img => {
        const productId = img.id.split('-')[1];
        productIds.add(productId);
    });
    
    // Inicializa cada produto
    productIds.forEach(productId => {
        initializeImageIndex(productId);
        showImage(productId, 0);
    });
});