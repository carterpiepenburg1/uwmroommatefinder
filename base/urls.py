from django.urls import path
from base import views

urlpatterns = [
    path('api/current_user/', views.current_user, name='current_user'),
]