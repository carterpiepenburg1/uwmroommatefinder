from django.urls import path
from base import views

urlpatterns = [
    path("", views.root_redirect, name="root_redirect"),
    path('api/current_user/', views.current_user, name='current_user'),
    path("api/me/", views.current_user, name="current_user"),
    path("api/logout/", views.logout_view, name="logout"),
    path("api/chat/token/", views.get_firebase_token, name="chat_token"),
    path("api/chat/init/", views.initiate_conversation, name="chat_init"),
    path('api/profile/update/', views.update_profile, name='update_profile'),
    path('api/preferences/update/', views.update_preferences, name='update_preferences'),
    path('api/profile/active/', views.toggle_active, name='toggle_active'),
    path('api/programs/', views.get_programs, name='get_programs'),
    path('api/matches/potential/', views.get_potential_matches, name='get_potential_matches'),
    path('api/notifications/', views.get_notifications, name='get_notifications'),
    path('api/match/request/<int:user_id>/', views.send_match_request, name='send_match_request'),
    path('api/match/accept/<int:user_id>/', views.accept_match_request, name='accept_match_request'),
    path('api/match/decline/<int:user_id>/', views.decline_match_request, name='decline_match_request'),
    path('api/checklist/', views.checklist, name='checklist'),
    path('api/group/', views.get_group, name='get_group'),
    path('api/group/leave/', views.leave_group, name='leave_group'),
    path('api/search/', views.search_users, name='search_users'),
    path('api/matches/filtered/', views.get_filtered_matches, name='get_filtered_matches'),
]