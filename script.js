document.addEventListener('DOMContentLoaded', () => {
    const livrosContainer = document.getElementById('livros-container');
    const buscaInput = document.getElementById('busca');
    const categoriasSelect = document.getElementById('categorias');
    
    const API_URL = 'https://seu-backend-hospedado.com/api/livros';
    
    let livros = [];
    let categoriasUnicas = new Set();
    
    // Carregar livros
    async function carregarLivros() {
        try {
            const response = await fetch('http://localhost:8080/api/livros');
            livros = await response.json();
            
            // Extrair categorias únicas
            livros.forEach(livro => {
                categoriasUnicas.add(livro.categoria);
            });
            
            preencherCategorias();
            exibirLivros(livros);
            
        } catch (error) {
            console.error('Erro ao carregar livros:', error);
            livrosContainer.innerHTML = `
                <div class="erro">
                    <p>Não foi possível carregar os livros. Tente novamente mais tarde.</p>
                </div>
            `;
        }
    }
    
    // Preencher dropdown de categorias
    function preencherCategorias() {
        categoriasUnicas.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            categoriasSelect.appendChild(option);
        });
    }
    
    // Exibir livros no grid
    function exibirLivros(livrosParaExibir) {
        livrosContainer.innerHTML = '';
        
        if (livrosParaExibir.length === 0) {
            livrosContainer.innerHTML = '<p class="sem-resultados">Nenhum livro encontrado.</p>';
            return;
        }
        
        livrosParaExibir.forEach(livro => {
            const livroCard = document.createElement('div');
            livroCard.className = 'livro-card';
            
            livroCard.innerHTML = `
                <div class="livro-info">
                    <span class="livro-categoria">${livro.categoria}</span>
                    <h2 class="livro-titulo">${livro.titulo}</h2>
                    <p class="livro-autor">${livro.autor}</p>
                    <p class="livro-ano">Ano: ${livro.anoPublicacao}</p>
                    <p class="livro-descricao">${livro.descricao}</p>
                </div>
            `;
            
            livrosContainer.appendChild(livroCard);
        });
    }
    
    // Filtragem de livros
    function filtrarLivros() {
        const termoBusca = buscaInput.value.toLowerCase();
        const categoriaSelecionada = categoriasSelect.value;
        
        const livrosFiltrados = livros.filter(livro => {
            const correspondeTermo = livro.titulo.toLowerCase().includes(termoBusca) ||
                                     livro.autor.toLowerCase().includes(termoBusca) ||
                                     livro.descricao.toLowerCase().includes(termoBusca);
            
            const correspondeCategoria = categoriaSelecionada === '' || 
                                        livro.categoria === categoriaSelecionada;
            
            return correspondeTermo && correspondeCategoria;
        });
        
        exibirLivros(livrosFiltrados);
    }
    
    // Event Listeners
    buscaInput.addEventListener('input', filtrarLivros);
    categoriasSelect.addEventListener('change', filtrarLivros);
    
    // Inicialização
    carregarLivros();
});