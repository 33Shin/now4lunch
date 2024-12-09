var foodData = null;

async function requestMenu(seller_id) {
    showLoading();
    var res = await fetch('get_menu?seller_id=' + seller_id);
    var data = await res.json();
    foodData = data;
    showMenu(foodData);
    addCategory(foodData);
    hideLoading();
}

function showMenu(data) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    data.forEach(food => {
        for (let index = 0; index < food.dish.length; index++) {
            const item = food.dish[index];
            var image = item.list_photo[2].value;
            var name = item.name;
            var price = item.price;

            const menuItem = document.createElement('div');

            // item.available = Math.random() > 0.5;

            menuItem.className = 'menu-item';
            menuItem.style.opacity = item.available ? 1.0 : 0.6;

            var buttonText = item.available ? 'Chọn Món' : "Hết Hàng";
            var buttonState = item.available ? '' : 'disabled';

            menuItem.innerHTML = `<div class="image-container">
                <img src="${image}" alt="${name}">
                </div>
                <h3>${name}</h3>
                <p>${formatPrice(price)}</p>
                <button ${buttonState} onclick="selectDish('${food.name}', ${index})">${buttonText}</button>
            `;


            menuContainer.appendChild(menuItem);
        }
    });
}

function addCategory(data) {
    var sidebar = document.getElementsByClassName('menu_button')[0];
    sidebar.innerHTML = '';
    sidebar.innerHTML += `<button onclick="filterMenu()">Tất Cả</button>`;

    data.forEach(food => {
        sidebar.innerHTML += `<button onclick="filterMenu('${food.name}')">${food.name}</button>`
    });
}

function filterMenu(menuName) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    if (menuName == null) {
        showMenu(foodData);
    }
    else {
        var filterFood = foodData.filter(i => i.name == menuName);
        showMenu(filterFood);
    }
}