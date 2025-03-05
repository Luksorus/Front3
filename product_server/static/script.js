document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

function renderProducts(products) {
    const categories = {};
    
    // Группируем товары по категориям
    products.forEach(product => {
        product.categories.forEach(category => {
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(product);
        });
    });
    
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    // Рендерим товары по категориям
    for (const [category, products] of Object.entries(categories)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h2>${category}</h2>`;
        container.appendChild(categoryDiv);
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <small>Артикул: ${product.id}</small>
            `;
            container.appendChild(card);
        });
    }
}