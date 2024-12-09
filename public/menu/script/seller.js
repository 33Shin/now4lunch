const LIST_SELLER = [];
var selectedSeller = '';
var optionCount = 0;

function addSeller(seller) {
    LIST_SELLER.push(seller);

    var dropdown = document.getElementById('sellerDropdown');
    var option = document.createElement('option');
    option.value = optionCount++;
    option.innerText = seller.name;
    dropdown.appendChild(option);
}

function requestChangeSeller(selectedValue) {
    selectedSeller = LIST_SELLER[selectedValue];
    requestMenu(selectedSeller.id);
}