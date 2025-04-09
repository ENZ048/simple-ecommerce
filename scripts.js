const API_URL = 'https://fakestoreapi.com/products';
const loader = document.getElementById('loader');
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('search-input');

let allProducts = [];

const fetchProducts = async () => {
  try {
    loader.style.display = 'block';
    const res = await fetch(API_URL);
    const data = await res.json();
    allProducts = data;
    renderProducts(allProducts);
  } catch (err) {
    productsContainer.innerHTML = `<p>Error loading products</p>`;
  } finally {
    loader.style.display = 'none';
  }
};

const renderProducts = (products) => {
  productsContainer.innerHTML = '';

  if (products.length === 0) {
    productsContainer.innerHTML = '<p>No products found</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.style = `
      width: 250px;
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 8px;
      background: white;
      text-align: center;
    `;
  
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" style="height: 180px; width: 150px" />
      <h3 style="font-size: 1rem; margin: 0.5rem 0;">${product.title.slice(0, 50)}...</h3>
      <p style="color: green; font-weight: bold;">$${product.price}</p>
      <button class="view-btn">View Details</button>
      <button class="like-btn">❤️</button>
    `;
  
    // Attach event listeners to buttons
    const viewBtn = card.querySelector('.view-btn');
    const likeBtn = card.querySelector('.like-btn');
  
    viewBtn.addEventListener('click', () => openModal(product));
    likeBtn.addEventListener('click', () => toggleLike(product.id));
  
    productsContainer.appendChild(card);
  });
  
};


const toggleLike = (id) => {
  const liked = JSON.parse(localStorage.getItem('likedProducts')) || [];
  if (liked.includes(id)) {
    const updated = liked.filter(pid => pid !== id);
    localStorage.setItem('likedProducts', JSON.stringify(updated));
  } else {
    liked.push(id);
    localStorage.setItem('likedProducts', JSON.stringify(liked));
  }
};

//  Live search
searchInput.addEventListener('input', () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});

const applyFiltersBtn = document.getElementById('applyFiltersBtn');

applyFiltersBtn.addEventListener('click', () => {
    const checkedCategories = Array.from(
        document.querySelectorAll('.category-filters input[type="checkbox"]:checked')
    ).map(input => input.value);

    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    const filteredProducts = allProducts.filter(product => {
        const inCategory = checkedCategories.length === 0 || checkedCategories.includes(product.category);
        const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
        return inCategory && inPriceRange;
    });

    renderProducts(filteredProducts);
});


const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

// Open modal with product details
const openModal = (product) => {
  modalContent.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" alt="${product.title}" style="max-width: 150px;" />
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p>${product.description}</p>
  `;
  modal.classList.remove('hidden');
};

// Close modal
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Close when clicking outside modal
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

const logOutBtn = document.querySelector('.logout-btn');

logOutBtn.addEventListener('click', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === loggedInUser.email);
        if (userIndex !== -1) {
            users[userIndex] = loggedInUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    localStorage.removeItem('loggedInUser');
    window.location.href = 'https://enz048.github.io/Expense-Tracker/login.html';
});


// Initial load
fetchProducts();
