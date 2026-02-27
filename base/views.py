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
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)
