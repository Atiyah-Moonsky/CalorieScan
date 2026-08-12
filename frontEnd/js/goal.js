// ========================================
// CalorieScan Goal
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ========================================
        // LOAD PROFILE
        // ========================================

        const profile =
            JSON.parse(
                localStorage.getItem(
                    "calorieProfile"
                )
            ) || {};


        // ========================================
        // LOAD MEALS
        // ========================================

        const meals =
            JSON.parse(
                localStorage.getItem(
                    "calorieScanMeals"
                )
            ) || [];


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
        // PROFILE VALUES
        // ========================================

        const age =
            Number(profile.age) || 0;

        const weight =
            Number(profile.weight) || 0;

        const height =
            Number(profile.height) || 0;

        const gender =
            profile.gender || "";


        // ========================================
        // DISPLAY PROFILE
        // ========================================

        document.getElementById(
            "userAge"
        ).textContent =
            age
                ? age + " years"
                : "-";


        document.getElementById(
            "userWeight"
        ).textContent =
            weight
                ? weight + " kg"
                : "-";


        document.getElementById(
            "userHeight"
        ).textContent =
            height
                ? height + " cm"
                : "-";


        // ========================================
        // CALCULATE BMR
        // ========================================

        let bmr = 0;


        if (
            age > 0 &&
            weight > 0 &&
            height > 0
        ) {

            if (gender === "male") {

                bmr =
                    (
                        10 * weight
                    ) +
                    (
                        6.25 * height
                    ) -
                    (
                        5 * age
                    ) +
                    5;

            }

            else if (
                gender === "female"
            ) {

                bmr =
                    (
                        10 * weight
                    ) +
                    (
                        6.25 * height
                    ) -
                    (
                        5 * age
                    ) -
                    161;

            }

        }


        // ========================================
        // ESTIMATE DAILY CALORIES
        // ========================================

        let recommendedCalories =
            2000;


        if (bmr > 0) {

            // Moderate activity estimate

            recommendedCalories =
                Math.round(
                    bmr * 1.4
                );

        }


        // ========================================
        // USE SAVED GOAL IF EXISTS
        // ========================================

        let goal =
            Number(
                profile.calorieGoal
            );


        if (
            !goal ||
            goal <= 0
        ) {

            goal =
                recommendedCalories;

        }


        // ========================================
        // TODAY'S CALORIES
        // ========================================

        let todayCalories = 0;


        const today =
            new Date();


        meals.forEach(
            function (meal) {

                if (!meal.date) {
                    return;
                }


                const mealDate =
                    new Date(meal.date);


                if (

                    mealDate.getFullYear() ===
                    today.getFullYear()

                    &&

                    mealDate.getMonth() ===
                    today.getMonth()

                    &&

                    mealDate.getDate() ===
                    today.getDate()

                ) {

                    todayCalories +=
                        Number(
                            meal.calories
                        ) || 0;

                }

            }
        );


        // ========================================
        // DISPLAY GOAL
        // ========================================

        document.getElementById(
            "goalCalories"
        ).textContent =
            goal;


        document.getElementById(
            "todayCalories"
        ).textContent =
            todayCalories;


        // ========================================
        // PROGRESS
        // ========================================

        const progress =
            document.getElementById(
                "goalProgress"
            );


        const percentage =
            Math.min(
                (
                    todayCalories /
                    goal
                ) * 100,
                100
            );


        if (progress) {

            progress.style.width =
                percentage + "%";

        }


        // ========================================
        // MESSAGE
        // ========================================

        const goalMessage =
            document.getElementById(
                "goalMessage"
            );


        const remaining =
            Math.max(
                goal - todayCalories,
                0
            );


        if (todayCalories > goal) {

            goalMessage.textContent =
                "You have exceeded your daily calorie goal.";

        }

        else {

            goalMessage.textContent =
                remaining +
                " kcal remaining";

        }


        // ========================================
        // RECOMMENDATION
        // ========================================

        const recommendation =
            document.getElementById(
                "recommendation"
            );


        if (
            age &&
            weight &&
            height &&
            gender
        ) {

            recommendation.innerHTML = `

                Based on your profile, your estimated
                daily calorie requirement is approximately

                <strong>
                    ${recommendedCalories} kcal/day
                </strong>.

                <br><br>

                This is an estimate based on the
                Mifflin-St Jeor equation and a moderate
                activity assumption.

                <br><br>

                You can adjust your goal from your
                <a href="profile.html">
                    Profile
                </a>.

            `;

        }

        else {

            recommendation.textContent =
                "Please complete your age, gender, weight, and height in your Profile to calculate your recommended calorie intake.";

        }

    }
);