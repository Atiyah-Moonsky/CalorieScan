// ========================================
// SCAN.JS
// ========================================

console.log("🟢 scan.js loaded!");


// ========================================
// GET ELEMENTS
// ========================================

const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const scanBtn =
    document.getElementById("scanBtn");

const loading =
    document.getElementById("loading");

const debugMessage =
    document.getElementById("debugMessage");

const addMealBtn =
    document.getElementById("addMeal");

const foodNameElement =
    document.getElementById("foodName");

const caloriesElement =
    document.getElementById("calories");

const proteinElement =
    document.getElementById("protein");

const carbElement =
    document.getElementById("carb");

const fatElement =
    document.getElementById("fat");

const confidenceElement =
    document.getElementById("confidence");


// ========================================
// DEBUG MESSAGE
// ========================================

function showDebug(message) {

    if (debugMessage) {

        debugMessage.textContent =
            message;

    }

    console.log(message);
}


// ========================================
// IMAGE PREVIEW
// ========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            preview.src =
                URL.createObjectURL(file);

            preview.style.display =
                "block";

            showDebug(
                "📷 Image selected!"
            );

        }
    );

}


// ========================================
// SCAN FOOD
// ========================================

if (scanBtn) {

    scanBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showDebug(
                "🔵 Scan started..."
            );


            // Check image

            if (
                !imageInput ||
                imageInput.files.length === 0
            ) {

                showDebug(
                    "⚠️ Please select an image first."
                );

                return;
            }


            // Show loading

            if (loading) {

                loading.style.display =
                    "block";

            }


            showDebug(
                "🤖 AI is analyzing..."
            );


            // Simulate AI

            setTimeout(
                function () {

                    if (loading) {

                        loading.style.display =
                            "none";

                    }


                    // ========================================
                    // AI RESULT
                    // ========================================

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


                    // ========================================
                    // SHOW RESULT
                    // ========================================

                    foodNameElement.textContent =
                        foodName;

                    caloriesElement.textContent =
                        calories + " kcal";

                    proteinElement.textContent =
                        protein;

                    carbElement.textContent =
                        carb;

                    fatElement.textContent =
                        fat;

                    confidenceElement.textContent =
                        confidence;


                    showDebug(
                        "✅ Scan complete! Add to Meal 👇"
                    );


                    // Store temporary result

                    window.currentMeal = {

                        food_name:
                            foodName,

                        calories:
                            calories,

                        protein:
                            protein,

                        carb:
                            carb,

                        fat:
                            fat,

                        confidence:
                            confidence

                    };

                },
                2000
            );

        }
    );

}


// ========================================
// ADD TO MEAL
// ========================================

if (addMealBtn) {

    addMealBtn.addEventListener(
        "click",
        async function () {

            // Check scan result

            if (!window.currentMeal) {

                showDebug(
                    "⚠️ Please scan your food first."
                );

                return;

            }


            showDebug(
                "📡 Saving meal..."
            );


            addMealBtn.disabled =
                true;

            addMealBtn.textContent =
                "Saving...";


            try {

                // ========================================
                // SEND TO DJANGO
                // ========================================

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
                                        window.currentMeal.food_name,

                                    calories:
                                        window.currentMeal.calories,

                                    protein:
                                        window.currentMeal.protein,

                                    carbohydrate:
                                        window.currentMeal.carb,

                                    fat:
                                        window.currentMeal.fat,

                                    confidence:
                                        window.currentMeal.confidence

                                })

                        }
                    );


                // Get response

                const text =
                    await response.text();


                console.log(
                    "Django response:",
                    text
                );


                let data;

                try {

                    data =
                        JSON.parse(text);

                }

                catch (error) {

                    showDebug(
                        "❌ Django returned invalid response."
                    );

                    console.error(
                        error
                    );

                    return;

                }


                // ========================================
                // SUCCESS
                // ========================================

                if (data.success) {

                    showDebug(
                        "🎉 Meal added successfully!"
                    );


                    alert(
                        "Meal added successfully! 🎉"
                    );


                    // Save local backup

                    const meals =
                        JSON.parse(
                            localStorage.getItem(
                                "calorieScanMeals"
                            )
                        ) || [];


                    meals.push({

                        foodName:
                            window.currentMeal.food_name,

                        calories:
                            window.currentMeal.calories,

                        protein:
                            window.currentMeal.protein,

                        carb:
                            window.currentMeal.carb,

                        fat:
                            window.currentMeal.fat,

                        confidence:
                            window.currentMeal.confidence,

                        date:
                            new Date().toISOString()

                    });


                    localStorage.setItem(
                        "calorieScanMeals",
                        JSON.stringify(meals)
                    );


                    console.log(
                        "💾 Meal saved locally!"
                    );


                    // Reset button

                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Added to Meal";


                }

                else {

                    showDebug(
                        "❌ " +
                        (data.message ||
                            "Meal was not saved.")
                    );


                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Add to Meal";

                }

            }

            catch (error) {

                console.error(
                    "❌ Django error:",
                    error
                );


                showDebug(
                    "❌ Cannot connect to Django."
                );


                addMealBtn.disabled =
                    false;

                addMealBtn.textContent =
                    "➕ Add to Meal";

            }

        }
    );

}