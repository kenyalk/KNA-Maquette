let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Liste des codes promo et leurs réductions associées
const promoCodes = {
    "KNA2024": 20, // 20% de réduction
    "BONUS10": 10  // 10% de réduction
};

let appliedPromo = null; // Promo actuellement appliquée

// Fonction pour ajouter un produit au panier
function addToCart(productName, price, button) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1; // Augmente la quantité si le produit existe déjà
    } else {
        cart.push({ name: productName, price: parseFloat(price), quantity: 1 }); // Ajoute un nouveau produit
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateMiniCart();
}

// Fonction pour supprimer un produit du panier
function removeFromCart(index) {
    cart.splice(index, 1); // Supprime l'article du panier
    localStorage.setItem('cart', JSON.stringify(cart));
    updateMiniCart();
    updateCartDisplay();
}

// Fonction pour mettre à jour l'affichage du panier (page dédiée)
function updateCartDisplay() {
    const cartDisplay = document.getElementById('cart-display');
    const totalDisplay = document.getElementById('total-display');
    const promoMessage = document.getElementById('promo-message');

    cartDisplay.innerHTML = '';

    if (cart.length === 0) {
        cartDisplay.innerHTML = '<p>Votre panier est vide.</p>';
        promoMessage.textContent = '';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)} €</span>`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Supprimer';
            removeButton.onclick = () => removeFromCart(index);
            cartItem.appendChild(removeButton);
            cartDisplay.appendChild(cartItem);
        });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountedTotal = total;

    if (appliedPromo) {
        discountedTotal = total - (total * appliedPromo / 100);
    }

    totalDisplay.textContent = `Total : ${discountedTotal.toFixed(2)} €`;
}

// Fonction pour mettre à jour l'aperçu du panier (mini onglet)
function updateMiniCart() {
    const miniCart = document.querySelector('.cart-button');
    if (miniCart) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        miniCart.textContent = `Panier (${totalItems})`;
    }
}

// Fonction pour appliquer un code promo
function applyPromo() {
    const promoInput = document.getElementById('promo-code').value.trim();
    const promoMessage = document.getElementById('promo-message');

    if (promoCodes[promoInput]) {
        appliedPromo = promoCodes[promoInput];
        promoMessage.textContent = `Code promo appliqué : ${appliedPromo}% de réduction.`;
        promoMessage.style.color = "green";
    } else {
        appliedPromo = null;
        promoMessage.textContent = "Code promo invalide.";
        promoMessage.style.color = "red";
    }

    updateCartDisplay();
}

// Charger le panier au démarrage
window.onload = () => {
    updateMiniCart();
    if (document.getElementById('cart-display')) {
        updateCartDisplay();
    }
};
