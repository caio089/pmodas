// Função para carregar produtos do localStorage (do dashboard) ou usar produtos padrão
function carregarProdutos() {
    const produtosSalvos = localStorage.getItem('products');
    if (produtosSalvos) {
        const produtosDashboard = JSON.parse(produtosSalvos);
        // Converter formato do dashboard para formato do catálogo
        return produtosDashboard.map(produto => ({
            id: produto.id,
            nome: produto.name,
            preco: parseFloat(produto.price),
            categoria: produto.category,
            tamanhos: produto.sizes.split(',').map(s => s.trim()),
            imagem: produto.photos && produto.photos[0] ? produto.photos[0] : "FOTO AQUI",
            fotos: produto.photos || [produto.photos && produto.photos[0] ? produto.photos[0] : "FOTO AQUI"],
            descricao: produto.description || ""
        }));
    }
    
    // Produtos padrão se não houver produtos salvos
    return [
        {
            id: 1,
            nome: "Vestido Floral Elegante",
            preco: 89.90,
            categoria: "vestido",
            tamanhos: ["P", "M", "G", "GG"],
            imagem: "FOTO AQUI",
            fotos: [
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop"
            ],
            descricao: "Vestido elegante com estampa floral"
        },
        {
            id: 2,
            nome: "Calça Jeans Skinny",
            preco: 129.90,
            categoria: "calca",
            tamanhos: ["P", "M", "G"],
            imagem: "FOTO AQUI",
            fotos: [
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop"
            ],
            descricao: "Calça jeans skinny moderna e confortável"
        },
        {
            id: 3,
            nome: "Blusa de Seda Premium",
            preco: 69.90,
            categoria: "blusa",
            tamanhos: ["P", "M", "G", "GG"],
            imagem: "FOTO AQUI",
            fotos: [
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=600&fit=crop"
            ],
            descricao: "Blusa de seda premium elegante e confortável"
        },
        {
            id: 4,
            nome: "Saia Midi Plissada",
            preco: 79.90,
            categoria: "saia",
            tamanhos: ["P", "M", "G"],
            imagem: "FOTO AQUI",
            fotos: ["FOTO AQUI"],
            descricao: "Saia midi plissada elegante e versátil"
        },
        {
            id: 5,
            nome: "Conjunto Sport Elegante",
            preco: 149.90,
            categoria: "conjunto",
            tamanhos: ["M", "G", "GG"],
            imagem: "FOTO AQUI",
            fotos: ["FOTO AQUI"],
            descricao: "Conjunto sport elegante para ocasiões especiais"
        }
    ];
}

// Carregar produtos dinamicamente
const produtos = carregarProdutos();

// Elementos do DOM
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const noProducts = document.getElementById('noProducts');

