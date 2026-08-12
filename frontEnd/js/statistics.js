// ========================================
// CalorieScan Statistics
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ========================================
        // GET DATA
        // ========================================

        const meals =
            JSON.parse(
                localStorage.getItem(
                    "calorieScanMeals"
                )
            ) || [];


        const profile =
            JSON.parse(
                localStorage.getItem(
                    "calorieProfile"
                )
            ) || {};


        // ========================================
        // DATE
        // ========================================

        const todayDate =
            document.getElementById(
                "todayDate"
            );


        if (todayDate) {

            todayDate.textContent =
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        // ========================================
        // CALCULATE TOTALS
        // ========================================

        let totalCalories = 0;

        let totalProtein = 0;

        let totalCarb = 0;

        let totalFat = 0;


        meals.forEach(
            function (meal) {

                totalCalories +=
                    Number(meal.calories) || 0;


                totalProtein +=
                    parseFloat(meal.protein) || 0;


                totalCarb +=
                    parseFloat(meal.carb) || 0;


                totalFat +=
                    parseFloat(meal.fat) || 0;

            }
        );


        // ========================================
        // AVERAGE
        // ========================================

        let averageCalories = 0;


        if (meals.length > 0) {

            averageCalories =
                Math.round(
                    totalCalories /
                    meals.length
                );

        }


        // ========================================
        // DISPLAY
        // ========================================

        document.getElementById(
            "totalCalories"
        ).textContent =
            totalCalories;


        document.getElementById(
            "averageCalories"
        ).textContent =
            averageCalories;


        document.getElementById(
            "proteinTotal"
        ).textContent =
            totalProtein + " g";


        document.getElementById(
            "carbTotal"
        ).textContent =
            totalCarb + " g";


        document.getElementById(
            "fatTotal"
        ).textContent =
            totalFat + " g";


        // ========================================
        // WEEKLY DATA
        // ========================================

        const labels = [];

        const weeklyCalories = [];


        const today =
            new Date();


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


            const label =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            labels.push(label);


            let dailyCalories = 0;


            meals.forEach(
                function (meal) {

                    if (!meal.date) {
                        return;
                    }


                    const mealDate =
                        new Date(meal.date);


                    if (

                        mealDate.getFullYear() ===
                        date.getFullYear()

                        &&

                        mealDate.getMonth() ===
                        date.getMonth()

                        &&

                        mealDate.getDate() ===
                        date.getDate()

                    ) {

                        dailyCalories +=
                            Number(
                                meal.calories
                            ) || 0;

                    }

                }
            );


            weeklyCalories.push(
                dailyCalories
            );

        }


        // ========================================
        // CHART
        // ========================================

        const canvas =
            document.getElementById(
                "statisticsChart"
            );


        if (canvas) {

            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [{

                            label:
                                "Calories",

                            data:
                                weeklyCalories

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

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


        // ========================================
        // INSIGHT
        // ========================================

        const message =
            document.getElementById(
                "statisticsMessage"
            );


        const goal =
            Number(
                profile.calorieGoal
            ) || 2000;


        if (
            message &&
            meals.length > 0
        ) {

            if (
                totalCalories > goal
            ) {

                message.textContent =
                    "You have consumed more calories than your daily goal. Try to balance your meals tomorrow.";

            }

            else {

                message.textContent =
                    "Your calorie intake is currently within your daily goal. Keep maintaining a balanced diet! 💜";

            }

        }

    }
);