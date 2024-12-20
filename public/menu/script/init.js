async function init() {
    if (timeOut()) {
        location.href = location.protocol + '//' + location.host + '/time-out';
        return;
    }
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

function timeOut() {
    var time = new Date();
    var hour = time.getHours();
    var minute = time.getMinutes();
    if (hour >= 11 && minute > 10 && !window.location.href.includes('admin')) {
        return true;
    }
    return false;
}