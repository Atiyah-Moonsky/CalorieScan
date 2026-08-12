// =========================================
// CalorieScan Scan
// =========================================


// ===============================
// ELEMENTS
// ===============================

const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const scanBtn =
    document.getElementById("scanBtn");

const loading =
    document.getElementById("loading");

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


// Camera stream
let cameraStream = null;


// ===============================
// UPLOAD IMAGE
// ===============================

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) return;

    const imageURL =
        URL.createObjectURL(file);

    preview.src = imageURL;

});


// ===============================
// OPEN CAMERA
// ===============================

cameraBtn.addEventListener("click", async function () {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                },
                audio: false
            });

        camera.srcObject =
            cameraStream;

        cameraContainer.style.display =
            "block";

    } catch (error) {

        console.error(error);

        alert(
            "Cannot access camera. Please allow camera permission."
        );

    }

});


// ===============================
// CAPTURE PHOTO
// ===============================

captureBtn.addEventListener("click", function () {

    if (!cameraStream) return;


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


    // Convert image to preview
    preview.src =
        canvas.toDataURL("image/jpeg");


    // Close camera
    stopCamera();

});


// ===============================
// CLOSE CAMERA
// ===============================

closeCameraBtn.addEventListener(
    "click",
    function () {

        stopCamera();

    }
);


// ===============================
// STOP CAMERA
// ===============================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function (track) {

                track.stop();

            });

        cameraStream = null;
    }


    camera.srcObject = null;

    cameraContainer.style.display =
        "none";

}


// ===============================
// SCAN FOOD
// ===============================

scanBtn.addEventListener(
    "click",
    function () {

        loading.style.display =
            "block";


        setTimeout(function () {

            loading.style.display =
                "none";


            // ตัวอย่างผลลัพธ์
            document.getElementById(
                "foodName"
            ).textContent =
                "Fried Rice 🍚";


            document.getElementById(
                "calories"
            ).textContent =
                "520 kcal";


            document.getElementById(
                "protein"
            ).textContent =
                "12 g";


            document.getElementById(
                "carb"
            ).textContent =
                "75 g";


            document.getElementById(
                "fat"
            ).textContent =
                "18 g";


            document.getElementById(
                "confidence"
            ).textContent =
                "94%";


        }, 1500);

    }
);


// ===============================
// ADD MEAL
// ===============================

const addMeal =
    document.getElementById("addMeal");


addMeal.addEventListener(
    "click",
    function () {

        const newMeal = {

            food:
                document.getElementById(
                    "foodName"
                ).textContent,

            calories:
                parseInt(
                    document.getElementById(
                        "calories"
                    ).textContent
                ) || 0,

            meal:
                "Lunch",

            time:
                new Date().toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

        };


        // Get existing meals
        let meals =
            JSON.parse(
                localStorage.getItem(
                    "calorieMeals"
                )
            ) || [];


        // Add new meal
        meals.push(newMeal);


        // Save
        localStorage.setItem(
            "calorieMeals",
            JSON.stringify(meals)
        );


        alert(
            "Meal added successfully! 🍽️"
        );

    }
);

    

