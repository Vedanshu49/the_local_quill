document.addEventListener('DOMContentLoaded', () => {
    const books = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.00, imageURL: 'images/1.jpg' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.50, imageURL: 'images/2.jpg' },
        { id: 3, title: '1984', author: 'George Orwell', price: 9.00, imageURL: 'images/3.jpg' },
        { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 8.50, imageURL: 'images/4.jpg' },
        { id: 5, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', price: 25.00, imageURL: 'images/5.jpg' },
        { id: 6, title: 'Pride and Prejudice', author: 'Jane Austen', price: 7.00, imageURL: 'images/6.jpg' },
        { id: 7, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 15.00, imageURL: 'images/7.jpg' },
        { id: 8, title: 'Moby Dick', author: 'Herman Melville', price: 13.00, imageURL: 'images/8.jpg' },
        { id: 9, title: 'War and Peace', author: 'Leo Tolstoy', price: 18.00, imageURL: 'images/9.jpg' },
        { id: 10, title: 'The Odyssey', author: 'Homer', price: 11.00, imageURL: 'images/10.jpg' }
    ];

    // Page element selectors
    const newArrivalsGrid = document.getElementById('new-arrivals-grid');
    const bestsellersCarousel = document.getElementById('bestsellers-carousel');
    const browseBooksGrid = document.getElementById('browse-books-grid');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grand-total');
    const bookDetailsContainer = document.getElementById('book-details');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- NOTIFICATION ---
    function showNotification(bookTitle) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = `${bookTitle} added to cart`;
        document.body.appendChild(notification);

        // Trigger the animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide and remove the notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500); // Match the CSS transition duration
        }, 3000);
    }

    // --- CART LOGIC ---
    function updateCartCount() {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    function addToCart(book) {
        const existingItem = cart.find(item => item.id === book.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...book, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(book.title); // Show notification
    }

    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }

    // --- UI RENDERING ---
    function createBookCard(book) {
        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <a href="book-detail.html?id=${book.id}">
                <img src="${book.imageURL}" alt="${book.title}">
                <h3>${book.title}</h3>
            </a>
            <p>by ${book.author}</p>
            <p>₹${book.price.toFixed(2)}</p>
            <button>Add to Cart</button>
        `;
        card.querySelector('button').addEventListener('click', () => addToCart(book));
        return card;
    }

    function displayCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Your cart is empty.</td></tr>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('tr');
                const total = item.price * item.quantity;
                subtotal += total;
                cartItem.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center;">
                            <img src="${item.imageURL}" alt="${item.title}" style="width: 60px; height: auto; margin-right: 15px;">
                            <span>${item.title}</span>
                        </div>
                    </td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        ${item.quantity}
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </td>
                    <td>₹${total.toFixed(2)}</td>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        grandTotalEl.textContent = `₹${(subtotal + (cart.length > 0 ? 5 : 0)).toFixed(2)}`; // Add shipping only if cart not empty
    }

    function handleQuantityChange(id, action) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            if (action === 'increase') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrease') {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        }
    }

    function displayBookDetails() {
        if (!bookDetailsContainer) return;
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = parseInt(urlParams.get('id'));
        const book = books.find(b => b.id === bookId);

        if (book) {
            bookDetailsContainer.innerHTML = `
                <div class="book-details-image">
                    <img src="${book.imageURL}" alt="${book.title}">
                </div>
                <div class="book-details-info">
                    <h1>${book.title}</h1>
                    <p>by ${book.author}</p>
                    <p class="price">₹${book.price.toFixed(2)}</p>
                    <p class="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <div class="quantity-selector">
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" value="1" min="1">
                    </div>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            `;
            bookDetailsContainer.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').value);
                const existingItem = cart.find(item => item.id === book.id);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({ ...book, quantity: quantity });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                showNotification(book.title);
            });
        }
    }

    // --- PAGE INITIALIZATION ---
    function init() {
        // Homepage
        if (newArrivalsGrid) {
            books.slice(0, 4).forEach(book => newArrivalsGrid.appendChild(createBookCard(book)));
        }
        if (bestsellersCarousel) {
            books.slice(4).forEach(book => bestsellersCarousel.appendChild(createBookCard(book)));
        }
        // Browse Page
        if (browseBooksGrid) {
            books.forEach(book => browseBooksGrid.appendChild(createBookCard(book)));
        }
        // Cart Page
        if (cartItemsContainer) {
            displayCartItems();
            cartItemsContainer.addEventListener('click', e => {
                if (e.target.classList.contains('quantity-btn')) {
                    const id = parseInt(e.target.dataset.id);
                    const action = e.target.dataset.action;
                    handleQuantityChange(id, action);
                }
            });
            const clearCartBtn = document.getElementById('clear-cart-btn');
            if (clearCartBtn) {
                clearCartBtn.addEventListener('click', clearCart);
            }
        }
        // Book Detail Page
        if (bookDetailsContainer) {
            displayBookDetails();
        }

        updateCartCount();
    }

    init();
});
