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

const mealTypeElement =
    document.getElementById("mealType");


// ========================================
// DEBUG MESSAGE
// ========================================

function showDebug(message) {

    if (debugMessage) {
        debugMessage.textContent = message;
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
                        "✅ Scan complete! Choose Meal Type 👇"
                    );


                    // ========================================
                    // STORE TEMPORARY RESULT
                    // ========================================

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


            // ========================================
            // GET MEAL TYPE
            // ========================================

            const mealType =
                mealTypeElement
                    ? mealTypeElement.value
                    : "Lunch";


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
                                        window.currentMeal.confidence,

                                    meal:
                                        mealType

                                })

                        }
                    );


                // ========================================
                // GET RESPONSE
                // ========================================

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

                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Add to Meal";

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


                    // ========================================
                    // SAVE LOCAL BACKUP
                    // ========================================

                    const meals =
                        JSON.parse(
                            localStorage.getItem(
                                "calorieScanMeals"
                            )
                        ) || [];


                    meals.push({

                        food:
                            window.currentMeal.food_name,

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

                        meal:
                            mealType,

                        date:
                            new Date().toISOString(),

                        time:
                            new Date().toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )

                    });


                    localStorage.setItem(
                        "calorieScanMeals",
                        JSON.stringify(meals)
                    );


                    console.log(
                        "💾 Meal saved locally!"
                    );

                    console.log(
                        "🍽️ Meal Type:",
                        mealType
                    );


                    // ========================================
                    // RESET BUTTON
                    // ========================================

                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Added to Meal";

                }

                else {

                    showDebug(
                        "❌ " +
                        (
                            data.message ||
                            "Meal was not saved."
                        )
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

// ========================================
// CAMERA
// ========================================

const cameraBtn =
    document.getElementById("cameraBtn");

const cameraContainer =
    document.getElementById("cameraContainer");

const camera =
    document.getElementById("camera");

const captureBtn =
    document.getElementById("captureBtn");

const closeCameraBtn =
    document.getElementById("closeCameraBtn");

let cameraStream = null;


// ========================================
// OPEN CAMERA
// ========================================

if (cameraBtn) {

    cameraBtn.addEventListener(
        "click",
        async function () {

            try {

                cameraStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true
                    });

                camera.srcObject =
                    cameraStream;

                cameraContainer.style.display =
                    "block";

                showDebug(
                    "📷 Camera is ready!"
                );

            }

            catch (error) {

                console.error(
                    "Camera error:",
                    error
                );

                showDebug(
                    "❌ Cannot access camera."
                );

                alert(
                    "Cannot access camera. Please allow camera permission."
                );

            }

        }
    );

}


// ========================================
// CAPTURE PHOTO
// ========================================

if (captureBtn) {

    captureBtn.addEventListener(
        "click",
        function () {

            if (!cameraStream) {
                return;
            }


            const canvas =
                document.createElement("canvas");

            canvas.width =
                camera.videoWidth;

            canvas.height =
                camera.videoHeight;


            const context =
                canvas.getContext("2d");


            context.drawImage(
                camera,
                0,
                0,
                canvas.width,
                canvas.height
            );


            // Show captured image

            preview.src =
                canvas.toDataURL("image/png");

            preview.style.display =
                "block";


            showDebug(
                "📸 Photo captured!"
            );


            // Close camera

            stopCamera();

        }
    );

}


// ========================================
// CLOSE CAMERA
// ========================================

if (closeCameraBtn) {

    closeCameraBtn.addEventListener(
        "click",
        function () {

            stopCamera();

            showDebug(
                "📷 Camera closed."
            );

        }
    );

}


// ========================================
// STOP CAMERA
// ========================================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        cameraStream = null;

    }


    if (camera) {

        camera.srcObject =
            null;

    }


    if (cameraContainer) {

        cameraContainer.style.display =
            "none";

    }

}