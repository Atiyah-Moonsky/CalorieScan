from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Meal

import json
import os
import base64
import requests


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

            if not username or not email or not password:

                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all fields."
                })

            if User.objects.filter(username=username).exists():

                return JsonResponse({
                    "success": False,
                    "message": "Username already exists."
                })

            if User.objects.filter(email=email).exists():

                return JsonResponse({
                    "success": False,
                    "message": "Email already exists."
                })

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

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

    if not request.user.is_authenticated:

        return JsonResponse({
            "success": False,
            "message": "Please login first."
        })

    try:

        data = json.loads(request.body)

        food_name = data.get("food_name")
        calories = data.get("calories")

        if not food_name or calories is None:

            return JsonResponse({
                "success": False,
                "message": "Food name and calories are required."
            })

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


# =========================
# SCAN FOOD WITH ROBOFLOW
# =========================

@csrf_exempt
def scan_food(request):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "POST request required."
        })


    # =========================
    # CHECK LOGIN
    # =========================

    if not request.user.is_authenticated:

        return JsonResponse({
            "success": False,
            "message": "Please login first."
        })


    # =========================
    # GET IMAGE
    # =========================

    image = request.FILES.get("image")

    if not image:

        return JsonResponse({
            "success": False,
            "message": "Please upload an image."
        })


    # =========================
    # GET ROBOFLOW API KEY
    # =========================

    api_key = os.environ.get("ROBOFLOW_API_KEY")

    if not api_key:

        return JsonResponse({
            "success": False,
            "message": "Roboflow API key not found."
        })


    try:

        # =========================
        # READ IMAGE
        # =========================

        image_bytes = image.read()


        # =========================
        # CONVERT IMAGE TO BASE64
        # =========================

        image_base64 = base64.b64encode(
            image_bytes
        ).decode("utf-8")


        # =========================
        # ROBOFLOW WORKFLOW
        # =========================

        endpoint = (
            "https://serverless.roboflow.com/"
            "afifahs-workspace/"
            "workflows/"
            "foods-project-vfoods-project-pl16z-3-yolo11n-t1-logic"
        )


        # =========================
        # REQUEST DATA
        # =========================

        payload = {

            "api_key": api_key,

            "inputs": {

                "image": {

                    "type": "base64",

                    "value": image_base64

                }

            }

        }


        # =========================
        # SEND TO ROBOFLOW
        # =========================

        response = requests.post(

            endpoint,

            headers={
                "Content-Type": "application/json"
            },

            json=payload,

            timeout=60

        )


        # =========================
        # GET RESPONSE
        # =========================

        result = response.json()


        print("================================")
        print("🤖 ROBOFLOW RESPONSE")
        print(result)
        print("================================")


        # =========================
        # CHECK ROBOFLOW STATUS
        # =========================

        if response.status_code != 200:

            return JsonResponse({

                "success": False,

                "message": "Roboflow request failed.",

                "status_code": response.status_code,

                "roboflow": result

            })


        # =========================
        # GET PREDICTIONS
        # =========================

        predictions = (

            result[0]

            .get("predictions", {})

            .get("predictions", [])

        )


        # =========================
        # NO FOOD FOUND
        # =========================

        if not predictions:

            return JsonResponse({

                "success": False,

                "message": "No food detected."

            })


        # =========================
        # GET FIRST PREDICTION
        # =========================

        prediction = predictions[0]


        food_name = prediction.get(
            "class",
            "Unknown"
        )


        confidence = round(

            prediction.get(
                "confidence",
                0
            ) * 100,

            2

        )


        # =========================
        # CALORIES
        # =========================

        calories_map = {

            "Coffee": 5

        }


        calories = calories_map.get(

            food_name,

            0

        )


        # =========================
        # SEND RESULT TO FRONTEND
        # =========================

        return JsonResponse({

            "success": True,

            "food_name": food_name,

            "confidence": confidence,

            "calories": calories

        })


    except requests.exceptions.RequestException as error:

        print("❌ Roboflow connection error:")
        print(error)

        return JsonResponse({

            "success": False,

            "message": "Cannot connect to Roboflow.",

            "error": str(error)

        })


    except Exception as error:

        print("❌ Scan error:")
        print(error)

        return JsonResponse({

            "success": False,

            "message": str(error)

        })