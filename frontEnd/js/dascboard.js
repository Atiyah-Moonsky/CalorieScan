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
// GET DAILY CALORIE GOAL
// ===============================

function getDailyGoal() {

    const savedGoal =
        localStorage.getItem("dailyCalorieGoal");

    return Number(savedGoal) || 2000;

}


// ===============================
// LOAD PROFILE DATA
// ===============================

function loadProfileData() {

    const profile =
        JSON.parse(
            localStorage.getItem("calorieProfile")
        ) || {};


    const userName =
        document.getElementById("userName");

    const dailyGoal =
        document.getElementById("dailyGoal");


    // User Name

    if (
        userName &&
        profile.fullName
    ) {

        userName.textContent =
            profile.fullName;

    }


    // Daily Goal

    const goal =
        getDailyGoal();


    if (dailyGoal) {

        dailyGoal.textContent =
            goal;

    }

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
                    ${meal.meal || "Meal"}
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

    updateWeeklyChart();

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


    // Get Goal from Profile

    const goal =
        getDailyGoal();


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

    const dailyGoal =
        document.getElementById(
            "dailyGoal"
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


    // Total Calories

    if (totalCalories) {

        totalCalories.textContent =
            total;

    }


    // Daily Goal

    if (dailyGoal) {

        dailyGoal.textContent =
            goal;

    }


    // Remaining Calories

    if (remainingCalories) {

        remainingCalories.textContent =
            Math.max(
                goal - total,
                0
            ) + " kcal Remaining";

    }


    // Progress Bar

    if (progress) {

        const percentage =
            Math.min(
                (total / goal) * 100,
                100
            );

        progress.style.width =
            percentage + "%";

    }


    // Protein

    if (proteinValue) {

        proteinValue.textContent =
            protein + " g";

    }


    // Carbohydrate

    if (carbValue) {

        carbValue.textContent =
            carb + " g";

    }


    // Fat

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


    const scanMeals =
        JSON.parse(
            localStorage.getItem(
                "calorieScanMeals"
            )
        ) || [];


    const today =
        new Date();


    const labels = [];

    const weeklyCalories = [];


    // 7 DAYS

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() - i
        );


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        labels.push(
            dayName
        );


        const dailyTotal =
            scanMeals

                .filter(meal => {

                    if (!meal.date) {

                        return false;

                    }


                    const mealDate =
                        new Date(
                            meal.date
                        );


                    return (

                        mealDate.getFullYear() ===
                        date.getFullYear()

                        &&

                        mealDate.getMonth() ===
                        date.getMonth()

                        &&

                        mealDate.getDate() ===
                        date.getDate()

                    );

                })

                .reduce(
                    (total, meal) => {

                        return total +
                            (
                                Number(
                                    meal.calories
                                ) || 0
                            );

                    },
                    0
                );


        weeklyCalories.push(
            dailyTotal
        );

    }


    // CREATE CHART

    weeklyChart =
        new Chart(

            canvas,

            {

                type: "bar",

                data: {

                    labels:
                        labels,

                    datasets: [{

                        label:
                            "Calories",

                        data:
                            weeklyCalories

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero:
                                true

                        }

                    }

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
// START DASHBOARD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfileData();

        showDate();

        displayMeals();

        updateMealChart();

        updateWeeklyChart();

    }
);