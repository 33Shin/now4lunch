function addLoading() {
    document.body.innerHTML += `
    <div id="loadingOverlay">
    <div class="spinner"></div>
  </div>
    `;
}

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}