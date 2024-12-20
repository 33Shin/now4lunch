async function requestCart() {
    var res = await fetch('get_cart');
    var response = await res.json();
    showCart(response);
}

function showCart(data) {
    console.log(data);
    data.forEach(cart => {
        viewCart(cart);
    });
}

function viewCart(cart_data) {
    var table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    var user = cart_data.username;
    var list_food = cart_data.cart;
    var newRow = table.insertRow();

    var nameCell = newRow.insertCell(0);
    nameCell.textContent = user;
    nameCell.rowSpan = list_food.length;

    var foodCell = newRow.insertCell(1);
    foodCell.innerHTML = `<p>${list_food[0].name} - ${formatPrice(list_food[0].price)}</p>`;
    list_food[0].topping = list_food[0].topping || []
    for (let index = 0; index < list_food[0].topping.length; index++) {
        const topping = list_food[0].topping[index];
        foodCell.innerHTML += `<p style="font-weight: normal; font-size: 14px">${topping.name} - ${formatPrice(topping.price)}</p>`
        list_food[0].price = Number.parseInt(list_food[0].price) + Number.parseInt(topping.price);
    }

    var priceCell = newRow.insertCell(2);
    priceCell.textContent = formatPrice(list_food[0].price);

    var sellerCell = newRow.insertCell(3);
    sellerCell.textContent = list_food[0].seller;

    var noteCell = newRow.insertCell(4);
    noteCell.textContent = list_food[0].note || '';

    var deleteCell = newRow.insertCell(5);
    if (list_food[0].owned && !timeOut()) {
        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'x';
        deleteButton.onclick = () => removeItem(user, 0, list_food[0].auth);
        deleteCell.appendChild(deleteButton);
    }

    for (let index = 1; index < list_food.length; index++) {
        const food = list_food[index];
        newRow = table.insertRow();
        var foodCell = newRow.insertCell(0);
        foodCell.innerHTML = `<p>${food.name} - ${formatPrice(food.price)}</p>`;
        food.topping = food.topping || []
        for (let index = 0; index < food.topping.length; index++) {
            const topping = food.topping[index];
            foodCell.innerHTML += `<p style="font-weight: normal">${topping.name} - ${formatPrice(topping.price)}</p>`;
            food.price = Number.parseInt(food.price) + Number.parseInt(topping.price);
        }

        var sellerCell = newRow.insertCell(1);
        sellerCell.textContent = formatPrice(food.price);

        var sellerCell = newRow.insertCell(2);
        sellerCell.textContent = food.seller;

        var noteCell = newRow.insertCell(3);
        noteCell.textContent = food.note || '';

        var deleteCell = newRow.insertCell(4);
        if (list_food[0].owned) {
            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';
            deleteButton.onclick = () => removeItem(user, index, food.auth);
            deleteCell.appendChild(deleteButton);
        }
    }
}

async function removeItem(user, index, auth) {
    if (confirm("Chắc chưa?") == false) {
        return;
    }
    var res = await fetch('/remove', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            username: user,
            index: index,
            auth: auth
        }),
    });
    var response = await res.json();
    if (response.result == 'success') {
        refreshCart();
    }
    else {
        alert('Bạn không thể xóa món "dùm" người khác!!!');
    }
}

function refreshCart() {
    var table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    requestCart();
}

function timeOut() {
    var time = new Date();
    var hour = time.getHours();
    var minute = time.getMinutes();
    if (hour >= 11 && minute > 10) {
        return true;
    }
    return false;
}