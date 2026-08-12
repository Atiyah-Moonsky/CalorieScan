// ===============================
// CalorieScan Dashboard
// ===============================

let meals = JSON.parse(localStorage.getItem("calorieMeals")) || [
    {
        food: "Fried Rice 🍚",
        calories: 520,
        meal: "Lunch",
        time: "04:10 PM"
    },
    {
        food: "Apple 🍎",
        calories: 95,
        meal: "Snack",
        time: "02:30 PM"
    }
];

// ===============================
// SAVE MEALS
// ===============================

function saveMeals() {
    localStorage.setItem("calorieMeals", JSON.stringify(meals));
}

// ===============================
// DISPLAY MEALS
// ===============================

function displayMeals() {

    const tableBody = document.getElementById("mealTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    meals.forEach((meal, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${meal.food}</td>
            <td>${meal.calories} kcal</td>
            <td>${meal.meal}</td>
            <td>${meal.time}</td>

            <td>
    <button
        type="button"
        onclick="deleteMeal(${index})"
        style="background:red;color:white;padding:10px;border:none;border-radius:8px;cursor:pointer;">
        DELETE
    </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updateCalories();
}

// ===============================
// DELETE MEAL
// ===============================

function deleteMeal(index) {

    const confirmDelete = confirm(
        "Do you want to delete this meal?"
    );

    if (!confirmDelete) return;

    meals.splice(index, 1);

    saveMeals();

    displayMeals();

    updateMealChart();

    updateWeeklyChart();
}

// ===============================
// TODAY'S CALORIES
// ===============================

function updateCalories() {

    let total = 0;

    meals.forEach(meal => {
        total += Number(meal.calories);
    });

    const totalCalories =
        document.getElementById("totalCalories");

    const remainingCalories =
        document.getElementById("remainingCalories");

    const progress =
        document.getElementById("calorieProgress");

    const dailyGoal =
        document.getElementById("dailyGoal");

    if (!totalCalories) return;

    totalCalories.textContent = total;

    const goal =
        Number(dailyGoal?.textContent) || 2000;

    const remaining =
        Math.max(goal - total, 0);

    if (remainingCalories) {
        remainingCalories.textContent =
            remaining + " kcal Remaining";
    }

    if (progress) {

        let percentage =
            (total / goal) * 100;

        percentage =
            Math.min(percentage, 100);

        progress.style.width =
            percentage + "%";
    }
}

// ===============================
// MEAL CHART
// ===============================

let mealChart;

function updateMealChart() {

    const canvas =
        document.getElementById("mealChart");

    if (!canvas) return;

    const breakfast =
        getMealCalories("Breakfast");

    const lunch =
        getMealCalories("Lunch");

    const dinner =
        getMealCalories("Dinner");

    const snack =
        getMealCalories("Snack");

    if (mealChart) {
        mealChart.destroy();
    }

    mealChart = new Chart(canvas, {

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
                ]

            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "right"
                }

            }
        }
    });
}

// ===============================
// GET CALORIES BY MEAL
// ===============================

function getMealCalories(mealType) {

    return meals
        .filter(meal => meal.meal === mealType)
        .reduce(
            (total, meal) =>
                total + Number(meal.calories),
            0
        );
}

// ===============================
// WEEKLY CHART
// ===============================

let weeklyChart;

function updateWeeklyChart() {

    const canvas =
        document.getElementById("weeklyChart");

    if (!canvas) return;

    if (weeklyChart) {
        weeklyChart.destroy();
    }

    weeklyChart = new Chart(canvas, {

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
                ]

            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }
    });
}

// ===============================
// TODAY DATE
// ===============================

function showDate() {

    const dateElement =
        document.getElementById("todayDate");

    if (!dateElement) return;

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}

// ===============================
// START DASHBOARD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showDate();

        displayMeals();

        updateMealChart();

        updateWeeklyChart();

    }
);