// Função para formatar preço
function formatarPreco(preco) {
    return preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

         // Sistema de Carrinho
 let carrinho = [];
 let produtoSelecionado = null;
 
 // Sistema de Galeria
 let galeriaAtual = null;
 let fotoAtual = 0;
 
 // Função para detectar e abrir WhatsApp da melhor forma
 function abrirWhatsAppConversa(numero, mensagem) {
     const numeroLimpo = numero.replace(/\D/g, ''); // Remove caracteres não numéricos
     const mensagemCodificada = encodeURIComponent(mensagem);
     
     // Detectar se é mobile ou desktop
     const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
     
     if (isMobile) {
         // Para mobile, usar wa.me que abre direto no app
         const mobileUrl = `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`;
         window.location.href = mobileUrl;
     } else {
         // Para desktop, usar WhatsApp Web
         const webUrl = `https://web.whatsapp.com/send?phone=${numeroLimpo}&text=${mensagemCodificada}`;
         window.open(webUrl, '_blank');
         
         // Fallback para wa.me se o WhatsApp Web não funcionar
         setTimeout(() => {
             const fallbackUrl = `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`;
             window.open(fallbackUrl, '_blank');
         }, 2000);
     }
 }
 
 // Função para abrir WhatsApp
 function abrirWhatsApp(nomeProduto) {
     const mensagem = `Olá! Tenho interesse no produto ${nomeProduto}. Pode me dar mais informações?`;
     const numeroWhatsApp = '5589994077754'; // Substitua pelo número real
     
     abrirWhatsAppConversa(numeroWhatsApp, mensagem);
 }
 
 // Função para adicionar produto ao carrinho
 function adicionarAoCarrinho(produtoId) {
     const produto = produtos.find(p => p.id === produtoId);
     if (produto) {
         produtoSelecionado = produto;
         abrirModalTamanho();
     }
 }
 
 // Função para abrir modal de seleção de tamanho
 function abrirModalTamanho() {
     const modal = document.getElementById('sizeModal');
     const modalContent = document.getElementById('modalContent');
     
     modalContent.innerHTML = `
         <div class="text-center mb-3 sm:mb-4">
             <h4 class="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">${produtoSelecionado.nome}</h4>
             <p class="text-xl sm:text-2xl font-bold text-rosa-escuro">${formatarPreco(produtoSelecionado.preco)}</p>
         </div>
         
         <div class="mb-3 sm:mb-4">
             <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Selecione o tamanho:</p>
             <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                 ${produtoSelecionado.tamanhos.map(tamanho => `
                     <button 
                         onclick="selecionarTamanho('${tamanho}')"
                         class="py-2 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 rounded-lg hover:border-rosa-claro hover:bg-rosa-claro/10 transition-all duration-300 text-gray-700 font-medium hover:text-rosa-escuro text-sm sm:text-base"
                     >
                         ${tamanho}
                     </button>
                 `).join('')}
             </div>
         </div>
         
         <div class="flex space-x-2 sm:space-x-3">
             <button 
                 onclick="fecharModalTamanho()"
                 class="flex-1 py-2 sm:py-3 px-3 sm:px-4 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base"
             >
                 Cancelar
             </button>
         </div>
     `;
     
     modal.classList.remove('hidden');
 }
 
 // Função para fechar modal de tamanho
 function fecharModalTamanho() {
     document.getElementById('sizeModal').classList.add('hidden');
     produtoSelecionado = null;
 }
 
 // Função para selecionar tamanho e adicionar ao carrinho
 function selecionarTamanho(tamanho) {
     if (produtoSelecionado) {
         const itemCarrinho = {
             id: produtoSelecionado.id,
             nome: produtoSelecionado.nome,
             preco: produtoSelecionado.preco,
             tamanho: tamanho,
             categoria: produtoSelecionado.categoria,
             quantidade: 1
         };
         
         // Verificar se o produto já está no carrinho com o mesmo tamanho
         const itemExistente = carrinho.find(item => 
             item.id === itemCarrinho.id && item.tamanho === itemCarrinho.tamanho
         );
         
         if (itemExistente) {
             itemExistente.quantidade += 1;
         } else {
             carrinho.push(itemCarrinho);
         }
         
         atualizarCarrinho();
         fecharModalTamanho();
         
         // Mostrar notificação
         mostrarNotificacao('Produto adicionado ao carrinho!');
     }
 }
 
 // Função para mostrar notificação
 function mostrarNotificacao(mensagem) {
     const notificacao = document.createElement('div');
     notificacao.className = 'fixed top-6 right-6 bg-rosa-claro text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
     notificacao.textContent = mensagem;
     
     document.body.appendChild(notificacao);
     
     setTimeout(() => {
         notificacao.style.transform = 'translateX(0)';
     }, 100);
     
     setTimeout(() => {
         notificacao.style.transform = 'translateX-full';
         setTimeout(() => {
             document.body.removeChild(notificacao);
         }, 300);
     }, 3000);
 }
 
 // Função para atualizar carrinho
 function atualizarCarrinho() {
     const contador = document.getElementById('carrinhoContador');
     const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
     
     contador.textContent = total;
     contador.classList.toggle('hidden', total === 0);
     
     // Salvar no localStorage
     localStorage.setItem('carrinho', JSON.stringify(carrinho));
 }
 
 // Função para abrir carrinho
 function abrirCarrinho() {
     if (carrinho.length === 0) {
         mostrarNotificacao('Seu carrinho está vazio!');
         return;
     }
     
     const modal = document.getElementById('carrinhoModal');
     const carrinhoItens = document.getElementById('carrinhoItens');
     const carrinhoTotal = document.getElementById('carrinhoTotal');
     const btnFinalizar = document.getElementById('btnFinalizarCompra');
     
     // Renderizar itens do carrinho
     carrinhoItens.innerHTML = carrinho.map((item, index) => `
         <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200 mb-2 sm:mb-3">
             <div class="flex-1 mb-2 sm:mb-0">
                 <h4 class="font-semibold text-gray-800 text-sm sm:text-base">${item.nome}</h4>
                 <p class="text-xs sm:text-sm text-gray-600">Tamanho: ${item.tamanho} | Categoria: ${item.categoria}</p>
                 <p class="text-rosa-escuro font-semibold text-sm sm:text-base">${formatarPreco(item.preco)}</p>
             </div>
             
             <div class="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                 <div class="flex items-center space-x-1 sm:space-x-2">
                     <button 
                         onclick="alterarQuantidade(${index}, -1)"
                         class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                     >
                         <span class="text-gray-600 font-bold text-sm sm:text-base">-</span>
                     </button>
                     <span class="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">${item.quantidade}</span>
                     <button 
                         onclick="alterarQuantidade(${index}, 1)"
                         class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                     >
                         <span class="text-gray-600 font-bold text-sm sm:text-base">+</span>
                     </button>
                 </div>
                 
                 <button 
                     onclick="removerItem(${index})"
                     class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                 >
                     <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                     </svg>
                 </button>
             </div>
         </div>
     `).join('');
     
     // Calcular e mostrar total
     const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
     carrinhoTotal.textContent = formatarPreco(total);
     
     // Habilitar/desabilitar botão de finalizar
     btnFinalizar.disabled = carrinho.length === 0;
     
     modal.classList.remove('hidden');
 }
 
 // Função para fechar carrinho
 function fecharCarrinho() {
     document.getElementById('carrinhoModal').classList.add('hidden');
 }
 
 // Função para alterar quantidade
 function alterarQuantidade(index, delta) {
     const item = carrinho[index];
     const novaQuantidade = item.quantidade + delta;
     
     if (novaQuantidade <= 0) {
         removerItem(index);
     } else {
         item.quantidade = novaQuantidade;
         atualizarCarrinho();
         
         // Atualizar display do carrinho se estiver aberto
         if (!document.getElementById('carrinhoModal').classList.contains('hidden')) {
             abrirCarrinho();
         }
     }
 }
 
 // Função para remover item
 function removerItem(index) {
     carrinho.splice(index, 1);
     atualizarCarrinho();
     
     // Atualizar display do carrinho se estiver aberto
     if (!document.getElementById('carrinhoModal').classList.contains('hidden')) {
         abrirCarrinho();
     }
 }
 
 // Função para finalizar compra
 function finalizarCompra() {
     if (carrinho.length === 0) return;
     
     const numeroWhatsApp = '5589994077754'; // Substitua pelo número real
     
     // Criar mensagem detalhada
     let mensagem = `🛍️ *PAIXAO MODAS - Pedido*\n\n`;
     mensagem += `Olá! Gostaria de fazer um pedido com os seguintes itens:\n\n`;
     
     carrinho.forEach((item, index) => {
         mensagem += `${index + 1}. *${item.nome}*\n`;
         mensagem += `   • Tamanho: ${item.tamanho}\n`;
         mensagem += `   • Categoria: ${item.categoria}\n`;
         mensagem += `   • Quantidade: ${item.quantidade}\n`;
         mensagem += `   • Preço: ${formatarPreco(item.preco)}\n`;
         mensagem += `   • Subtotal: ${formatarPreco(item.preco * item.quantidade)}\n\n`;
     });
     
     const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
     mensagem += `💰 *TOTAL: ${formatarPreco(total)}*\n\n`;
     mensagem += `❓ *Perguntas:*\n`;
     mensagem += `• Todos os tamanhos estão disponíveis?\n`;
     mensagem += `• Qual o prazo de entrega?\n`;
     mensagem += `• Formas de pagamento aceitas?\n\n`;
     mensagem += `Aguardo retorno! 😊`;
     
     // Usar função otimizada para abrir WhatsApp
     abrirWhatsAppConversa(numeroWhatsApp, mensagem);
     
     // Limpar carrinho após envio
     carrinho = [];
     atualizarCarrinho();
     fecharCarrinho();
     
     mostrarNotificacao('Pedido enviado com sucesso!');
 }

// Funções da Galeria de Fotos
function abrirGaleria(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    
    galeriaAtual = produto;
    fotoAtual = 0;
    
    // Configurar modal
    document.getElementById('galeriaTitulo').textContent = `Galeria - ${produto.nome}`;
    document.getElementById('galeriaNomeProduto').textContent = produto.nome;
    document.getElementById('galeriaPreco').textContent = formatarPreco(produto.preco);
    
    // Configurar botão de compra
    document.getElementById('btnComprarGaleria').setAttribute('data-produto-id', produtoId);
    
    // Carregar fotos
    carregarFotosGaleria();
    
    // Mostrar modal
    document.getElementById('galeriaModal').classList.remove('hidden');
}

function fecharGaleria() {
    document.getElementById('galeriaModal').classList.add('hidden');
    galeriaAtual = null;
    fotoAtual = 0;
}

function carregarFotosGaleria() {
    if (!galeriaAtual) return;
    
    const fotos = galeriaAtual.fotos || [galeriaAtual.imagem];
    const imagemPrincipal = document.getElementById('imagemPrincipal');
    const contadorFotos = document.getElementById('contadorFotos');
    const miniaturasContainer = document.getElementById('miniaturasContainer');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProximo = document.getElementById('btnProximo');
    
    // Carregar primeira foto
    imagemPrincipal.src = fotos[0];
    imagemPrincipal.alt = galeriaAtual.nome;
    
    // Atualizar contador
    contadorFotos.textContent = `${fotoAtual + 1} / ${fotos.length}`;
    
    // Configurar botões de navegação
    btnAnterior.style.display = fotos.length > 1 ? 'block' : 'none';
    btnProximo.style.display = fotos.length > 1 ? 'block' : 'none';
    
    // Criar miniaturas
    miniaturasContainer.innerHTML = fotos.map((foto, index) => `
        <div class="flex-shrink-0 cursor-pointer ${index === fotoAtual ? 'ring-2 ring-rosa-escuro' : ''}" onclick="irParaFoto(${index})">
            <img src="${foto}" alt="${galeriaAtual.nome} - Foto ${index + 1}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 ${index === fotoAtual ? 'border-rosa-escuro' : 'border-gray-200'}">
        </div>
    `).join('');
}

function proximaFoto() {
    if (!galeriaAtual) return;
    
    const fotos = galeriaAtual.fotos || [galeriaAtual.imagem];
    fotoAtual = (fotoAtual + 1) % fotos.length;
    atualizarFotoAtual();
}

function anteriorFoto() {
    if (!galeriaAtual) return;
    
    const fotos = galeriaAtual.fotos || [galeriaAtual.imagem];
    fotoAtual = (fotoAtual - 1 + fotos.length) % fotos.length;
    atualizarFotoAtual();
}

function irParaFoto(index) {
    if (!galeriaAtual) return;
    
    const fotos = galeriaAtual.fotos || [galeriaAtual.imagem];
    if (index >= 0 && index < fotos.length) {
        fotoAtual = index;
        atualizarFotoAtual();
    }
}

function atualizarFotoAtual() {
    if (!galeriaAtual) return;
    
    const fotos = galeriaAtual.fotos || [galeriaAtual.imagem];
    const imagemPrincipal = document.getElementById('imagemPrincipal');
    const contadorFotos = document.getElementById('contadorFotos');
    const miniaturasContainer = document.getElementById('miniaturasContainer');
    
    // Atualizar imagem principal
    imagemPrincipal.src = fotos[fotoAtual];
    
    // Atualizar contador
    contadorFotos.textContent = `${fotoAtual + 1} / ${fotos.length}`;
    
    // Atualizar miniaturas
    const miniaturas = miniaturasContainer.querySelectorAll('div');
    miniaturas.forEach((miniatura, index) => {
        const img = miniatura.querySelector('img');
        if (index === fotoAtual) {
            miniatura.classList.add('ring-2', 'ring-rosa-escuro');
            img.classList.remove('border-gray-200');
            img.classList.add('border-rosa-escuro');
        } else {
            miniatura.classList.remove('ring-2', 'ring-rosa-escuro');
            img.classList.remove('border-rosa-escuro');
            img.classList.add('border-gray-200');
        }
    });
}

function comprarDaGaleria() {
    const produtoId = document.getElementById('btnComprarGaleria').getAttribute('data-produto-id');
    if (produtoId) {
        fecharGaleria();
        adicionarAoCarrinho(parseInt(produtoId));
    }
}

// Função para renderizar produtos com destaque de busca
function renderizarProdutos(produtosFiltrados) {
    if (produtosFiltrados.length === 0) {
        productsGrid.classList.add('hidden');
        noProducts.classList.remove('hidden');
        return;
    }

    productsGrid.classList.remove('hidden');
    noProducts.classList.add('hidden');

    const termoBusca = searchInput.value.toLowerCase().trim();

    productsGrid.innerHTML = produtosFiltrados.map(produto => {
        // Destacar o termo de busca no nome do produto
        let nomeDestacado = produto.nome;
        if (termoBusca.length > 0) {
            const regex = new RegExp(`(${termoBusca})`, 'gi');
            nomeDestacado = produto.nome.replace(regex, '<mark class="bg-yellow-200 text-gray-800 px-1 rounded">$1</mark>');
        }

        return `
            <div class="card-hover bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden fade-in">
                <!-- Imagem do Produto -->
                <div class="image-hover bg-gray-200 h-48 sm:h-56 md:h-64 flex items-center justify-center relative cursor-pointer" onclick="abrirGaleria(${produto.id})">
                    <span class="text-gray-500 font-medium text-sm sm:text-base">${produto.imagem}</span>
                    <!-- Indicador de múltiplas fotos -->
                    <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>${produto.fotos ? produto.fotos.length : 1}</span>
                    </div>
                    <!-- Overlay de hover -->
                    <div class="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div class="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <!-- Informações do Produto -->
                <div class="p-3 sm:p-4 md:p-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2">${nomeDestacado}</h3>
                    <p class="text-lg sm:text-xl md:text-2xl font-bold text-rosa-escuro mb-2 sm:mb-3">${formatarPreco(produto.preco)}</p>
                    
                    <!-- Categoria destacada -->
                    <div class="mb-2 sm:mb-3">
                        <span class="px-2 sm:px-3 py-1 bg-rosa-claro/20 text-rosa-escuro rounded-full text-xs font-medium">
                            ${produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}
                        </span>
                    </div>
                    
                    <!-- Tamanhos -->
                    <div class="mb-3 sm:mb-4">
                        <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Tamanhos disponíveis:</p>
                        <div class="flex flex-wrap gap-1 sm:gap-2">
                            ${produto.tamanhos.map(tamanho => 
                                `<span class="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">${tamanho}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <!-- Botão Adicionar ao Carrinho -->
                    <button 
                        onclick="adicionarAoCarrinho(${produto.id})"
                        class="w-full bg-gradient-to-r from-rosa-claro to-rosa-escuro hover:from-rosa-escuro hover:to-pink-500 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                    >
                        🛒 Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Função para filtrar produtos com busca inteligente
function filtrarProdutos() {
    const termoBusca = searchInput.value.toLowerCase().trim();
    const categoriaSelecionada = categoryFilter.value;
    
    let produtosFiltrados = produtos;
    
    // Se há termo de busca, aplicar filtro inteligente
    if (termoBusca.length > 0) {
        produtosFiltrados = produtos.filter(produto => {
            const nomeProduto = produto.nome.toLowerCase();
            const categoriaProduto = produto.categoria;
            
            // Busca por palavra-chave no nome
            const matchNome = nomeProduto.includes(termoBusca);
            
            // Busca por categoria relacionada
            const matchCategoria = categoriaProduto.includes(termoBusca);
            
            // Busca por palavras-chave relacionadas
            const palavrasChave = {
                'vestido': ['vestido', 'dress', 'festa', 'elegante', 'longo', 'curto', 'floral'],
                'calca': ['calça', 'calca', 'pants', 'jeans', 'skinny', 'palazzo', 'reta'],
                'blusa': ['blusa', 'blouse', 'seda', 'crop', 'top', 'elegante', 'casual'],
                'saia': ['saia', 'skirt', 'midi', 'plissada', 'longa', 'curta'],
                'conjunto': ['conjunto', 'set', 'sport', 'casual', 'elegante']
            };
            
            // Verificar se o termo de busca está nas palavras-chave da categoria
            let matchPalavrasChave = false;
            if (palavrasChave[categoriaProduto]) {
                matchPalavrasChave = palavrasChave[categoriaProduto].some(palavra => 
                    palavra.includes(termoBusca) || termoBusca.includes(palavra)
                );
            }
            
            // Busca por características especiais
            const caracteristicas = ['novo', 'trending', 'exclusivo', 'premium', 'luxo', 'elegante', 'casual', 'festa'];
            const matchCaracteristicas = caracteristicas.some(caracteristica => 
                caracteristica.includes(termoBusca) || termoBusca.includes(caracteristica)
            );
            
            return matchNome || matchCategoria || matchPalavrasChave || matchCaracteristicas;
        });
    }
    
    // Aplicar filtro de categoria se selecionado
    if (categoriaSelecionada) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.categoria === categoriaSelecionada
        );
    }
    
    // Ordenar resultados por relevância
    if (termoBusca.length > 0) {
        produtosFiltrados.sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();
            
            // Priorizar produtos que começam com o termo de busca
            const aStartsWith = nomeA.startsWith(termoBusca);
            const bStartsWith = nomeB.startsWith(termoBusca);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            // Priorizar produtos com o termo no início do nome
            const aIndex = nomeA.indexOf(termoBusca);
            const bIndex = nomeB.indexOf(termoBusca);
            
            if (aIndex !== bIndex) return aIndex - bIndex;
            
            // Ordenar por preço (mais barato primeiro)
            return a.preco - b.preco;
        });
    }
    
    renderizarProdutos(produtosFiltrados);
    
    // Mostrar contador de resultados
    mostrarContadorResultados(produtosFiltrados.length, termoBusca);
}

