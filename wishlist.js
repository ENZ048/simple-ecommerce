const API_URL = 'https://fakestoreapi.com/products';
const wishlistContainer = document.getElementById('wishlistContainer');
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

let allProducts = [];

const fetchProducts = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allProducts = data;
    renderWishlist();
  } catch (err) {
    wishlistContainer.innerHTML = `<p>Error loading wishlist</p>`;
  }
};

const renderWishlist = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const liked = user?.likedProducts || [];
  const likedProducts = allProducts.filter(product => liked.includes(product.id));

  wishlistContainer.innerHTML = '';

  if (likedProducts.length === 0) {
    wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    return;
  }

  likedProducts.forEach(product => {
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
      <h3>${product.title.slice(0, 50)}...</h3>
      <p><strong>$${product.price}</strong></p>
      <button class="view-btn">View Details</button>
      <button class="remove-btn">Remove</button>
    `;

    const viewBtn = card.querySelector('.view-btn');
    const removeBtn = card.querySelector('.remove-btn');

    viewBtn.addEventListener('click', () => openModal(product));
    removeBtn.addEventListener('click', () => removeFromWishlist(product.id));

    wishlistContainer.appendChild(card);
  });
};

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

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

const removeFromWishlist = (id) => {
  let user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) return;

  user.likedProducts = user.likedProducts.filter(pid => pid !== id);
  localStorage.setItem('loggedInUser', JSON.stringify(user));

  // Update users array
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = users.map(u =>
    u.email === user.email ? user : u
  );
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  renderWishlist();
};


const backBtn = document.querySelector('.goToHomepage');

backBtn.addEventListener('click', () => {
  window.location.href = 'https://enz048.github.io/simple-ecommerce/';
})

fetchProducts();
