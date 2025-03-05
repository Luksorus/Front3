document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    document.getElementById('addForm').addEventListener('submit', addProduct);
    document.getElementById('editForm').addEventListener('submit', updateProduct);
});

// Загрузка товаров
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Ошибка сервера');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        alert('Ошибка загрузки товаров: ' + error.message);
    }
}

// Рендер таблицы
function renderProducts(products) {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.description}</td>
            <td>${product.categories.join(', ')}</td>
            <td class="actions">
                <button onclick="editProduct(${product.id})">✏️</button>
                <button class="delete" onclick="deleteProduct(${product.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Добавление товара
async function addProduct(e) {
    e.preventDefault();
    
    const product = {
        name: e.target.name.value,
        price: parseFloat(e.target.price.value),
        description: e.target.description.value,
        categories: e.target.categories.value.split(',').map(c => c.trim())
    };
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product)
        });
        
        if (!response.ok) throw new Error('Ошибка сервера');
        
        e.target.reset();
        loadProducts();
    } catch (error) {
        alert('Ошибка добавления товара: ' + error.message);
    }
}

// Редактирование товара
async function editProduct(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Ошибка сервера');
        
        const product = await response.json();
        
        const form = document.getElementById('editForm');
        form.elements.id.value = product.id;
        form.elements.name.value = product.name;
        form.elements.price.value = product.price;
        form.elements.description.value = product.description;
        form.elements.categories.value = product.categories.join(', ');
        
        document.getElementById('editSection').classList.remove('hidden');
        window.scrollTo(0, 0);
    } catch (error) {
        alert('Ошибка загрузки товара: ' + error.message);
    }
}

// Обновление товара
async function updateProduct(e) {
    e.preventDefault();
    
    const product = {
        name: e.target.name.value,
        price: parseFloat(e.target.price.value),
        description: e.target.description.value,
        categories: e.target.categories.value.split(',').map(c => c.trim())
    };
    
    try {
        const response = await fetch(`/api/products/${e.target.id.value}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product)
        });
        
        if (!response.ok) throw new Error('Ошибка сервера');
        
        cancelEdit();
        loadProducts();
    } catch (error) {
        alert('Ошибка обновления товара: ' + error.message);
    }
}

// Удаление товара
async function deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Ошибка сервера');
        
        loadProducts();
    } catch (error) {
        alert('Ошибка удаления товара: ' + error.message);
    }
}

function cancelEdit() {
    document.getElementById('editSection').classList.add('hidden');
    document.getElementById('editForm').reset();
}