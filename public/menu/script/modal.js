var list_topping = [];
var list_topping_option = [];
var currentCart = null;

function showAddToppingModal(list_option, cart) {
    currentCart = cart;
    list_topping = [];
    list_topping_option = list_option;
    openModal();
    showSelectedItem(cart);
    var form = document.getElementById('topping-category');
    var innerHTML = '';
    for (let index = 0; index < list_option.length; index++) {
        const option = list_option[index];

        innerHTML += `<form id="toppingForm${index}">`;
        innerHTML += `<h4>${option.name} (Tối đa: ${option.max_select})</h4>`;

        var select_type = option.max_select == 1 && option.mandatory ? 'radio' : 'checkbox';
        option.list_item.forEach((item, option_index) => {
            var is_default = item.is_default ? "checked" : "";
            var disabled = select_type == 'checkbox' && option.max_select == option.list_item.filter(i => i.is_default).length && !is_default ? 'disabled' : '';
            if (option.max_select == 0)
            {
                is_default = '';
                disabled = 'disabled';
            }
            var onChange = option.max_select == 1 && option.mandatory ? '' : `onchange="checkMaxSelect(${index}, ${option.max_select})"`;
            innerHTML +=
                `<label">
                <input ${disabled} type="${select_type}" ${is_default} name="topping" value="${option_index}" ${onChange}>${item.name} - ${formatPrice(item.price)}
                </label>
                <br>`;
        });
        innerHTML += `</form>`;
    }
    form.innerHTML = innerHTML;
}

function checkMaxSelect(category_index, max_select) {
    const form = document.getElementById("toppingForm" + category_index);
    const selectedToppings = Array.from(form.topping)
    if (selectedToppings.filter(i => i.checked).length == max_select) {
        for (let index = 0; index < selectedToppings.length; index++) {
            const input = selectedToppings[index];
            input.disabled = !input.checked;
        }
    }
    else {
        for (let index = 0; index < selectedToppings.length; index++) {
            const input = selectedToppings[index];
            input.disabled = false;
        }
    }
}

function submitTopping() {
    for (let optionIndex = 0; optionIndex < list_topping_option.length; optionIndex++) {
        const form = document.getElementById("toppingForm" + optionIndex);
        var selectedToppings = [];
        if (form.topping.length == null) {
            selectedToppings.push(form.topping);
        }
        else {
            selectedToppings = Array.from(form.topping).filter(i => i.checked);
        }
        for (let index = 0; index < selectedToppings.length; index++) {
            const option_index = selectedToppings[index].value;
            list_topping.push({
                name: list_topping_option[optionIndex].list_item[option_index].name,
                price: list_topping_option[optionIndex].list_item[option_index].price
            });
        }
    }
    currentCart.list_topping = list_topping;
    addToCart(currentCart);
    closeModal({ target: { id: "modalOverlay" } });
}

function showSelectedItem(cart) {
    var select_item = document.getElementById('selected_item');
    select_item.innerHTML =
        `
    <img src=${cart.image} width=60 height=60 style="padding:20px"></img>
    <div>
        <h4>${cart.name}<h4>
        <p style="font-weight: normal">${formatPrice(cart.price)}</p>
    </div>
    `
        ;
}

function openModal() {
    var modal = document.getElementById('modalOverlay');
    modal.style.display = 'block';
    var form = document.getElementById('topping-category');
    form.innerHTML = '';
}

function closeModal(event) {
    if (event.target.id === "modalOverlay") {
        document.getElementById("modalOverlay").style.display = "none";
    }
}

function stopPropagation(event) {
    event.stopPropagation();
}