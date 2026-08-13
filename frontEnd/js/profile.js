// =========================================
// CalorieScan Profile
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

                // =========================================
        // CURRENT USER PROFILE KEY
        // =========================================

        const currentUserEmail =
            localStorage.getItem(
                "calorieScanUserEmail"
            ) || "guest";

        const profileStorageKey =
            "calorieProfile_" + currentUserEmail;

            const userNameStorageKey =
    "calorieScanUserName_" + currentUserEmail;

const calorieGoalStorageKey =
    "dailyCalorieGoal_" + currentUserEmail;


        // =========================================
        // GET ELEMENTS
        // =========================================

        const fullName =
            document.getElementById("fullName");

        const email =
            document.getElementById("email");

        const age =
            document.getElementById("age");

        const gender =
            document.getElementById("gender");

        const weight =
            document.getElementById("weight");

        const height =
            document.getElementById("height");

        const calorieGoal =
            document.getElementById("calorieGoal");

        const displayName =
            document.getElementById("displayName");

        const calculateButton =
            document.getElementById("calculateCalories");

        const saveButton =
            document.getElementById("saveProfile");

        const calculateMessage =
            document.getElementById("calculateMessage");

        const saveMessage =
            document.getElementById("saveMessage");


        // =========================================
        // LOAD SAVED PROFILE
        // =========================================

        const savedProfile =
    JSON.parse(
        localStorage.getItem(
            profileStorageKey
        )
    ) || {};


        if (savedProfile.fullName) {

            fullName.value =
                savedProfile.fullName;

            displayName.textContent =
                savedProfile.fullName;

        }


        if (savedProfile.email) {

            email.value =
                savedProfile.email;

        }


        if (savedProfile.age) {

            age.value =
                savedProfile.age;

        }


        if (savedProfile.gender) {

            gender.value =
                savedProfile.gender;

        }


        if (savedProfile.weight) {

            weight.value =
                savedProfile.weight;

        }


        if (savedProfile.height) {

            height.value =
                savedProfile.height;

        }


        if (savedProfile.calorieGoal) {

            calorieGoal.value =
                savedProfile.calorieGoal;

        }


        // =========================================
        // CALCULATE BMR
        // =========================================

        function calculateBMR() {

            const userAge =
                Number(age.value);

            const userWeight =
                Number(weight.value);

            const userHeight =
                Number(height.value);

            const userGender =
                gender.value;


            // Check information

            if (
                !userAge ||
                !userWeight ||
                !userHeight ||
                !userGender
            ) {

                return null;

            }


            let bmr;


            // Female

            if (
                userGender === "female"
            ) {

                bmr =
                    (10 * userWeight) +
                    (6.25 * userHeight) -
                    (5 * userAge) -
                    161;

            }


            // Male

            else {

                bmr =
                    (10 * userWeight) +
                    (6.25 * userHeight) -
                    (5 * userAge) +
                    5;

            }


            return bmr;

        }


        // =========================================
        // CALCULATE DAILY CALORIES
        // =========================================

        function calculateDailyCalories() {

            const bmr =
                calculateBMR();


            if (!bmr) {

                return null;

            }


            /*
                Activity factor

                1.375 =
                Lightly active

                ใช้เป็นค่ากลางสำหรับ
                เวอร์ชันแรกของระบบ
            */

            const activityFactor =
                1.375;


            const calories =
                bmr * activityFactor;


            return Math.round(calories);

        }


        // =========================================
        // CALCULATE BUTTON
        // =========================================

        if (calculateButton) {
        calculateButton.addEventListener(
            "click",
            function () {


                const calories =
                    calculateDailyCalories();


                // Information incomplete

                if (!calories) {

                    calculateMessage.textContent =
                        "⚠️ Please enter age, gender, weight and height.";

                    return;

                }


                // Put result in input

                calorieGoal.value =
                    calories;


                calculateMessage.textContent =
                    "🔥 Recommended calorie goal calculated!";


                console.log(
                    "🔥 Recommended calories:",
                    calories
                );


                // Clear message

                setTimeout(
                    function () {

                        calculateMessage.textContent =
                            "";

                    },
                    3000
                );

            }
        );

     }


        // =========================================
        // AUTO CALCULATE WHEN DATA CHANGES
        // =========================================

        function autoCalculate() {

            const calories =
                calculateDailyCalories();


            if (calories) {

                calorieGoal.value =
                    calories;

            }

        }


        age.addEventListener(
            "input",
            autoCalculate
        );


        weight.addEventListener(
            "input",
            autoCalculate
        );


        height.addEventListener(
            "input",
            autoCalculate
        );


        gender.addEventListener(
            "change",
            autoCalculate
        );


        // =========================================
        // SAVE PROFILE
        // =========================================

        saveButton.addEventListener(
            "click",
            function () {


                // =====================================
                // CHECK REQUIRED INFORMATION
                // =====================================

                if (
                    !fullName.value ||
                    !age.value ||
                    !gender.value ||
                    !weight.value ||
                    !height.value
                ) {

                    saveMessage.textContent =
                        "⚠️ Please complete your information.";

                    return;

                }


                // =====================================
                // CALCULATE CALORIES
                // =====================================

                const calculatedCalories =
                    calculateDailyCalories();


                if (calculatedCalories) {

                    calorieGoal.value =
                        calculatedCalories;

                }


                // =====================================
                // CREATE PROFILE
                // =====================================

                const profile = {

                    fullName:
                        fullName.value,

                    email:
                        email.value,

                    age:
                        Number(age.value),

                    gender:
                        gender.value,

                    weight:
                        Number(weight.value),

                    height:
                        Number(height.value),

                    calorieGoal:
                        Number(calorieGoal.value)

                };


                // =====================================
                // SAVE PROFILE
                // =====================================

                localStorage.setItem(
    profileStorageKey,
    JSON.stringify(profile)
);


                // =====================================
                // SAVE USER NAME
                // =====================================

                localStorage.setItem(
    userNameStorageKey,
    fullName.value
);


                // =====================================
                // SAVE DAILY GOAL
                // =====================================

                localStorage.setItem(
    calorieGoalStorageKey,
    calorieGoal.value
);


                // =====================================
                // UPDATE NAME
                // =====================================

                displayName.textContent =
                    fullName.value;


                // =====================================
                // SHOW SUCCESS
                // =====================================

                saveMessage.textContent =
                    "✅ Profile saved successfully!";


                console.log(
                    "✅ Profile saved:",
                    profile
                );


                console.log(
                    "🔥 Daily Calorie Goal:",
                    calorieGoal.value,
                    "kcal"
                );


                // =====================================
                // HIDE MESSAGE
                // =====================================

                setTimeout(
                    function () {

                        saveMessage.textContent =
                            "";

                    },
                    3000
                );

            }
        );

    }
);