// Função para mostrar contador de resultados
function mostrarContadorResultados(total, termoBusca) {
    let contadorElement = document.getElementById('resultadosContador');
    
    if (!contadorElement) {
        contadorElement = document.createElement('div');
        contadorElement.id = 'resultadosContador';
        contadorElement.className = 'text-center mb-6 text-gray-600';
        document.getElementById('productsGrid').parentNode.insertBefore(contadorElement, document.getElementById('productsGrid'));
    }
    
    if (termoBusca.length > 0) {
        if (total === 0) {
            contadorElement.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum resultado encontrado</h3>
                    <p class="text-gray-500">Não encontramos produtos para "${termoBusca}"</p>
                    <p class="text-sm text-gray-400 mt-2">Tente usar termos como: vestido, calça, blusa, conjunto, etc.</p>
                </div>
            `;
        } else {
            contadorElement.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-sm">
                    <span class="text-rosa-escuro font-semibold">${total}</span>
                    <span>produto${total > 1 ? 's' : ''} encontrado${total > 1 ? 's' : ''} para</span>
                    <span class="text-rosa-escuro font-semibold">"${termoBusca}"</span>
                </div>
            `;
        }
    } else {
        contadorElement.innerHTML = `
            <div class="text-center text-sm text-gray-500">
                Mostrando todos os ${total} produtos
            </div>
        `;
    }
}

