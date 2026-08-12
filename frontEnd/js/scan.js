// =========================
// SCAN JS LOADED
// =========================

console.log("🟢 scan.js loaded!");


// =========================
// GET HTML ELEMENTS
// =========================

const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const scanBtn =
    document.getElementById("scanBtn");

const loading =
    document.getElementById("loading");


// =========================
// CHECK ELEMENTS
// =========================

console.log("imageInput:", imageInput);

console.log("preview:", preview);

console.log("scanBtn:", scanBtn);

console.log("loading:", loading);


// =========================
// IMAGE PREVIEW
// =========================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (file) {

                preview.src =
                    URL.createObjectURL(file);

                console.log(
                    "📷 Image selected!"
                );

            }

        }
    );

}


// =========================
// SCAN FOOD
// =========================

if (scanBtn) {

    scanBtn.addEventListener(
        "click",
        async function () {

            console.log(
                "🔵 SCAN BUTTON CLICKED"
            );
            loading.style.display = "block";


            // Show loading

            loading.style.display =
                "block";


            // Simulate AI scanning

            setTimeout(
                async function () {

                    // Hide loading

                    loading.style.display =
                        "none";


                    // =========================
                    // AI RESULT
                    // =========================

                    const foodName =
                        "Fried Rice 🍚";

                    const calories =
                        520;

                    const protein =
                        "14 g";

                    const carb =
                        "63 g";

                    const fat =
                        "18 g";

                    const confidence =
                        "97%";


                    // =========================
                    // SHOW RESULT
                    // =========================

                    document.getElementById(
                        "foodName"
                    ).textContent =
                        foodName;


                    document.getElementById(
                        "calories"
                    ).textContent =
                        calories + " kcal";


                    document.getElementById(
                        "protein"
                    ).textContent =
                        protein;


                    document.getElementById(
                        "carb"
                    ).textContent =
                        carb;


                    document.getElementById(
                        "fat"
                    ).textContent =
                        fat;


                    document.getElementById(
                        "confidence"
                    ).textContent =
                        confidence;


                    console.log(
                        "🤖 AI RESULT:",
                        foodName,
                        calories
                    );


                    // =========================
                    // SAVE TO DJANGO
                    // =========================

                    try {

                        console.log(
                            "📡 Sending meal to Django..."
                        );


                        const response =
                            await fetch(
                                "http://127.0.0.1:8000/api/add-meal/",
                                {

                                    method: "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    credentials:
                                        "include",

                                    body:
                                        JSON.stringify({

                                            food_name:
                                                foodName,

                                            calories:
                                                calories

                                        })

                                }
                            );


                        console.log(
                            "🔥 DJANGO RESPONDED!"
                        );


                        const data =
                            await response.json();


                        console.log(
                            "ADD MEAL RESULT:",
                            data
                        );


                        // =========================
                        // SUCCESS
                        // =========================

                        if (data.success) {

                            console.log(
                                "✅ Meal saved to Django!"
                            );

                        }


                        // =========================
                        // ERROR
                        // =========================

                        else {

                            console.error(
                                "❌ Meal was not saved:",
                                data.message
                            );

                        }

                    }


                    catch (error) {

                        console.error(
                            "❌ Django connection error:",
                            error
                        );

                    }

                },
                2000
            );

        }
    );

}