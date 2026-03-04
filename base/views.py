from django.http import JsonResponse
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})


def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'username': request.user.username,  # also email
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'gender': request.user.profile.get_gender_display(),
            'standing': request.user.profile.get_standing_display(),
            'dorm_building': request.user.profile.get_dorm_building_display(),
            'room_type': request.user.profile.get_room_type_display(),
            'preferences': request.user.profile.preferences,
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)
