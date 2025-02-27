var btnPrev = document.getElementById('btn-prev');
var btnNext = document.getElementById('btn-next');
var labelDate = document.getElementById('label-date');

var date = new Date();
labelDate.innerText = getDate();
btnNext.disabled = true;
var pageIndex = 0;

function getDate() {
    return date.toISOString().split('T')[0];
}

function prevDate() {
    date.setDate(date.getDate() - 1);
    request().then(data => {
        pageIndex--;
        btnPrev.disabled = false;
        btnNext.disabled = pageIndex == 0;
        labelDate.innerText = getDate();
    });
}

function nextDate() {
    date.setDate(date.getDate() + 1);
    request().then(data => {
        pageIndex++;
        btnPrev.disabled = false;
        btnNext.disabled = pageIndex == 0;
        labelDate.innerText = getDate();
    });
}

async function request() {
    btnPrev.disabled = true;
    btnNext.disabled = true;
    var response = await fetch('/get_payment?date=' + getDate());
    var data = await response.json();
    onData(data);
}

async function confirmPaid() {
    var response = await fetch('/confirm_paid?date=' + getDate());
    var data = await response.json();
    onData(data);
}