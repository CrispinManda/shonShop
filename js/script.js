
class FakeStoreEcommerce {
    constructor() {
      this.products = [];
      this.cart = new Cart();
      this.selectedCategory = 'all';

      
      this.fetchAndDisplayProducts = this.fetchAndDisplayProducts.bind(this);
      this.addToCart = this.addToCart.bind(this);
      this.updateCategory = this.updateCategory.bind(this);
      this.searchProducts = this.searchProducts.bind(this);
    }

    async fetchProducts() {
      const apiUrl = this.selectedCategory === 'all'
        ? 'https://fakestoreapi.com/products'
        : `https://fakestoreapi.com/products/category/${this.selectedCategory}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        this.products = data;
        this.displayProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    searchProducts() {
      const searchInput = document.getElementById('searchInput').value.toLowerCase();

      
      const filteredProducts = this.products.filter(product => {
        const title = product.title.toLowerCase();
        return title.includes(searchInput);
      });

      
      this.displayFilteredProducts(filteredProducts);
    }

    displayProducts() {
      const productContainer = document.getElementById('product-list');
      productContainer.innerHTML = '';

      this.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-3', 'product');
        productCard.innerHTML = `
          <div class="card d-flex flex-fill mx-2  "">
            <img src="${product.image}" class="card-img-top product-image" alt="${product.title}"  style="width: 100%; height: auto; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title text-center">${product.title}</h5>
              <p class="card-text">$${product.price.toFixed(2)}</p>
              <button class="btn btn bg-primary text-center" data-product-id="${product.id}">Add to Cart</button>
          </div>
        `;

        const addToCartButton = productCard.querySelector('button');
        addToCartButton.addEventListener('click', () => {
          if (this.isProductInCart(product.id)) {
            
            console.log('Product is already in the cart');
          } else {
            this.addToCart(product.id);
            addToCartButton.textContent = 'Added';
          }
        });
    
        productContainer.appendChild(productCard);
      });
    }

    isProductInCart(productId) {
      return this.cart.items.some(item => item.product.id === productId);
    }

    displayFilteredProducts(filteredProducts) {
      const productContainer = document.getElementById('product-list');
      productContainer.innerHTML = '';

      filteredProducts.forEach(product => {
        
      });
    }

    updateCategory(event) {
      const selectedCategory = event.target.dataset.category;
      this.selectedCategory = selectedCategory;
      const categoryDropdown = document.getElementById('categoryDropdown');
      categoryDropdown.textContent = selectedCategory === 'all' ? 'All Categories' : selectedCategory;
      this.fetchAndDisplayProducts();
    }

    addToCart(productId) {
      const selectedProduct = this.products.find(product => product.id === productId);
      if (selectedProduct) {
        this.cart.addProduct(selectedProduct);
      }
    }

    init() {
      this.fetchAndDisplayProducts();
      this.cart.initCart();
      const categoryDropdownItems = document.querySelectorAll('.dropdown-item');
      categoryDropdownItems.forEach(item => {
        item.addEventListener('click', this.updateCategory);
      });
    }

    fetchAndDisplayProducts() {
      this.fetchProducts();
    }
  }

  class Cart {
    constructor() {
      this.items = [];
    }

    addProduct(product) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ product, quantity: 1 });
      }
      this.saveCartToLocalStorage(); 
      this.updateCartSummary();
    }

    removeProduct(productId) {
      const index = this.items.findIndex(item => item.product.id === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveCartToLocalStorage(); 
        this.updateCartSummary();
      }
    }

    clearCart() {
      this.items = [];
      this.saveCartToLocalStorage(); 
      this.updateCartSummary();
    }

    getGrandTotal() {
      return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    updateCartSummary() {
      const cartSummary = document.getElementById('cart-summary');
      cartSummary.innerHTML = `
        <h4>Cart Summary</h4>
        <ul class="list-group">
          ${this.items.map(item => `
            <li class="list-group-item">
              ${item.product.title} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}
              <button class="btn btn-danger btn-sm float-right" data-product-id="${item.product.id}">Remove</button>
            </li>
          `).join('')}
          <li class="list-group-item active">Total: $${this.getGrandTotal().toFixed(2)}</li>
        </ul>
        <button class="btn btn-danger mt-2" id="clear-cart">Clear Cart</button>
      `;

      const removeButtons = cartSummary.querySelectorAll('button[data-product-id]');
      removeButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.removeProduct(parseInt(button.dataset.productId, 10));
        });
      });

      const clearCartButton = document.getElementById('clear-cart');
      clearCartButton.addEventListener('click', () => {
        this.clearCart();
      });
    }

    initCart() {
      this.loadCartFromLocalStorage(); 
      this.updateCartSummary();
    }

    // Local storage methods
    saveCartToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCartFromLocalStorage() {
      const cartData = JSON.parse(localStorage.getItem('cart'));
      this.items = cartData || [];
    }
  }

  
  const fakeStoreEcommerce = new FakeStoreEcommerce();
  fakeStoreEcommerce.init();