// Sistema de sugestões inteligentes
let currentSuggestions = [];
let selectedSuggestionIndex = -1;

// Função para gerar sugestões inteligentes
function gerarSugestoes(termo) {
    if (termo.length < 2) return [];
    
    const sugestoes = [];
    const termoLower = termo.toLowerCase();
    
    // Sugestões de produtos
    produtos.forEach(produto => {
        const nomeLower = produto.nome.toLowerCase();
        if (nomeLower.includes(termoLower)) {
            sugestoes.push({
                tipo: 'produto',
                texto: produto.nome,
                categoria: produto.categoria,
                preco: produto.preco,
                termo: termo
            });
        }
    });
    
    // Sugestões de categorias
    const categorias = {
        'vestido': 'Vestidos',
        'calca': 'Calças',
        'blusa': 'Blusas',
        'saia': 'Saias',
        'conjunto': 'Conjuntos'
    };
    
    Object.entries(categorias).forEach(([key, value]) => {
        if (key.includes(termoLower) || value.toLowerCase().includes(termoLower)) {
            sugestoes.push({
                tipo: 'categoria',
                texto: value,
                categoria: key,
                termo: termo
            });
        }
    });
    
    // Sugestões de características
    const caracteristicas = [
        'Elegante', 'Casual', 'Festa', 'Premium', 'Novo', 'Trending',
        'Longo', 'Curto', 'Skinny', 'Palazzo', 'Floral', 'Seda'
    ];
    
    caracteristicas.forEach(caracteristica => {
        if (caracteristica.toLowerCase().includes(termoLower)) {
            sugestoes.push({
                tipo: 'caracteristica',
                texto: caracteristica,
                termo: termo
            });
        }
    });
    
    // Ordenar por relevância
    sugestoes.sort((a, b) => {
        const aStartsWith = a.texto.toLowerCase().startsWith(termoLower);
        const bStartsWith = b.texto.toLowerCase().startsWith(termoLower);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        return a.texto.length - b.texto.length;
    });
    
    return sugestoes.slice(0, 8); // Máximo 8 sugestões
}

