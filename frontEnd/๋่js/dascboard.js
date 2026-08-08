// ========================================
// CalorieScan - Dashboard
// ========================================

const DAILY_GOAL = 2000;


// ========================================
// Get meals from localStorage
// ========================================

function getMeals() {

    try {

        return JSON.parse(
            localStorage.getItem("calorieScanMeals")
        ) || [];

    } catch (error) {

        console.error("Cannot read meal data:", error);

        return [];

    }

}


// ========================================
// Calculate total calories
// ========================================

function updateCalories() {

    const meals = getMeals();

    const total = meals.reduce(
        (sum, meal) => sum + Number(meal.calories || 0),
        0
    );


    const totalElement =
        document.getElementById("totalCalories");

    const goalElement =
        document.getElementById("dailyGoal");

    const progressElement =
        document.getElementById("calorieProgress");

    const remainingElement =
        document.getElementById("remainingCalories");


    if (totalElement) {

        totalElement.textContent = total;

    }


    if (goalElement) {

        goalElement.textContent = DAILY_GOAL;

    }


    const percentage =
        Math.min((total / DAILY_GOAL) * 100, 100);


    if (progressElement) {

        progressElement.style.width =
            percentage + "%";

    }


    const remaining =
        Math.max(DAILY_GOAL - total, 0);


    if (remainingElement) {

        remainingElement.textContent =
            remaining + " kcal Remaining";

    }

}


// ========================================
// Recent Meals
// ========================================

function updateMealTable() {

    const meals = getMeals();

    const table =
        document.getElementById("mealTableBody");


    if (!table) return;


    table.innerHTML = "";


    meals.slice().reverse().forEach(function (meal) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${meal.food || "-"}</td>

            <td>${meal.calories || 0} kcal</td>

            <td>${meal.meal || "-"}</td>

            <td>${meal.time || "-"}</td>

        `;


        table.appendChild(row);

    });

}


// ========================================
// Calories by Meal Chart
// ========================================

function createMealChart() {

    const canvas =
        document.getElementById("mealChart");


    if (!canvas) return;


    const meals = getMeals();


    let breakfast = 0;
    let lunch = 0;
    let dinner = 0;
    let snack = 0;


    meals.forEach(function (meal) {

        const calories =
            Number(meal.calories || 0);


        const type =
            (meal.meal || "").toLowerCase();


        if (type === "breakfast") {

            breakfast += calories;

        } else if (type === "lunch") {

            lunch += calories;

        } else if (type === "dinner") {

            dinner += calories;

        } else if (type === "snack") {

            snack += calories;

        }

    });


    new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Snack"
            ],

            datasets: [{

                data: [
                    breakfast,
                    lunch,
                    dinner,
                    snack
                ],

                backgroundColor: [
                    "#9b5de5",
                    "#f15bb5",
                    "#ff9f43",
                    "#feca57"
                ],

                borderWidth: 2,

                borderColor: "#ffffff"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "58%",

            plugins: {

                legend: {

                    position: "right"

                }

            }

        }

    });

}


// ========================================
// Weekly Chart
// ========================================

function createWeeklyChart() {

    const canvas =
        document.getElementById("weeklyChart");


    if (!canvas) return;


    new Chart(canvas, {

        type: "bar",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [{

                label: "Calories",

                data: [
                    1800,
                    1650,
                    2100,
                    1900,
                    2200,
                    1700,
                    2000
                ],

                backgroundColor: "#a7d5f2",

                borderRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}


// ========================================
// Date
// ========================================

function updateDate() {

    const dateElement =
        document.getElementById("todayDate");


    if (!dateElement) return;


    const today = new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

}


// ========================================
// Nutrition
// ========================================

function updateNutrition() {

    const meals = getMeals();


    let protein = 0;
    let carb = 0;
    let fat = 0;


    meals.forEach(function (meal) {

        protein += Number(meal.protein || 0);

        carb += Number(meal.carb || 0);

        fat += Number(meal.fat || 0);

    });


    const proteinElement =
        document.getElementById("proteinValue");

    const carbElement =
        document.getElementById("carbValue");

    const fatElement =
        document.getElementById("fatValue");


    if (proteinElement) {

        proteinElement.textContent =
            protein + " g";

    }


    if (carbElement) {

        carbElement.textContent =
            carb + " g";

    }


    if (fatElement) {

        fatElement.textContent =
            fat + " g";

    }

}


// ========================================
// Start Dashboard
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCalories();

        updateMealTable();

        createMealChart();

        createWeeklyChart();

        updateDate();

        updateNutrition();

    }
);