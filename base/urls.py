from django.urls import path
from base import views

urlpatterns = [
    path("", views.root_redirect, name="root_redirect"),
    path('api/current_user/', views.current_user, name='current_user'),
    path("api/me/", views.current_user, name="current_user"),
    path("api/logout/", views.logout_view, name="logout"),
<<<<<<< FernandoBranch
    path("api/chat/token/", views.get_firebase_token, name="chat_token"),
    path("api/chat/init/", views.initiate_conversation, name="chat_init"),
=======
    path('api/update_profile/', views.update_profile, name='update_profile'),
    path('api/programs/', views.get_programs, name='get_programs'),
>>>>>>> main
]