from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Meal
import json


# =========================
# SIGN UP
# =========================

@csrf_exempt
def signup(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")


            # Check empty fields

            if not username or not email or not password:

                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all fields."
                })


            # Check username already exists

            if User.objects.filter(username=username).exists():

                return JsonResponse({
                    "success": False,
                    "message": "Username already exists."
                })


            # Check email already exists

            if User.objects.filter(email=email).exists():

                return JsonResponse({
                    "success": False,
                    "message": "Email already exists."
                })


            # Create user

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )


            # Login automatically

            login(request, user)


            return JsonResponse({
                "success": True,
                "message": "Account created successfully!",
                "username": user.username
            })


        except Exception as error:

            return JsonResponse({
                "success": False,
                "message": str(error)
            })


    return JsonResponse({
        "success": False,
        "message": "POST request required."
    })


# =========================
# LOGIN
# =========================

@csrf_exempt
def login_user(request):

    if request.method == "POST":

        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:

            user = User.objects.get(email=email)

            user = authenticate(
                username=user.username,
                password=password
            )

            if user is not None:

                login(request, user)

                return JsonResponse({
                    "success": True,
                    "username": user.username
                })

            else:

                return JsonResponse({
                    "success": False,
                    "message": "Invalid email or password."
                })

        except User.DoesNotExist:

            return JsonResponse({
                "success": False,
                "message": "Email not found."
            })

    return JsonResponse({
        "success": False,
        "message": "POST request required."
    })

# =========================
# ADD MEAL
# =========================

@csrf_exempt
def add_meal(request):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "POST request required."
        })


    # Check login

    if not request.user.is_authenticated:

        return JsonResponse({
            "success": False,
            "message": "Please login first."
        })


    try:

        data = json.loads(request.body)

        food_name = data.get("food_name")
        calories = data.get("calories")


        # Check data

        if not food_name or calories is None:

            return JsonResponse({
                "success": False,
                "message": "Food name and calories are required."
            })


        # Save meal

        meal = Meal.objects.create(

            user=request.user,

            food_name=food_name,

            calories=calories

        )


        return JsonResponse({

            "success": True,

            "message": "Meal saved successfully!",

            "meal": {

                "id": meal.id,

                "food_name": meal.food_name,

                "calories": meal.calories

            }

        })


    except Exception as error:

        return JsonResponse({

            "success": False,

            "message": str(error)

        })