// Função para mostrar sugestões
function mostrarSugestoes(sugestoes) {
     const suggestionsContainer = document.getElementById('searchSuggestions');
     
     if (sugestoes.length === 0) {
         suggestionsContainer.classList.add('hidden');
         return;
     }
     
     const html = sugestoes.map((sugestao, index) => {
         const textoDestacado = sugestao.texto.replace(
             new RegExp(`(${sugestao.termo})`, 'gi'),
             '<span class="suggestion-highlight">$1</span>'
         );
         
         let categoriaTag = '';
         if (sugestao.categoria) {
             categoriaTag = `<span class="suggestion-category px-2 py-1 rounded-full text-xs ml-2">${sugestao.categoria}</span>`;
         }
         
         let precoTag = '';
         if (sugestao.preco) {
             precoTag = `<span class="text-rosa-escuro font-semibold ml-2">${formatarPreco(sugestao.preco)}</span>`;
         }
         
         // Adicionar foto da roupa para produtos
         let fotoRoupa = '';
         if (sugestao.tipo === 'produto') {
             fotoRoupa = `
                 <div class="foto-roupa w-12 h-12 bg-gradient-to-br from-rosa-claro to-rosa-escuro rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                     <span class="text-white font-bold text-xs">FOTO</span>
                 </div>
             `;
         } else if (sugestao.tipo === 'categoria') {
             fotoRoupa = `
                 <div class="foto-roupa w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-300 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                     <span class="text-white font-bold text-xs">📁</span>
                 </div>
             `;
         } else {
             fotoRoupa = `
                 <div class="foto-roupa w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                     <span class="text-white font-bold text-xs">✨</span>
                 </div>
             `;
         }
         
         return `
             <div class="suggestion-item p-3 border-b border-gray-100 last:border-b-0 ${index === selectedSuggestionIndex ? 'selected' : ''}" 
                  data-index="${index}" 
                  data-tipo="${sugestao.tipo}" 
                  data-texto="${sugestao.texto}">
                 <div class="flex items-center">
                     ${fotoRoupa}
                     <div class="flex-1">
                         <div class="flex items-center justify-between">
                             <div class="flex items-center">
                                 <span class="text-gray-800 font-medium">${textoDestacado}</span>
                                 ${categoriaTag}
                             </div>
                             ${precoTag}
                         </div>
                         ${sugestao.tipo === 'produto' ? '<p class="text-xs text-gray-500 mt-1">Clique para ver detalhes</p>' : ''}
                     </div>
                 </div>
             </div>
         `;
     }).join('');
     
     suggestionsContainer.innerHTML = html;
     suggestionsContainer.classList.remove('hidden');
     
     // Adicionar event listeners para as sugestões
     document.querySelectorAll('.suggestion-item').forEach((item, index) => {
         item.addEventListener('click', () => {
             const texto = item.getAttribute('data-texto');
             const tipo = item.getAttribute('data-tipo');
             
             searchInput.value = texto;
             suggestionsContainer.classList.add('hidden');
             
             // Executar busca
             filtrarProdutos();
             
             // Focar na barra de pesquisa
             searchInput.focus();
         });
         
         item.addEventListener('mouseenter', () => {
             selectedSuggestionIndex = index;
             document.querySelectorAll('.suggestion-item').forEach(i => i.classList.remove('selected'));
             item.classList.add('selected');
         });
     });
 }

