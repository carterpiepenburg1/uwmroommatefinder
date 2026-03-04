from django.http import JsonResponse
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
import json
from .models import Profile, Program

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})

def root_redirect(request):
    """
    Decides where to send the user after a successful login.
    Admins go to the Django /admin/ panel.
    Students go to the React /dashboard/ page.
    """
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('/admin/')
    
    # For regular students, redirect to the React frontend dashboard
    return redirect('http://localhost:5173/dashboard')

def current_user(request):
    if request.user.is_authenticated:
        profile = request.user.profile

        # This creates a lookup table like: {"CS": "Computer Science", "NURSING": "Nursing"}
        program_dict = dict(Program.choices)

        # If it can't find a match for some reason, it just returns the raw key as a fallback
        programs_display = [program_dict.get(key, key) for key in profile.programs]

        return JsonResponse({
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            
            'is_profile_complete': profile.is_profile_complete,
            
            # --- RAW KEYS (For the forms to use as default values) ---
            'gender': profile.gender, 
            'standing': profile.standing,
            'term': profile.term,
            'dorm_building': profile.dorm_building,
            'room_type': profile.room_type,
            'programs': profile.programs,
            'preferences': profile.preferences,

            # --- DISPLAY NAMES (For the dashboard UI to print) ---
            'gender_display': profile.get_gender_display(), 
            'standing_display': profile.get_standing_display(),
            'term_display': profile.get_term_display(),
            'dorm_building_display': profile.get_dorm_building_display(),
            'room_type_display': profile.get_room_type_display(),
            
            'programs_display': programs_display,
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)

@csrf_exempt
def update_profile(request):
    if request.method == 'POST' and request.user.is_authenticated:
        # Unpack the JSON data React gave us
        data = json.loads(request.body)
        profile = request.user.profile

        # Update all the profile fields
        profile.gender = data.get('gender')
        profile.standing = data.get('standing')
        profile.term = data.get('term')
        profile.dorm_building = data.get('dorm_building')
        profile.room_type = data.get('room_type')
        profile.programs = data.get('programs', []) 
        profile.preferences = data.get('preferences', {})

        profile.is_profile_complete = True
        
        profile.save()

        return JsonResponse({"message": "Profile fully updated!"})
        
    return JsonResponse({"error": "Unauthorized or bad request"}, status=400)

def get_programs(request):
    # Program.choices automatically returns a list of tuples like:
    # [('CS', 'Computer Science'), ('ART', 'Art'), ...]
    
    # We convert that into a nice clean list of dictionaries for React
    program_list = [{"id": code, "name": label} for code, label in Program.choices]
    
    return JsonResponse({"programs": program_list})