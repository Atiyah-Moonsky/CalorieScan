// ========================================
// CalorieScan - Scan Food
// ========================================


// ---------- Upload & Preview ----------

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

if (imageInput && preview) {

    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {

            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";

        }

    });

}


// ---------- Scan Food ----------

const scanBtn = document.getElementById("scanBtn");
const loading = document.getElementById("loading");

if (scanBtn) {

    scanBtn.addEventListener("click", function () {

        if (!imageInput || !imageInput.files.length) {

            alert("Please upload a food image first.");

            return;
        }

        if (loading) {
            loading.style.display = "block";
        }

        // จำลอง AI Scan
        setTimeout(function () {

            if (loading) {
                loading.style.display = "none";
            }

            const foodName =
                document.getElementById("foodName");

            const calories =
                document.getElementById("calories");

            const protein =
                document.getElementById("protein");

            const carb =
                document.getElementById("carb");

            const fat =
                document.getElementById("fat");

            const confidence =
                document.getElementById("confidence");


            if (foodName) {
                foodName.textContent = "Fried Rice 🍚";
            }

            if (calories) {
                calories.textContent = "520 kcal";
            }

            if (protein) {
                protein.textContent = "14 g";
            }

            if (carb) {
                carb.textContent = "63 g";
            }

            if (fat) {
                fat.textContent = "18 g";
            }

            if (confidence) {
                confidence.textContent = "97%";
            }

        }, 2000);

    });

}


// ---------- Add Meal ----------

const addMealBtn =
    document.getElementById("addMeal");

if (addMealBtn) {

    addMealBtn.addEventListener("click", function () {

        const foodName =
            document.getElementById("foodName")?.textContent;

        const caloriesText =
            document.getElementById("calories")?.textContent;

        const proteinText =
            document.getElementById("protein")?.textContent;

        const carbText =
            document.getElementById("carb")?.textContent;

        const fatText =
            document.getElementById("fat")?.textContent;


        // ยังไม่ได้ Scan
        if (
            !foodName ||
            foodName === "-" ||
            !caloriesText ||
            caloriesText === "-"
        ) {

            alert("Please scan your food first.");

            return;
        }


        // แปลง "520 kcal" → 520
        const calories =
            parseInt(caloriesText) || 0;

        const protein =
            parseInt(proteinText) || 0;

        const carb =
            parseInt(carbText) || 0;

        const fat =
            parseInt(fatText) || 0;


        // ดึงข้อมูลเก่าจาก localStorage
        let meals = [];

        try {

            meals =
                JSON.parse(
                    localStorage.getItem("calorieScanMeals")
                ) || [];

        } catch (error) {

            meals = [];

        }


        // เวลาปัจจุบัน
        const now = new Date();

        const time =
            now.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        // สร้างข้อมูลมื้ออาหาร
        const newMeal = {

            food: foodName,

            calories: calories,

            protein: protein,

            carb: carb,

            fat: fat,

            meal: "Lunch",

            time: time

        };


        // เพิ่มข้อมูล
        meals.push(newMeal);


        // บันทึก
        localStorage.setItem(
            "calorieScanMeals",
            JSON.stringify(meals)
        );


        alert("Meal added successfully! 🍽️");


        // กลับ Dashboard
        window.location.href =
            "dashboard.html";

    });

}