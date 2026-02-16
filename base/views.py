import datetime
from django.shortcuts import render
from django.http import HttpResponse

def home(request):

    current_user = request.user

    return render(
        request,
        'base/home.html',
        {
            'current_user': current_user
        }
    )
