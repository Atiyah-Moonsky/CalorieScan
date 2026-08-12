// =========================
// SCAN PAGE
// =========================
console.log("🟢 scan.js loaded!");
console.log("📍 CURRENT PAGE:", window.location.href);

window.addEventListener("beforeunload", function () {
    console.log("🚨 PAGE IS RELOADING!");
});

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const scanBtn = document.getElementById("scanBtn");
const loading = document.getElementById("loading");


// =========================
// IMAGE PREVIEW
// =========================

if (imageInput) {

    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {

            preview.src = URL.createObjectURL(file);

        }

    });

}


// =========================
// SCAN FOOD
// =========================

if (scanBtn) {

    scanBtn.addEventListener("click", async function () {

        loading.style.display = "block";


        // Simulate AI scanning
        setTimeout(async function () {

            loading.style.display = "none";


            // AI result
            const foodName = "Fried Rice 🍚";
            const calories = 520;


            // Show result on screen

            document.getElementById("foodName").textContent =
                foodName;

            document.getElementById("calories").textContent =
                calories + " kcal";

            document.getElementById("protein").textContent =
                "14 g";

            document.getElementById("carb").textContent =
                "63 g";

            document.getElementById("fat").textContent =
                "18 g";

            document.getElementById("confidence").textContent =
                "97%";


            // =========================
            // SAVE MEAL TO DJANGO
            // =========================

            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/api/add-meal/",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            food_name: foodName,
                            calories: calories

                        })

                    }
                );


                const data =
                    await response.json();


                console.log(
                    "ADD MEAL RESULT:",
                    data
                );


                if (data.success) {

                    console.log(
                        "✅ Meal saved to Django!"
                    );

                }

                else {

                    console.error(
                        "❌ Meal was not saved:",
                        data.message
                    );

                }


            } catch (error) {

                console.error(
                    "❌ Cannot connect to Django:",
                    error
                );

            }

        }, 2000);

    });

}