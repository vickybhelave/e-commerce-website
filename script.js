// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Order Confirmation Popup
    const orderPopup = document.getElementById('orderPopup');
    const closePopup = document.getElementById('closePopup');
    const productModal = document.getElementById('productModal');
    let currentQuantity = 1;
    let basePrice = 0;
  
    function showPopup() {
        orderPopup.style.display = 'flex';
    }
  
    closePopup.addEventListener('click', () => {
        orderPopup.style.display = 'none';
    });
  
    // Product Modal
    window.showProductModal = function(button) {
        const card = button.closest('div[data-product-id]');
        const imgSrc = card.querySelector('img').src;
        const title = card.querySelector('h3').textContent;
        const priceText = card.querySelector('p') ? card.querySelector('p').textContent : '₹99.99'; // Fallback for missing price
  
        // Robust price parsing
        basePrice = parseFloat(priceText.replace(/[^0-9.]/g, '')); // Remove all non-numeric characters except decimal
        if (isNaN(basePrice)) {
            console.error(`Invalid price format for ${title}: ${priceText}`);
            basePrice = 99.99; // Fallback price
        }
  
        document.getElementById('modalImage').src = imgSrc;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalPrice').textContent = `Unit Price: ₹${basePrice.toFixed(2)}`; // Consistent currency
        document.getElementById('modalDescription').textContent = `Description for ${title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
        document.getElementById('quantity').textContent = currentQuantity = 1;
        document.getElementById('totalPrice').textContent = `Total: ₹${(basePrice * currentQuantity).toFixed(2)}`;
        
        productModal.style.display = 'flex';
    };
  
    window.closeModal = function() {
        productModal.style.display = 'none';
    };
  
    window.changeQuantity = function(delta) {
        currentQuantity = Math.max(1, currentQuantity + delta);
        document.getElementById('quantity').textContent = currentQuantity;
        document.getElementById('totalPrice').textContent = `Total: ₹${(basePrice * currentQuantity).toFixed(2)}`;
    };
  
    window.addToCart = function() {
        const title = document.getElementById('modalTitle').textContent;
        const quantity = parseInt(document.getElementById('quantity').textContent, 10); // Parse quantity as integer
        const total = (basePrice * quantity).toFixed(2);
        
        console.log(`Added to cart: ${title}, Unit Price: ₹${basePrice.toFixed(2)}, Quantity: ${quantity}, Total: ₹${total}`);
        closeModal();
        showPopup();
    };
  });