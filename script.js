const PRODUCTS = [
    { id: 1, title: 'Pavos de Fornite', price: 27, image: 'imagenes/PavosdeFornite.jpg' },
    { id: 2, title: 'Laptop Gamer', price: 750, image: 'imagenes/LaptopGamer.webp' },
    { id: 3, title: 'Iphone 13', price: 555, image: 'imagenes/iphone_13.webp' },
    { id: 4, title: 'Teclado Mecánico', price: 45, image: 'imagenes/TecladoMecánico.webp' },
    { id: 5, title: 'Monitor 4K', price: 699, image: 'imagenes/Monitor4K.jpg' },
    { id: 6, title: 'Mouse Gaming', price: 32, image: 'imagenes/MouseGaming.jpg' }
];

let cart = {
    items: [],
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.updateCart();
    },
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
    },
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity > 0 ? newQuantity : 1;
        }
        this.updateCart();
    },
    clearCart() {
        this.items = [];
        this.updateCart();
    },
    updateCart() {
        renderCartItems();
        updateCartCount();
        saveCartToLocalStorage();
    }
};

function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return; 
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    cart.items.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    const total = calculateTotal(cart.items);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.items.reduce((count, item) => count + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function findProductById(id, products = PRODUCTS) {
    if (products.length === 0) return null;
    if (products[0].id === id) return products[0];
    return findProductById(id, products.slice(1));
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart.items));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart.items = JSON.parse(savedCart);
        cart.updateCart();
    }
}
function setupNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function showSectionFromHash() {
        const hash = window.location.hash || '#inicio';
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (`#${section.id}` === hash) {
                section.classList.add('active');

                if (section.id === 'productos') {
                    renderProducts(PRODUCTS);
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    } 
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            window.location.hash = target;
            showSectionFromHash();
        });
    });
    
    window.addEventListener('hashchange', showSectionFromHash);
    showSectionFromHash();
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!contactForm || !modal) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        console.log('Datos del formulario:', data);
        
        document.getElementById('modalTitle').textContent = '¡Gracias por tu mensaje!';
        document.getElementById('modalMessage').textContent = 'Hemos recibido tu comentario y nos pondremos en contacto contigo pronto.';
        modal.classList.add('active');
        
        contactForm.reset();
    });
    
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function setupCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    if (!cartIcon || !cartSidebar) return;
    
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = findProductById(productId);
            if (product) {
                cart.addItem(product);
            }
        }
        
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.items.find(item => item.id === productId);
            
            if (e.target.classList.contains('plus')) {
                cart.updateQuantity(productId, item.quantity + 1);
            } else if (e.target.classList.contains('minus')) {
                cart.updateQuantity(productId, item.quantity - 1);
            }
        }
        
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            cart.removeItem(productId);
        }
    });
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            const modal = document.getElementById('confirmationModal');
            document.getElementById('modalTitle').textContent = '¡Compra realizada con éxito!';
            document.getElementById('modalMessage').textContent = `Total: $${calculateTotal(cart.items).toFixed(2)}\nGracias por tu compra.`;
            modal.classList.add('active');
            
            cart.clearCart();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
 
    setupNavigation();
    
  
    setupContactForm();

    setupCart();
    
    loadCartFromLocalStorage();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            const overlay = document.querySelector('.overlay');
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    });
});