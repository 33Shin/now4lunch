let notificationId = 0;

function notifyCart(data) {
    var username = data.message.username;
    var list_cart = data.message.cart;
    list_cart.forEach(cart => {
        showNotification(username, cart);
    });
}

function showNotification(username, cart) {

    const container = document.getElementById('notifications-container');

    // Create a new notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.id = `notification-${notificationId++}`;
    notification.innerHTML = `
            <div class="cart-item">
                <img src="${cart.image}" alt="${cart.name}" width=60 height=60 style="padding-right: 10px">
                <div>
                    <h4>${username.toUpperCase()} vừa đặt: </h4>
                    <h4 style="font-weight: normal">${cart.name} - ${formatPrice(cart.price)}</h4>
                </div>
            </div>
    `;

    // Append to the container
    container.appendChild(notification);

    // Show the notification with animation
    requestAnimationFrame(() => notification.classList.add('show'));

    // Auto-hide after 5 seconds
    setTimeout(() => removeNotification(notification.id), 3000);
}

function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.remove('show'); // Start hide animation
        notification.classList.add('hide');   // Add hide class for animation

        // Remove after the animation finishes
        setTimeout(() => notification.remove(), 500);
    }
}