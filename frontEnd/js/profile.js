// =========================================
// CalorieScan Profile
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const age = document.getElementById("age");
    const gender = document.getElementById("gender");
    const weight = document.getElementById("weight");
    const height = document.getElementById("height");
    const calorieGoal = document.getElementById("calorieGoal");

    const displayName = document.getElementById("displayName");
    const saveButton = document.getElementById("saveProfile");
    const saveMessage = document.getElementById("saveMessage");


    // Load saved profile
    const savedProfile =
        JSON.parse(localStorage.getItem("calorieProfile")) || {};


    if (savedProfile.fullName) {
        fullName.value = savedProfile.fullName;
        displayName.textContent = savedProfile.fullName;
    }

    if (savedProfile.email) {
        email.value = savedProfile.email;
    }

    if (savedProfile.age) {
        age.value = savedProfile.age;
    }

    if (savedProfile.gender) {
        gender.value = savedProfile.gender;
    }

    if (savedProfile.weight) {
        weight.value = savedProfile.weight;
    }

    if (savedProfile.height) {
        height.value = savedProfile.height;
    }

    if (savedProfile.calorieGoal) {
        calorieGoal.value = savedProfile.calorieGoal;
    }


    // Save Profile
    saveButton.addEventListener("click", function () {

        const profile = {

            fullName: fullName.value,

            email: email.value,

            age: age.value,

            gender: gender.value,

            weight: weight.value,

            height: height.value,

            calorieGoal: calorieGoal.value

        };


        localStorage.setItem(
            "calorieProfile",
            JSON.stringify(profile)
        );


        displayName.textContent =
            fullName.value || "Atiyah";


        saveMessage.textContent =
            "Profile saved successfully! ✓";


        setTimeout(function () {

            saveMessage.textContent = "";

        }, 3000);

    });

});