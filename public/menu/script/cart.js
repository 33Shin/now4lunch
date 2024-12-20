var cart = [];

function selectDish(category, index) {
    var selected_dish = foodData.find(i => i.name == category).dish[index];
    var cartItem = 
    {
        name: selected_dish.name,
        price: selected_dish.price,
        seller: selectedSeller.name,
        image: selected_dish.list_photo[0].value
    }
    var option = selected_dish.list_option;

    if (option == null || option.length == 0) {
        addToCart(cartItem);
    }
    else {
        showAddToppingModal(option, cartItem);
    }
}

function addToCart(cartItem) {
    cart.push(cartItem);
    renderCart();
}

function removeFromCart(name) {
    var index = cart.findIndex(i => i.name == name);
    if (index != -1) {
        cart.splice(index, 1);
        renderCart();
    }
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name} - ${formatPrice(item.price)}</h4>
                ${createToppingElement(item.list_topping)}
                <div class="note-container">
                    <img src="./note.png">
                    <input type="text" placeholder="Note" oninput="updateNote(event, ${index})" value="${item.note || ''}">
                </div>
            </div>
            <button onclick="removeFromCart('${item.name}')">X</button>
        `;
        cartList.appendChild(cartItem);
    });
    if (cart.length > 0) {
        var summary = document.getElementsByClassName('cart-summary')[0];
        summary.style.display = 'block';
        var total = cart.reduce((a, b) => a + Number.parseInt(b.price), 0);
        cart.forEach(item => (item.list_topping || []).forEach(topping => total += Number.parseInt(topping.price)));
        summary.innerHTML = `<h2>Tổng tiền: ${formatPrice(total)}</h2>`
    }
    else {
        var summary = document.getElementsByClassName('cart-summary')[0];
        summary.style.display = 'none';
    }
}

function createToppingElement(list_topping) {
    if (list_topping == null || list_topping.length == 0) {
        return '';
    }
    var innerHTML = '';
    list_topping.forEach(topping => {
        innerHTML += `<p style="font-size: 14px">${topping.name} - ${formatPrice(topping.price)}</p>`
    });
    return innerHTML;
}

function updateNote(event, index) {
    cart[index].note = event.target.value;
}

async function submit() {
    var res = await fetch('get_name');
    var username = await res.text();
    while (username == '') {
        username = prompt("Tên người đặt: ");
        if (username == null) {
            return;
        }
    }
    if (cart.length == 0) {
        alert(`Đã đặt gì đâu mà chốt! Đùa hả cậu???`);
        return;
    }
    var res = await fetch('/confirm', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            username: username,
            cart: cart
        }),
    });
    var responseData = await res.json();
    if (responseData.result == 'success') {
        if (Math.random() > 0.95) {
            alert('Đặt đơn thành công!...Nếu không có bug :)');
        }
        else {
            alert('Đặt đơn thành công!');
        }
        window.location.href = '/cart';
    }
}