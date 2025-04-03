document.addEventListener("DOMContentLoaded", function () {
    // Elementos DOM
    const modal = document.getElementById("modalDetalhes");
    const modalNome = document.getElementById("modalNome");
    const modalPreco = document.getElementById("modalPreco");
    const modalImagem = document.getElementById("modalImagem");
    const modalDescricao = document.getElementById("modalDescricao");
    const tamanhoSelect = document.getElementById("tamanho");
    const saborCascaSelect = document.getElementById("saborCasca");
    const saborExtraSelect = document.getElementById("saborExtra");
    const tamanhoGroup = document.getElementById("tamanhoGroup");
    const saborCascaGroup = document.getElementById("saborCascaGroup");
    const saborExtraGroup = document.getElementById("saborExtraGroup");
    const btnsDetalhes = document.querySelectorAll(".btn-detalhes");
    const closeModal = document.querySelector(".close");
    const adicionarCarrinhoBtn = document.getElementById("adicionarCarrinho");
    const carrinhoContainer = document.getElementById("carrinho-container");
    const carrinhoLista = document.getElementById("carrinho-lista");
    const totalCarrinho = document.getElementById("total-carrinho");
    const finalizarPedidoBtn = document.getElementById("finalizarPedido");
    const notification = document.getElementById("notification");
    const toggleCarrinhoBtn = document.getElementById("toggle-carrinho");
    const carrinhoCount = document.getElementById("carrinho-count");
    
    // Carregar carrinho do localStorage
    let carrinho = loadCarrinho();
    
    // Inicializar a interface
    atualizarCarrinho();
    updateCarrinhoCount();
    
    // Configurar navegação suave para as seções
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Event Listeners
    btnsDetalhes.forEach(btn => {
        btn.addEventListener("click", function () {
            showModal(this);
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    tamanhoSelect.addEventListener("change", atualizarPreco);
    saborCascaSelect.addEventListener("change", atualizarPreco);

    adicionarCarrinhoBtn.addEventListener("click", function () {
        adicionarAoCarrinho();
    });

    toggleCarrinhoBtn.addEventListener("click", function() {
        carrinhoContainer.classList.toggle("collapsed");
        const icon = this.querySelector("i");
        if (carrinhoContainer.classList.contains("collapsed")) {
            icon.className = "fas fa-chevron-down";
        } else {
            icon.className = "fas fa-chevron-up";
        }
    });

    finalizarPedidoBtn.addEventListener("click", function () {
        finalizarPedido();
    });

    // Funções
    function showModal(btn) {
        const nomeProduto = btn.getAttribute("data-nome");
        const categoria = btn.getAttribute("data-categoria");
        const descricaoPadrao = btn.getAttribute("data-descricao") || "";
        
        // Reset do modal
        modalNome.textContent = nomeProduto;
        modalImagem.src = btn.getAttribute("data-imagem");
        document.getElementById("infoOvinhos").style.display = "none";
        
        // Configurar opções do modal com base na categoria
        if (categoria === "degustacao") {
            setupDegustacaoModal();
        } else if (categoria === "barra" || categoria === "coelhinho") {
            setupBarraCoelhinhoModal(categoria, btn.getAttribute("data-preco"));
        } else if (categoria === "tradicionais" || categoria === "especiais") {
            setupOvosModal(categoria, btn.getAttribute("data-preco"));
        }
        
        modal.style.display = "block";
        modal.classList.add("fadeIn");
    }

    function setupDegustacaoModal() {
        // Configurar para kit de degustação
        modalPreco.textContent = "R$30,00";
        modalDescricao.textContent = "Kit com 4 sabores diferentes de ovinhos pequenos para degustação (50g cada)";
        document.getElementById("infoOvinhos").style.display = "block";
        
        // Esconder opções que não se aplicam
        tamanhoGroup.style.display = "none";
        saborCascaGroup.style.display = "none";
        saborExtraGroup.style.display = "none";
        
        produtoAtual = {
            nome: "Ovinhos para Degustação",
            preco: 30,
            opcoes: {
                tamanho: "Kit Degustação (4x50g)",
                saborCasca: "Variados",
                saborExtra: "Variados"
            },
            imagem: "img/mini.jpg"
        };
    }

    function setupBarraCoelhinhoModal(categoria, preco) {
        const precoNum = parseFloat(preco);
        // Configurar para barra ou coelhinho
        if (categoria === "barra") {
            modalPreco.textContent = `R$${precoNum.toFixed(2)}`;
            modalDescricao.textContent = "Barra de chocolate ao leite. Embalagem personalizada com a mensagem 'Feliz Páscoa'";
            produtoAtual = {
                nome: "Barra de Chocolate Feliz Páscoa",
                preco: precoNum,
                opcoes: {
                    tamanho: "Barra (100g)",
                    saborCasca: "Ao Leite",
                    saborExtra: "N/A"
                },
                imagem: "img/barra.jpg"
            };
        } else {
            modalPreco.textContent = `R$${precoNum.toFixed(2)}`;
            modalDescricao.textContent = "Coelhinhos de chocolate ao leite. Embalagem com 2 unidades.";
            produtoAtual = {
                nome: "Coelhinhos de Chocolate",
                preco: precoNum,
                opcoes: {
                    tamanho: "Kit (2 unidades)",
                    saborCasca: "Ao Leite",
                    saborExtra: "N/A"
                },
                imagem: "img/coelhinho.jpg"
            };
        }
        
        // Esconder opções que não se aplicam
        tamanhoGroup.style.display = "none";
        saborCascaGroup.style.display = "none";
        saborExtraGroup.style.display = "none";
    }

    function setupOvosModal(categoria, precoBase) {
        // Reset e mostrar todas as opções
        tamanhoGroup.style.display = "block";
        saborCascaGroup.style.display = "block";
        saborExtraGroup.style.display = "block";
        
        // Limpar select de sabor extra
        saborExtraSelect.innerHTML = "";
        
        // Configurar opções de sabor extras baseadas na categoria
        if (categoria === "tradicionais") {
            modalDescricao.textContent = "Ovo de Páscoa tradicional com casca de chocolate e recheio cremoso.";
            
            // Opções de sabor para tradicionais
            const sabores = [
                "Brigadeiro", 
                "Chocolate Branco", 
                "Bem-Casado", 
                "Prestígio",
                "Kit Kat"
            ];
            
            sabores.forEach(sabor => {
                const option = document.createElement("option");
                option.value = sabor;
                option.textContent = sabor;
                saborExtraSelect.appendChild(option);
            });
            
        } else if (categoria === "especiais") {
            modalDescricao.textContent = "Ovo de Páscoa especial com casca de chocolate e recheio premium.";
            
            // Opções de sabor para especiais
            const sabores = [
                "Oreo", 
                "Paçoca", 
                "Ninho com Nutella", 
                "Brigadeiro com Morango",
                "Ninho com Morango",
                "Ferrero Rocher"
            ];
            
            sabores.forEach(sabor => {
                const option = document.createElement("option");
                option.value = sabor;
                option.textContent = sabor;
                saborExtraSelect.appendChild(option);
            });
        }
        
        // Configurar select de tamanho
        tamanhoSelect.innerHTML = "";
        const tamanhos = [
            {value: "150g", text: "150g - R$ 27,00", preco: 27},
            {value: "250g", text: "250g - R$ 37,00", preco: 37},
            {value: "350g", text: "350g - R$ 47,00", preco: 47}
        ];
        
        tamanhos.forEach(t => {
            const option = document.createElement("option");
            option.value = t.value;
            option.textContent = t.text;
            option.dataset.preco = t.preco;
            tamanhoSelect.appendChild(option);
        });
        
        // Atualizar preço inicial
        atualizarPreco();
    }
    
    let produtoAtual = {
        nome: "",
        preco: 0,
        opcoes: {
            tamanho: "",
            saborCasca: "",
            saborExtra: ""
        },
        imagem: ""
    };
    
    function atualizarPreco() {
        // Verificar se o select está visível
        if (tamanhoGroup.style.display === "none") return;
        
        let precoBase = parseFloat(tamanhoSelect.options[tamanhoSelect.selectedIndex].dataset.preco);
        const saborCasca = saborCascaSelect.value;
        
        // Adicionar valor extra para casca de brownie
        if (saborCasca === "Brownie") {
            precoBase += 6;
        }
        
        modalPreco.textContent = `R$ ${precoBase.toFixed(2)}`;
        
        // Atualizar objeto de produto atual
        produtoAtual = {
            nome: modalNome.textContent,
            preco: precoBase,
            opcoes: {
                tamanho: tamanhoSelect.value,
                saborCasca: saborCascaSelect.value,
                saborExtra: saborExtraSelect.value
            },
            imagem: modalImagem.src
        };
    }
    
    function adicionarAoCarrinho() {
        // Atualizar opções do produto antes de adicionar
        if (tamanhoGroup.style.display !== "none") {
            produtoAtual.opcoes.tamanho = tamanhoSelect.value;
            produtoAtual.opcoes.saborCasca = saborCascaSelect.value;
            produtoAtual.opcoes.saborExtra = saborExtraSelect.value;
        }
        
        // Definir ID único para o produto baseado nas opções
        const produtoID = `${produtoAtual.nome}-${produtoAtual.opcoes.tamanho}-${produtoAtual.opcoes.saborCasca}-${produtoAtual.opcoes.saborExtra}`;
        
        // Verificar se já existe no carrinho
        const existeIndex = carrinho.findIndex(item => item.id === produtoID);
        
        if (existeIndex !== -1) {
            // Incrementar quantidade
            carrinho[existeIndex].quantidade += 1;
        } else {
            // Adicionar novo item
            carrinho.push({
                id: produtoID,
                nome: produtoAtual.nome,
                preco: produtoAtual.preco,
                opcoes: { ...produtoAtual.opcoes },
                quantidade: 1,
                imagem: produtoAtual.imagem
            });
        }
        
        // Salvar carrinho e atualizar interface
        saveCarrinho();
        atualizarCarrinho();
        updateCarrinhoCount();
        
        // Mostrar notificação
        showNotification("Produto adicionado ao carrinho!");
        
        // Fechar modal
        modal.style.display = "none";
    }
    
    function removerDoCarrinho(produtoID) {
        carrinho = carrinho.filter(item => item.id !== produtoID);
        saveCarrinho();
        atualizarCarrinho();
        updateCarrinhoCount();
        carrinhoContainer.classList.add("shake-animation");
        setTimeout(() => {
            carrinhoContainer.classList.remove("shake-animation");
        }, 500);
    }
    
    function atualizarCarrinho() {
        // Limpar lista
        carrinhoLista.innerHTML = "";
        
        // Adicionar itens
        let total = 0;
        
        carrinho.forEach(item => {
            const itemTotal = item.preco * item.quantidade;
            total += itemTotal;
            
            const li = document.createElement("li");
            
            li.innerHTML = `
                <div class="item-details">
                    <div class="item-title">${item.nome} (${item.quantidade}x)</div>
                    <div class="item-options">
                        ${item.opcoes.tamanho} | ${item.opcoes.saborCasca}
                        ${item.opcoes.saborExtra !== "N/A" ? ` | ${item.opcoes.saborExtra}` : ""}
                    </div>
                </div>
                <span class="item-price">R$ ${(itemTotal).toFixed(2)}</span>
                <button class="btn-remover" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            
            carrinhoLista.appendChild(li);
        });
        
        // Atualizar total
        totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
        
        // Adicionar event listeners para botões de remover
        document.querySelectorAll(".btn-remover").forEach(btn => {
            btn.addEventListener("click", function() {
                const produtoID = this.getAttribute("data-id");
                removerDoCarrinho(produtoID);
            });
        });
        
        // Mostrar mensagem se o carrinho estiver vazio
        if (carrinho.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Seu carrinho está vazio";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.fontStyle = "italic";
            emptyMessage.style.color = "#888";
            carrinhoLista.appendChild(emptyMessage);
        }
    }
    
    function updateCarrinhoCount() {
        const count = carrinho.reduce((total, item) => total + item.quantidade, 0);
        carrinhoCount.textContent = `(${count})`;
    }
    
    function finalizarPedido() {
        if (carrinho.length === 0) {
            showNotification("Adicione itens ao carrinho para finalizar o pedido", "error");
            return;
        }
        
        // Construir mensagem do pedido
        let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
        
        carrinho.forEach(item => {
            mensagem += `*${item.nome}* (${item.quantidade}x)\n`;
            mensagem += `- ${item.opcoes.tamanho} | ${item.opcoes.saborCasca}`;
            if (item.opcoes.saborExtra !== "N/A") {
                mensagem += ` | ${item.opcoes.saborExtra}`;
            }
            mensagem += `\n- R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
        });
        
        const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        mensagem += `*Total: R$ ${total.toFixed(2)}*\n\n`;
        mensagem += "Poderia me informar os detalhes para entrega e pagamento?";
        
        // Encode para URL
        const mensagemEncoded = encodeURIComponent(mensagem);
        const whatsappURL = `https://wa.me/5581983487852?text=${mensagemEncoded}`;
        
        // Abrir WhatsApp
        window.open(whatsappURL, "_blank");
    }
    
    function showNotification(message, type = "success") {
        notification.textContent = message;
        notification.className = "notification";
        
        if (type === "error") {
            notification.style.backgroundColor = "#ff4747";
        } else {
            notification.style.backgroundColor = "#4CAF50";
        }
        
        notification.classList.add("show");
        
        // Esconder após 3 segundos
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
    
    function saveCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
    
    function loadCarrinho() {
        const carrinhoSalvo = localStorage.getItem("carrinho");
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }
});