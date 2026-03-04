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
        return JsonResponse({
            'id': request.user.pk,
            'username': request.user.username,
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
