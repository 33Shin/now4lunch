async function init() {
    await getListSeller();
    requestDefaultMenu();
}

async function getListSeller() {
    showLoading();
    var res = await fetch('/get_seller');
    var listSeller = await res.json();
    listSeller.forEach(seller => {
        addSeller(seller);
    });
}

function requestDefaultMenu() {
    var seller_id = 0;
    selectedSeller = LIST_SELLER[seller_id];
    requestMenu(selectedSeller.id);
}