import os
import django
import json
from datetime import datetime

# 1. Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uwmroommatefinder.settings')
django.setup()

from django.contrib.auth.models import User
from base.models import GroupLike, Group, Profile
from firebase_admin import firestore

def reset_and_simulate():
    print("--- Starting Reset & Simulation ---")
    
    # 2. Cleanup Django Matches
    print("Cleaning up Django GroupLikes...")
    GroupLike.objects.all().delete()
    
    # 3. Cleanup Firebase Conversations
    print("Cleaning up Firebase Conversations...")
    db = firestore.client()
    convos_ref = db.collection("conversations")
    docs = convos_ref.stream()
    deleted_count = 0
    for doc in docs:
        doc.reference.delete()
        deleted_count += 1
    print(f"Deleted {deleted_count} conversation(s) from Firestore.")

    # 4. Define Users
    try:
        rodrigo = User.objects.get(email='rodr2327@uwm.edu')
        alex = User.objects.get(username='alexm')
        sarah = User.objects.get(username='sarahj')
        
        rg = rodrigo.profile.group
        ag = alex.profile.group
        sg = sarah.profile.group
        
        print(f"Users found: {rodrigo.username}, {alex.username}, {sarah.username}")

        # 5. Simulation: Alex and Sarah match
        print("Simulating match: Alex & Sarah...")
        GroupLike.objects.get_or_create(liker=ag, liked=sg)
        GroupLike.objects.get_or_create(liker=sg, liked=ag)
        
        # Create Firebase conversation for Alex & Sarah
        all_uids = sorted([str(alex.pk), str(sarah.pk)])
        convo_id = "_".join(all_uids)
        participant_names = {
            str(alex.pk): f"{alex.first_name} {alex.last_name}".strip(),
            str(sarah.pk): f"{sarah.first_name} {sarah.last_name}".strip()
        }
        
        convos_ref.document(convo_id).set({
            "participants": all_uids,
            "participantNames": participant_names,
            "type": "direct",
            "createdAt": firestore.SERVER_TIMESTAMP,
            "lastMessage": None,
        })
        print("Match created: Alex & Sarah matched and conversation established.")

        # 6. Simulation: Alex likes Rodrigo (but Rodrigo hasn't liked back yet)
        print("Simulating: Alex likes Rodrigo...")
        GroupLike.objects.get_or_create(liker=ag, liked=rg)
        print("Success: Alex Martinez now likes you.")

    except User.DoesNotExist as e:
        print(f"Error: One or more target users not found. Ensure fake users are created first. ({e})")
    except Exception as e:
        print(f"Error during simulation: {e}")

if __name__ == '__main__':
    reset_and_simulate()
