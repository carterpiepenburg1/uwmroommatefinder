import json
from django.http import JsonResponse
from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
import firebase_admin
import firebase_admin.auth as fb_auth
from firebase_admin import firestore
import datetime

import json
from .models import Profile, Program, NoiseLevel, Cleanliness, SleepHabits, SocialLevel, GuestPolicy, AlcoholPolicy, SharedBelongings

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
    return redirect('http://localhost:5173/dashboard')

def current_user(request):
    if request.user.is_authenticated:
        profile = request.user.profile

        # This creates a lookup table like: {"CS": "Computer Science", "NURSING": "Nursing"}
        program_dict = dict(Program.choices)

        # If it can't find a match for some reason, it just returns the raw key as a fallback
        programs_display = [program_dict.get(key, key) for key in profile.programs]

        return JsonResponse({
            'id': request.user.pk,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            
            'is_profile_complete': profile.is_profile_complete,
            'is_active': profile.is_active,
            'is_preferences_complete': all(
                getattr(profile, f) is not None
                for f in ['noise_level', 'cleanliness', 'sleep_habits', 'social_level', 'guest_policy', 'alcohol_policy', 'shared_belongings']
            ),
            
            # --- RAW KEYS (For the forms to use as default values) ---
            'gender': profile.gender, 
            'standing': profile.standing,
            'term': profile.term,
            'dorm_building': profile.dorm_building,
            'room_type': profile.room_type,
            'programs': profile.programs,

            # --- DISPLAY NAMES (For the dashboard UI to print) ---
            'gender_display': profile.get_gender_display(),
            'standing_display': profile.get_standing_display(),
            'term_display': profile.get_term_display(),
            'dorm_building_display': profile.get_dorm_building_display(),
            'room_type_display': profile.get_room_type_display(),

            'programs_display': programs_display,

            # --- PREFERENCE RAW VALUES (for the form) ---
            'noise_level': profile.noise_level,
            'cleanliness': profile.cleanliness,
            'sleep_habits': profile.sleep_habits,
            'social_level': profile.social_level,
            'guest_policy': profile.guest_policy,
            'alcohol_policy': profile.alcohol_policy,
            'shared_belongings': profile.shared_belongings,

            'noise_level_priority': profile.noise_level_priority,
            'cleanliness_priority': profile.cleanliness_priority,
            'sleep_habits_priority': profile.sleep_habits_priority,
            'social_level_priority': profile.social_level_priority,
            'guest_policy_priority': profile.guest_policy_priority,
            'alcohol_policy_priority': profile.alcohol_policy_priority,
            'shared_belongings_priority': profile.shared_belongings_priority,

            # --- PREFERENCE DISPLAY NAMES (for the profile card) ---
            'noise_level_display': profile.get_noise_level_display(),
            'cleanliness_display': profile.get_cleanliness_display(),
            'sleep_habits_display': profile.get_sleep_habits_display(),
            'social_level_display': profile.get_social_level_display(),
            'guest_policy_display': profile.get_guest_policy_display(),
            'alcohol_policy_display': profile.get_alcohol_policy_display(),
            'shared_belongings_display': profile.get_shared_belongings_display(),
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)


def get_firebase_token(request):
    """
    Returns a Firebase Custom Token for the currently logged-in Django user.
    The React frontend uses this token to call signInWithCustomToken() so it
    can access Firestore without a second login prompt.
    The uid we embed is the string version of the Django user pk.
    """
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    uid = str(request.user.pk)
    # Additional claims stored on the Firebase token (readable in security rules)
    additional_claims = {
        "email": request.user.email,
        "name": f"{request.user.first_name} {request.user.last_name}".strip(),
    }
    token = fb_auth.create_custom_token(uid, additional_claims)
    # create_custom_token returns bytes; decode to string for JSON serialisation
    return JsonResponse({"token": token.decode("utf-8")})


@csrf_exempt
def initiate_conversation(request):
    """
    POST { participant_ids: [django_user_pk_2, ...] }
    Creates (or reuses) a Firestore conversation document and returns
    { conversationId }.
    For 1-on-1 chats the composite id is "uid1_uid2" (sorted) so duplicate
    conversations are never created.
    """
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        body = json.loads(request.body)
        participant_ids = body.get("participant_ids", [])
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not participant_ids:
        return JsonResponse({"error": "participant_ids required"}, status=400)

    # Build full participant list including the current user
    all_uids = sorted({str(request.user.pk)} | {str(p) for p in participant_ids})
    is_direct = len(all_uids) == 2
    convo_type = "direct" if is_direct else "group"

    # Deterministic id for direct chats prevents duplicate conversations
    convo_id = "_".join(all_uids) if is_direct else None

    # Resolve display names from Django User model
    user_objs = User.objects.filter(pk__in=[int(u) for u in all_uids])
    participant_names = {
        str(u.pk): f"{u.first_name} {u.last_name}".strip() or u.username
        for u in user_objs
    }

    db = firestore.client()
    convos_ref = db.collection("conversations")

    if convo_id:
        doc_ref = convos_ref.document(convo_id)
        doc = doc_ref.get()
        if not doc.exists:
            doc_ref.set({
                "participants": all_uids,
                "participantNames": participant_names,
                "type": convo_type,
                "createdAt": firestore.SERVER_TIMESTAMP,
                "lastMessage": None,
            })
    else:
        # Group chats get an auto-generated id
        doc_ref = convos_ref.add({
            "participants": all_uids,
            "participantNames": participant_names,
            "type": convo_type,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "lastMessage": None,
        })[1]
        convo_id = doc_ref.id

    return JsonResponse({"conversationId": convo_id})
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

@csrf_exempt
def update_preferences(request):
    if request.method != 'POST' or not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized or bad request"}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    profile = request.user.profile

    def parse_int(val):
        if val is None or val == '':
            return None
        return int(val)

    profile.noise_level       = parse_int(data.get('noise_level'))
    profile.cleanliness       = parse_int(data.get('cleanliness'))
    profile.sleep_habits      = parse_int(data.get('sleep_habits'))
    profile.social_level      = parse_int(data.get('social_level'))
    profile.guest_policy      = parse_int(data.get('guest_policy'))
    profile.alcohol_policy    = parse_int(data.get('alcohol_policy'))
    profile.shared_belongings = parse_int(data.get('shared_belongings'))

    profile.noise_level_priority       = bool(data.get('noise_level_priority', False))
    profile.cleanliness_priority       = bool(data.get('cleanliness_priority', False))
    profile.sleep_habits_priority      = bool(data.get('sleep_habits_priority', False))
    profile.social_level_priority      = bool(data.get('social_level_priority', False))
    profile.guest_policy_priority      = bool(data.get('guest_policy_priority', False))
    profile.alcohol_policy_priority    = bool(data.get('alcohol_policy_priority', False))
    profile.shared_belongings_priority = bool(data.get('shared_belongings_priority', False))

    profile.save()
    return JsonResponse({"message": "Preferences updated!"})


@csrf_exempt
def toggle_active(request):
    if request.method != 'POST' or not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized or bad request"}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    profile = request.user.profile
    profile.is_active = bool(data.get('is_active', True))
    profile.save()
    return JsonResponse({"is_active": profile.is_active})


def get_programs(request):
    # Program.choices automatically returns a list of tuples like:
    # [('CS', 'Computer Science'), ('ART', 'Art'), ...]
    
    # We convert that into a nice clean list of dictionaries for React
    program_list = [{"id": code, "name": label} for code, label in Program.choices]
    
    return JsonResponse({"programs": program_list})

PREF_FIELDS = [
    'noise_level', 'cleanliness', 'sleep_habits',
    'social_level', 'guest_policy', 'alcohol_policy', 'shared_belongings',
]

def compute_compatibility(my_profile, their_profile):
    """
    Returns a 0–100 compatibility score (higher = better match).
    Uses the current user's priority flags to weight each field.
    Missing values default to 1 (the middle option).
    """
    raw = 0
    max_possible = 0
    for field in PREF_FIELDS:
        my_val    = getattr(my_profile, field)
        their_val = getattr(their_profile, field)
        my_val    = my_val    if my_val    is not None else 1
        their_val = their_val if their_val is not None else 1
        weight = 5 if getattr(my_profile, f'{field}_priority') else 1
        raw          += weight * abs(my_val - their_val)
        max_possible += weight * 2  # max possible difference per field is 2
    return round((1 - raw / max_possible) * 100)


@csrf_exempt
def get_potential_matches(request):
    """
    Returns individual users sorted by compatibility score.
    Filters: is_active, same term, same dorm, compatible gender.
    """
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    my_profile = request.user.profile

    candidates = Profile.objects.filter(is_active=True).exclude(user=request.user)

    # Hard filter: same term
    if my_profile.term:
        candidates = candidates.filter(term=my_profile.term)

    # Hard filter: same dorm building
    if my_profile.dorm_building:
        candidates = candidates.filter(dorm_building=my_profile.dorm_building)

    # Hard filter: gender
    # O sees everyone, M sees M+O, F sees F+O
    if my_profile.gender == 'M':
        candidates = candidates.filter(gender__in=['M', 'O'])
    elif my_profile.gender == 'F':
        candidates = candidates.filter(gender__in=['F', 'O'])
    # 'O' users see everyone — no filter applied

    program_dict = dict(Program.choices)
    matches = []
    for profile in candidates:
        score = compute_compatibility(my_profile, profile)
        u = profile.user
        matches.append({
            "id": u.pk,
            "name": f"{u.first_name} {u.last_name}".strip() or u.username,
            "gender": profile.get_gender_display(),
            "standing": profile.get_standing_display(),
            "term": profile.get_term_display(),
            "dorm_building": profile.get_dorm_building_display(),
            "room_type": profile.get_room_type_display(),
            "programs": [program_dict.get(p, p) for p in profile.programs],
            "noise_level_display": profile.get_noise_level_display(),
            "cleanliness_display": profile.get_cleanliness_display(),
            "sleep_habits_display": profile.get_sleep_habits_display(),
            "social_level_display": profile.get_social_level_display(),
            "guest_policy_display": profile.get_guest_policy_display(),
            "alcohol_policy_display": profile.get_alcohol_policy_display(),
            "shared_belongings_display": profile.get_shared_belongings_display(),
            "noise_level_priority": profile.noise_level_priority,
            "cleanliness_priority": profile.cleanliness_priority,
            "sleep_habits_priority": profile.sleep_habits_priority,
            "social_level_priority": profile.social_level_priority,
            "guest_policy_priority": profile.guest_policy_priority,
            "alcohol_policy_priority": profile.alcohol_policy_priority,
            "shared_belongings_priority": profile.shared_belongings_priority,
            "compatibility_score": score,
        })

    matches.sort(key=lambda m: m["compatibility_score"], reverse=True)
    return JsonResponse({"matches": matches})