// Função de debounce para otimizar a busca
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

// Event listeners para o sistema de sugestões
searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.trim();
    
    if (termo.length >= 2) {
        const sugestoes = gerarSugestoes(termo);
        currentSuggestions = sugestoes;
        mostrarSugestoes(sugestoes);
        selectedSuggestionIndex = -1;
    } else {
        document.getElementById('searchSuggestions').classList.add('hidden');
        currentSuggestions = [];
        selectedSuggestionIndex = -1;
    }
    
    // Executar busca com debounce
    debounce(filtrarProdutos, 300)();
});

// Navegação por teclado nas sugestões
searchInput.addEventListener('keydown', (e) => {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!suggestionsContainer.classList.contains('hidden') && currentSuggestions.length > 0) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, currentSuggestions.length - 1);
                atualizarSugestaoSelecionada();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
                atualizarSugestaoSelecionada();
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0) {
                    const sugestao = currentSuggestions[selectedSuggestionIndex];
                    searchInput.value = sugestao.texto;
                    suggestionsContainer.classList.add('hidden');
                    filtrarProdutos();
                }
                break;
            case 'Escape':
                suggestionsContainer.classList.add('hidden');
                selectedSuggestionIndex = -1;
                searchInput.blur();
                break;
        }
    }
});

// Função para atualizar a sugestão selecionada visualmente
function atualizarSugestaoSelecionada() {
    document.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.classList.toggle('selected', index === selectedSuggestionIndex);
    });
}

