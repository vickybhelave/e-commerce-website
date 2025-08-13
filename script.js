// script.js
(function () {
    document.addEventListener('DOMContentLoaded', () => {
      // DOM Elements
      const orderPopup = document.getElementById('orderPopup');
      const closePopup = document.getElementById('closePopup');
      const productModal = document.getElementById('productModal');
  
      // Error Handling for Missing Elements
      if (!orderPopup || !closePopup || !productModal) {
        console.error('Required DOM elements are missing:', {
          orderPopup: !!orderPopup,
          closePopup: !!closePopup,
          productModal: !!productModal
        });
        return;
      }
  
      let currentQuantity = 1;
      let basePrice = 0;
  
      // Show Order Confirmation Popup
      function showPopup() {
        console.log('Showing popup: Your Order is Confirmed');
        orderPopup.style.display = 'flex'; // Fallback to ensure visibility
        orderPopup.classList.add('active');
        orderPopup.focus(); // Accessibility: Focus on popup
      }
  
      // Close Order Confirmation Popup
      closePopup.addEventListener('click', () => {
        console.log('Closing popup');
        orderPopup.classList.remove('active');
        orderPopup.style.display = 'none';
      });
  
      // Show Product Modal
      window.showProductModal = function (button) {
        try {
          console.log('Buy Now clicked, attempting to show product modal');
          const card = button.closest('.dish-card');
          if (!card) {
            throw new Error('Product card not found for button');
          }
  
          const imgSrc = card.querySelector('img')?.src;
          const title = card.querySelector('h3')?.textContent;
          const priceText = card.querySelector('.price')?.textContent || '₹99.99';
          const description = card.dataset.description || `Description for ${title || 'unknown product'}.`;
  
          if (!imgSrc || !title) {
            throw new Error('Missing product details: imgSrc or title');
          }
  
          basePrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          if (isNaN(basePrice)) {
            console.warn(`Invalid price format for ${title}: ${priceText}, defaulting to 99.99`);
            basePrice = 99.99;
          }
  
          document.getElementById('modalImage').src = imgSrc;
          document.getElementById('modalTitle').textContent = title;
          document.getElementById('modalPrice').textContent = `Unit Price: ₹${basePrice.toFixed(2)}`;
          document.getElementById('modalDescription').textContent = description;
          document.getElementById('quantity').textContent = currentQuantity = 1;
          document.getElementById('totalPrice').textContent = `Total: ₹${(basePrice * currentQuantity).toFixed(2)}`;
  
          console.log('Product modal opened for:', title);
          productModal.style.display = 'flex';
          document.getElementById('modalImage').focus(); // Accessibility: Focus on modal image
        } catch (error) {
          console.error('Error in showProductModal:', error.message);
        }
      };
  
      // Close Product Modal
      window.closeModal = function () {
        console.log('Closing product modal');
        productModal.style.display = 'none';
      };
  
      // Change Quantity
      window.changeQuantity = function (delta) {
        currentQuantity = Math.max(1, currentQuantity + delta);
        document.getElementById('quantity').textContent = currentQuantity;
        document.getElementById('totalPrice').textContent = `Total: ₹${(basePrice * currentQuantity).toFixed(2)}`;
        console.log('Quantity updated:', currentQuantity);
      };
  
      // Add to Cart
      window.addToCart = function () {
        try {
          const title = document.getElementById('modalTitle').textContent;
          const quantity = parseInt(document.getElementById('quantity').textContent, 10);
          const total = (basePrice * quantity).toFixed(2);
  
          if (!title || isNaN(quantity)) {
            throw new Error('Invalid cart data: title or quantity missing');
          }
  
          const cartItem = { title, quantity, unitPrice: basePrice, total };
          let cart = JSON.parse(localStorage.getItem('cart') || '[]');
          cart.push(cartItem);
          localStorage.setItem('cart', JSON.stringify(cart));
  
          console.log(`Added to cart: ${title}, Unit Price: ₹${basePrice.toFixed(2)}, Quantity: ${quantity}, Total: ₹${total}`);
          closeModal();
          showPopup();
        } catch (error) {
          console.error('Error in addToCart:', error.message);
        }
      };
  
      // Keyboard Accessibility: Close modal or popup with Esc key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (productModal.style.display === 'flex') {
            console.log('Closing modal via Esc key');
            closeModal();
          } else if (orderPopup.classList.contains('active') || orderPopup.style.display === 'flex') {
            console.log('Closing popup via Esc key');
            orderPopup.classList.remove('active');
            orderPopup.style.display = 'none';
          }
        }
      });
  
      // Keyboard Accessibility: Trap focus in modal
      productModal.addEventListener('keydown', (e) => {
        const focusableElements = productModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
  
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
  
      // Keyboard Accessibility: Trap focus in popup
      orderPopup.addEventListener('keydown', (e) => {
        const focusableElements = orderPopup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
  
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault;
            firstElement.focus();
          }
        }
      });
  
      // Debug: Log all Buy Now buttons to ensure they are registered
      document.querySelectorAll('.product-info button').forEach((button, index) => {
        console.log(`Buy Now button ${index + 1} registered with onclick:`, button.onclick);
        button.addEventListener('click', () => showProductModal(button)); // Ensure event binding
      });
    });
  })();