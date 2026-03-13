import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uwmroommatefinder.settings')
django.setup()

from django.contrib.auth.models import User
from base.models import Profile, Group, Gender, Standing, Term, DormBuilding, RoomType, Program

def create_fake_users():
    dummy_data = [
        {
            "username": "sarahj",
            "email": "sarahj@uwm.edu",
            "first": "Sarah",
            "last": "Johnson",
            "gender": Gender.FEMALE,
            "standing": Standing.sophomore,
            "programs": [Program.BIOLOGICAL_SCI],
            "dorm": DormBuilding.sandburgnsw,
            "room": RoomType.double
        },
        {
            "username": "alexm",
            "email": "alexm@uwm.edu",
            "first": "Alex",
            "last": "Martinez",
            "gender": Gender.MALE,
            "standing": Standing.junior,
            "programs": [Program.ENGINEERING],
            "dorm": DormBuilding.cambridge,
            "room": RoomType.single
        },
        {
            "username": "chrisl",
            "email": "chrisl@uwm.edu",
            "first": "Chris",
            "last": "Lee",
            "gender": Gender.OTHER,
            "standing": Standing.senior,
            "programs": [Program.BUSINESS_ANALYTICS],
            "dorm": DormBuilding.riverview,
            "room": RoomType.double
        },
        {
            "username": "emilyr",
            "email": "emilyr@uwm.edu",
            "first": "Emily",
            "last": "Rodriguez",
            "gender": Gender.FEMALE,
            "standing": Standing.freshman,
            "programs": [Program.NURSING],
            "dorm": DormBuilding.sandburge,
            "room": RoomType.triple
        }
    ]

    count = 0
    for data in dummy_data:
        # Check if user already exists
        if User.objects.filter(username=data["username"]).exists():
            print(f"User {data['username']} already exists, skipping.")
            continue
            
        print(f"Creating user {data['username']}...")
        
        # 1. Create User
        # The signal create_user_profile automatically creates Profile and Group
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password="testpassword123",
            first_name=data["first"],
            last_name=data["last"]
        )
        
        # 2. Update the auto-created Profile
        profile = user.profile
        profile.gender = data["gender"]
        profile.standing = data["standing"]
        profile.programs = data["programs"]
        profile.dorm_building = data["dorm"]
        profile.room_type = data["room"]
        profile.is_profile_complete = True
        profile.save()
        
        count += 1
        
    print(f"\nSuccessfully created {count} fake users!")

if __name__ == '__main__':
    create_fake_users()