// Event listeners com debounce para melhor performance
categoryFilter.addEventListener('change', filtrarProdutos);

// Fechar dropdown quando clicar fora
document.addEventListener('click', (e) => {
    const searchContainer = searchInput.parentElement;
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchContainer.contains(e.target)) {
        suggestionsContainer.classList.add('hidden');
        selectedSuggestionIndex = -1;
    }
});

// Focar na barra de pesquisa ao clicar
searchInput.addEventListener('focus', () => {
    const termo = searchInput.value.trim();
    if (termo.length >= 2 && currentSuggestions.length > 0) {
        mostrarSugestoes(currentSuggestions);
    }
});

// Mostrar sugestões ao clicar na barra vazia
searchInput.addEventListener('click', () => {
    if (searchInput.value.trim().length === 0) {
        // Mostrar sugestões populares
        const sugestoesPopulares = [
            { tipo: 'categoria', texto: 'Vestidos', categoria: 'vestido', termo: '' },
            { tipo: 'categoria', texto: 'Calças', categoria: 'calca', termo: '' },
            { tipo: 'categoria', texto: 'Blusas', categoria: 'blusa', termo: '' },
            { tipo: 'caracteristica', texto: 'Elegante', termo: '' },
            { tipo: 'caracteristica', texto: 'Casual', termo: '' },
            { tipo: 'caracteristica', texto: 'Festa', termo: '' }
        ];
        currentSuggestions = sugestoesPopulares;
        mostrarSugestoes(sugestoesPopulares);
    }
});

// Funcionalidade do Menu Mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const searchInputMobile = document.getElementById('searchInputMobile');
const categoryFilterMobile = document.getElementById('categoryFilterMobile');

// Toggle do menu mobile
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fechar menu mobile ao clicar fora
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Sincronizar busca mobile com desktop
searchInputMobile.addEventListener('input', (e) => {
    document.getElementById('searchInput').value = e.target.value;
    filtrarProdutos();
});

// Sincronizar filtro mobile com desktop
categoryFilterMobile.addEventListener('change', (e) => {
    document.getElementById('categoryFilter').value = e.target.value;
    filtrarProdutos();
});

// Sincronizar busca desktop com mobile
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchInputMobile.value = e.target.value;
});

// Sincronizar filtro desktop com mobile
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    categoryFilterMobile.value = e.target.value;
});

