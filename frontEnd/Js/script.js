// Scan Page

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const scanBtn = document.getElementById("scanBtn");
const loading = document.getElementById("loading");

if (imageInput) {
    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {
            preview.src = URL.createObjectURL(file);
        }

    });
}

if (scanBtn) {

    scanBtn.addEventListener("click", function () {

        loading.style.display = "block";

        setTimeout(function () {

            loading.style.display = "none";

            document.getElementById("foodName").textContent = "Fried Rice 🍚";
            document.getElementById("calories").textContent = "520 kcal";
            document.getElementById("protein").textContent = "14 g";
            document.getElementById("carb").textContent = "63 g";
            document.getElementById("fat").textContent = "18 g";
            document.getElementById("confidence").textContent = "97%";

        }, 2000);

    });

}