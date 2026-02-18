# views.py
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def current_user(request):
    return JsonResponse({
        'username': request.user.username,  # also email
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
    })