// Função para carregar catálogo
function carregarCatalogo() {
    const catalogGrid = document.getElementById('catalogGrid');
    if (!catalogGrid) return;
    
    // Recarregar produtos do localStorage
    const produtosAtualizados = carregarProdutos();
    
    if (produtosAtualizados.length === 0) {
        catalogGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="text-gray-400 text-8xl mb-6">👗</div>
                <h3 class="text-2xl font-semibold text-gray-600 mb-4">Nenhum produto cadastrado</h3>
                <p class="text-gray-500 text-lg">Acesse o painel administrativo para adicionar produtos</p>
            </div>
        `;
        return;
    }
    
    // Aplicar filtros atuais se existirem
    filtrarCatalogo();
}

// Função para atualizar catálogo (chamada quando produtos são adicionados no dashboard)
function atualizarCatalogo() {
    if (typeof carregarCatalogo === 'function') {
        carregarCatalogo();
    }
}

// Função para filtrar catálogo
function filtrarCatalogo() {
    const searchTerm = document.getElementById('catalogSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('catalogCategory')?.value || '';
    const priceFilter = document.getElementById('catalogPrice')?.value || '';
    
    const produtosAtualizados = carregarProdutos();
    let produtosFiltrados = produtosAtualizados;
    
    // Filtro por busca
    if (searchTerm) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.nome.toLowerCase().includes(searchTerm) ||
            produto.descricao.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtro por categoria
    if (categoryFilter) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.categoria === categoryFilter
        );
    }
    
    // Filtro por preço
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(p => parseFloat(p));
        produtosFiltrados = produtosFiltrados.filter(produto => {
            if (max) {
                return produto.preco >= min && produto.preco <= max;
            } else {
                return produto.preco >= min;
            }
        });
    }
    
    // Atualizar grid
    const catalogGrid = document.getElementById('catalogGrid');
    const noResults = document.getElementById('catalogNoResults');
    
    if (produtosFiltrados.length === 0) {
        catalogGrid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        catalogGrid.innerHTML = produtosFiltrados.map(produto => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <!-- Imagem do Produto -->
                <div class="relative aspect-square overflow-hidden cursor-pointer" onclick="abrirGaleria(${produto.id})">
                    <img src="${produto.imagem !== 'FOTO AQUI' ? produto.imagem : 'https://via.placeholder.com/400x400?text=Sem+Foto'}" 
                         alt="${produto.nome}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    <!-- Indicador de múltiplas fotos -->
                    ${produto.fotos && produto.fotos.length > 1 ? `
                        <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>${produto.fotos.length}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Informações do Produto -->
                <div class="p-4 space-y-3">
                    <h3 class="text-lg font-semibold text-gray-800 line-clamp-2">${produto.nome}</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-rosa-escuro">${formatarPreco(produto.preco)}</span>
                        <span class="text-sm text-gray-500 capitalize">${produto.categoria}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <span>Tamanhos: ${produto.tamanhos.join(', ')}</span>
                        <button onclick="adicionarAoCarrinho(${produto.id})" 
                                class="px-4 py-2 bg-rosa-escuro text-white rounded-lg hover:bg-rosa-hover transition-colors text-sm font-medium">
                            🛒 Adicionar
                        </button>
                    </div>
                    ${produto.descricao ? `<p class="text-xs text-gray-500 line-clamp-2">${produto.descricao}</p>` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(produtos);
    carregarCatalogo();
    
    // Adicionar event listeners para filtros do catálogo
    const catalogSearch = document.getElementById('catalogSearch');
    const catalogCategory = document.getElementById('catalogCategory');
    const catalogPrice = document.getElementById('catalogPrice');
    
    if (catalogSearch) {
        catalogSearch.addEventListener('input', filtrarCatalogo);
    }
    if (catalogCategory) {
        catalogCategory.addEventListener('change', filtrarCatalogo);
    }
    if (catalogPrice) {
        catalogPrice.addEventListener('change', filtrarCatalogo);
    }
    
    // Carregar carrinho do localStorage
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }
    
    // Adicionar animação de fade-in aos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar todos os cards de produtos
    document.querySelectorAll('.card-hover').forEach(card => {
        observer.observe(card);
    });
    
    // Fechar modais ao clicar fora
    document.addEventListener('click', (e) => {
        const sizeModal = document.getElementById('sizeModal');
        const carrinhoModal = document.getElementById('carrinhoModal');
        const galeriaModal = document.getElementById('galeriaModal');
        
        if (e.target === sizeModal) {
            fecharModalTamanho();
        }
        
        if (e.target === carrinhoModal) {
            fecharCarrinho();
        }
        
        if (e.target === galeriaModal) {
            fecharGaleria();
        }
    });
    
    // Navegação por teclado na galeria
    document.addEventListener('keydown', (e) => {
        const galeriaModal = document.getElementById('galeriaModal');
        if (!galeriaModal.classList.contains('hidden') && galeriaAtual) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    anteriorFoto();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    proximaFoto();
                    break;
                case 'Escape':
                    e.preventDefault();
                    fecharGaleria();
                    break;
            }
        }
    });
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carrossel automático dos cards de destaque
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('carouselContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.slide-indicator');
    
    let currentSlide = 0;
    const totalSlides = 4;
    let autoPlayInterval;
    
    // Função para ir para um slide específico
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        const translateX = -slideIndex * 100;
        carouselContainer.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === slideIndex) {
                indicator.classList.add('active');
                indicator.classList.remove('bg-white/60');
                indicator.classList.add('bg-white');
            } else {
                indicator.classList.remove('active');
                indicator.classList.remove('bg-white');
                indicator.classList.add('bg-white/60');
            }
        });
    }
    
    // Função para próximo slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // Função para slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // Iniciar autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 2000); // 2 segundos
    }
    
    // Parar autoplay
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Event listeners para botões de navegação
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(index);
            startAutoPlay();
        });
    });
    
    // Pausar autoplay no hover
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Inicializar carrossel
    goToSlide(0);
    startAutoPlay();
    
    // Adicionar efeitos de entrada aos cards de destaque
    const featuredCards = document.querySelectorAll('.featured-card');
    
    featuredCards.forEach((card, index) => {
        // Delay escalonado para entrada dos cards
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.6, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

