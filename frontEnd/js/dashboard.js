// ===============================
// CalorieScan Dashboard
// ===============================

let meals =
    JSON.parse(
        localStorage.getItem("calorieScanMeals")
    ) || [];


// ===============================
// SAVE MEALS
// ===============================

function saveMeals() {

    localStorage.setItem(
        "calorieScanMeals",
        JSON.stringify(meals)
    );

}


// ===============================
// DISPLAY MEALS
// ===============================

function displayMeals() {

    const tableBody =
        document.getElementById("mealTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    meals
        .slice()
        .reverse()
        .forEach((meal, index) => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${meal.foodName || "Unknown Food"}
                </td>

                <td>
                    ${meal.calories || 0} kcal
                </td>

                <td>
                    Meal
                </td>

                <td>
                    ${
                        meal.date
                            ? new Date(
                                meal.date
                              ).toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                              )
                            : "-"
                    }
                </td>

                <td>
                    <button
                        type="button"
                        onclick="deleteMeal(${index})"
                        style="
                            background:red;
                            color:white;
                            padding:8px 12px;
                            border:none;
                            border-radius:8px;
                            cursor:pointer;
                        "
                    >
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

    const confirmDelete =
        confirm(
            "Do you want to delete this meal?"
        );

    if (!confirmDelete) return;


    meals.splice(index, 1);

    saveMeals();

    displayMeals();

    updateMealChart();

}


// ===============================
// TODAY'S CALORIES
// ===============================

function updateCalories() {

    let total = 0;

    let protein = 0;
    let carb = 0;
    let fat = 0;


    meals.forEach(meal => {

        total +=
            Number(meal.calories) || 0;

        protein +=
            parseFloat(meal.protein) || 0;

        carb +=
            parseFloat(meal.carb) || 0;

        fat +=
            parseFloat(meal.fat) || 0;

    });


    const totalCalories =
        document.getElementById(
            "totalCalories"
        );

    const remainingCalories =
        document.getElementById(
            "remainingCalories"
        );

    const progress =
        document.getElementById(
            "calorieProgress"
        );

    const proteinValue =
        document.getElementById(
            "proteinValue"
        );

    const carbValue =
        document.getElementById(
            "carbValue"
        );

    const fatValue =
        document.getElementById(
            "fatValue"
        );


    if (totalCalories) {

        totalCalories.textContent =
            total;

    }


    if (remainingCalories) {

        remainingCalories.textContent =
            Math.max(
                2000 - total,
                0
            ) + " kcal Remaining";

    }


    if (progress) {

        const percentage =
            Math.min(
                (total / 2000) * 100,
                100
            );

        progress.style.width =
            percentage + "%";

    }


    if (proteinValue) {

        proteinValue.textContent =
            protein + " g";

    }


    if (carbValue) {

        carbValue.textContent =
            carb + " g";

    }


    if (fatValue) {

        fatValue.textContent =
            fat + " g";

    }

}


// ===============================
// MEAL CHART
// ===============================

let mealChart;


function updateMealChart() {

    const canvas =
        document.getElementById(
            "mealChart"
        );

    if (!canvas) return;


    const breakfast =
        getMealCalories(
            "Breakfast"
        );

    const lunch =
        getMealCalories(
            "Lunch"
        );

    const dinner =
        getMealCalories(
            "Dinner"
        );

    const snack =
        getMealCalories(
            "Snack"
        );


    if (mealChart) {

        mealChart.destroy();

    }


    mealChart =
        new Chart(

            canvas,

            {

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

            }

        );

}


// ===============================
// GET CALORIES BY MEAL
// ===============================

function getMealCalories(mealType) {

    return meals

        .filter(
            meal =>
                meal.meal === mealType
        )

        .reduce(
            (total, meal) =>
                total +
                (
                    Number(
                        meal.calories
                    ) || 0
                ),

            0
        );

}


// ===============================
// WEEKLY CHART
// ===============================

let weeklyChart;


function updateWeeklyChart() {

    const canvas =
        document.getElementById(
            "weeklyChart"
        );

    if (!canvas) return;


    if (weeklyChart) {

        weeklyChart.destroy();

    }


    weeklyChart =
        new Chart(

            canvas,

            {

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

                        label:
                            "Calories",

                        data: [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }

        );

}


// ===============================
// TODAY DATE
// ===============================

function showDate() {

    const dateElement =
        document.getElementById(
            "todayDate"
        );

    if (!dateElement) return;


    const today =
        new Date();


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
// USER NAME
// ===============================

function showUserName() {

    const userName =
        localStorage.getItem(
            "calorieScanUserName"
        );


    const userNameElement =
        document.getElementById(
            "userName"
        );


    if (
        userName &&
        userNameElement
    ) {

        userNameElement.textContent =
            userName;

    }

}


// ===============================
// START DASHBOARD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showDate();

        showUserName();

        displayMeals();

        updateMealChart();

        updateWeeklyChart();

    }
);