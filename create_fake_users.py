import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uwmroommatefinder.settings')
django.setup()

from django.contrib.auth.models import User
from base.models import (
    Gender, Standing, Term, DormBuilding, RoomType, Program,
    NoiseLevel, Cleanliness, SleepHabits, SocialLevel, GuestPolicy,
    AlcoholPolicy, SharedBelongings,
)

# Seeded so you get the same users every run
rng = random.Random(42)

USERS = [
    ("sarahj",    "Sarah",    "Johnson",    "sarahj@uwm.edu"),
    ("alexm",     "Alex",     "Martinez",   "alexm@uwm.edu"),
    ("chrisl",    "Chris",    "Lee",        "chrisl@uwm.edu"),
    ("emilyr",    "Emily",    "Rodriguez",  "emilyr@uwm.edu"),
    ("jakew",     "Jake",     "Wilson",     "jakeW@uwm.edu"),
    ("taylorb",   "Taylor",   "Brown",      "taylorb@uwm.edu"),
    ("jordanc",   "Jordan",   "Clark",      "jordanc@uwm.edu"),
    ("morganf",   "Morgan",   "Foster",     "morganf@uwm.edu"),
    ("rileyn",    "Riley",    "Nelson",     "rileyn@uwm.edu"),
    ("caseyp",    "Casey",    "Parker",     "caseyp@uwm.edu"),
    ("devonk",    "Devon",    "King",       "devonk@uwm.edu"),
    ("skylarh",   "Skylar",   "Hall",       "skylarh@uwm.edu"),
    ("quincya",   "Quincy",   "Adams",      "quincya@uwm.edu"),
    ("brookst",   "Brooks",   "Turner",     "brookst@uwm.edu"),
    ("peytong",   "Peyton",   "Green",      "peytong@uwm.edu"),
    ("averyw",    "Avery",    "White",      "averyw@uwm.edu"),
    ("reedm",     "Reed",     "Mitchell",   "reedm@uwm.edu"),
    ("blakec",    "Blake",    "Campbell",   "blakec@uwm.edu"),
    ("harperj",   "Harper",   "James",      "harperj@uwm.edu"),
    ("finnob",    "Finn",     "O'Brien",    "finnob@uwm.edu"),
    ("norahv",    "Norah",    "Vasquez",    "norahv@uwm.edu"),
    ("coopd",     "Cooper",   "Davis",      "coopd@uwm.edu"),
    ("lenas",     "Lena",     "Scott",      "lenas@uwm.edu"),
    ("marcot",    "Marco",    "Torres",     "marcot@uwm.edu"),
    ("ellier",    "Ellie",    "Reyes",      "ellier@uwm.edu"),
    ("tylerh",    "Tyler",    "Harris",     "tylerh@uwm.edu"),
    ("zoew",      "Zoe",      "Walker",     "zoew@uwm.edu"),
    ("aaronb",    "Aaron",    "Baker",      "aaronb@uwm.edu"),
    ("clairan",   "Claire",   "Anderson",   "clairan@uwm.edu"),
    ("ethanm",    "Ethan",    "Moore",      "ethanm@uwm.edu"),
    ("isabelt",   "Isabel",   "Thomas",     "isabelt@uwm.edu"),
    ("lukej",     "Luke",     "Jackson",    "lukej@uwm.edu"),
    ("sophiax",   "Sophia",   "Xu",         "sophiax@uwm.edu"),
    ("owenr",     "Owen",     "Roberts",    "owenr@uwm.edu"),
    ("mayap",     "Maya",     "Patel",      "mayap@uwm.edu"),
    ("calebn",    "Caleb",    "Nguyen",     "calebn@uwm.edu"),
    ("annal",     "Anna",     "Lewis",      "annal@uwm.edu"),
    ("connork",   "Connor",   "Kim",        "connork@uwm.edu"),
    ("oliviac",   "Olivia",   "Carter",     "oliviac@uwm.edu"),
    ("loganp",    "Logan",    "Phillips",   "loganp@uwm.edu"),
    ("auroraa",   "Aurora",   "Allen",      "auroraa@uwm.edu"),
    ("samuelg",   "Samuel",   "Gonzalez",   "samuelg@uwm.edu"),
    ("nataliem",  "Natalie",  "Murphy",     "nataliem@uwm.edu"),
    ("braydenr",  "Brayden",  "Rivera",     "braydenr@uwm.edu"),
    ("hannahc",   "Hannah",   "Collins",    "hannahc@uwm.edu"),
    ("milesd",    "Miles",    "Diaz",       "milesd@uwm.edu"),
    ("stellae",   "Stella",   "Evans",      "stellae@uwm.edu"),
    ("adamh",     "Adam",     "Hughes",     "adamh@uwm.edu"),
    ("gracep",    "Grace",    "Price",      "gracep@uwm.edu"),
    ("nathanb",   "Nathan",   "Bell",       "nathanb@uwm.edu"),
]

# Spread across dorms — weight toward Sandburg since it's the biggest
DORMS = (
    [DormBuilding.sandburgnsw] * 18 +
    [DormBuilding.sandburge]   * 12 +
    [DormBuilding.cambridge]   * 10 +
    [DormBuilding.riverview]   * 10
)

GENDERS   = [Gender.MALE, Gender.MALE, Gender.FEMALE, Gender.FEMALE, Gender.OTHER]
STANDINGS = [Standing.freshman, Standing.sophomore, Standing.junior, Standing.senior]
TERMS     = [Term.fall, Term.fall, Term.fall, Term.spring]  # mostly fall
ROOMS     = [RoomType.single, RoomType.double, RoomType.double, RoomType.triple]
PROGRAMS  = [
    Program.COMPUTER_SCIENCE, Program.NURSING, Program.ENGINEERING,
    Program.BUSINESS_ANALYTICS, Program.PSYCHOLOGY, Program.BIOLOGICAL_SCI,
    Program.MARKETING, Program.CRIMINAL_JUSTICE, Program.COMMUNICATION,
    Program.MECHANICAL_ENG, Program.DATA_SCIENCE, Program.EDUCATION,
]


def rand_pref(choices):
    return rng.choice([c[0] for c in choices])


def create_fake_users():
    rng.shuffle(DORMS)  # shuffle so assignment isn't perfectly ordered

    created = 0
    skipped = 0

    for i, (username, first, last, email) in enumerate(USERS):
        if User.objects.filter(username=username).exists():
            print(f"  skip  {username} (already exists)")
            skipped += 1
            continue

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password="testpassword123",
                first_name=first,
                last_name=last,
            )
        except Exception:
            print(f"  skip  {username} (already exists)")
            skipped += 1
            continue

        profile = user.profile
        profile.gender       = rng.choice(GENDERS)
        profile.standing     = rng.choice(STANDINGS)
        profile.term         = rng.choice(TERMS)
        profile.dorm_building = DORMS[i % len(DORMS)]
        profile.room_type    = rng.choice(ROOMS)
        profile.programs     = [rng.choice(PROGRAMS)]

        profile.noise_level       = rand_pref(NoiseLevel.choices)
        profile.cleanliness       = rand_pref(Cleanliness.choices)
        profile.sleep_habits      = rand_pref(SleepHabits.choices)
        profile.social_level      = rand_pref(SocialLevel.choices)
        profile.guest_policy      = rand_pref(GuestPolicy.choices)
        profile.alcohol_policy    = rand_pref(AlcoholPolicy.choices)
        profile.shared_belongings = rand_pref(SharedBelongings.choices)

        # ~25% chance any given field is marked as a priority
        profile.noise_level_priority       = rng.random() < 0.25
        profile.cleanliness_priority       = rng.random() < 0.25
        profile.sleep_habits_priority      = rng.random() < 0.25
        profile.social_level_priority      = rng.random() < 0.25
        profile.guest_policy_priority      = rng.random() < 0.25
        profile.alcohol_policy_priority    = rng.random() < 0.25
        profile.shared_belongings_priority = rng.random() < 0.25

        profile.is_profile_complete = True
        profile.is_active = True
        profile.save()

        print(f"  created {first} {last} ({profile.get_dorm_building_display()}, {profile.get_term_display()})")
        created += 1

    print(f"\nDone — {created} created, {skipped} skipped.")

    # Patch the 5 Riverview Spring male users so they appear in the dev account's Explore & Connect
    riverview_spring_males = ['quincya', 'peytong', 'reedm', 'blakec', 'finnob']
    for username in riverview_spring_males:
        try:
            u = User.objects.get(username=username)
            u.profile.term = Term.spring
            u.profile.dorm_building = DormBuilding.riverview
            u.profile.gender = Gender.MALE
            u.profile.save()
            print(f"  patched {username} -> Spring / Riverview / Male")
        except User.DoesNotExist:
            pass

    # Add checklists to the users who send match requests (they'll appear in Your Group)
    CHECKLISTS = {
        'sarahj': [
            {"id": 1, "text": "Bedding & pillow", "checked": True},
            {"id": 2, "text": "Shower caddy & flip flops", "checked": True},
            {"id": 3, "text": "Desk lamp", "checked": False},
            {"id": 4, "text": "Power strip", "checked": True},
            {"id": 5, "text": "Laundry basket & detergent", "checked": False},
            {"id": 6, "text": "Mini fridge", "checked": False},
        ],
        'ethanm': [
            {"id": 1, "text": "Bedding set (twin XL)", "checked": True},
            {"id": 2, "text": "Laptop & charger", "checked": True},
            {"id": 3, "text": "Shower supplies", "checked": True},
            {"id": 4, "text": "Hangers", "checked": False},
            {"id": 5, "text": "Fan", "checked": False},
            {"id": 6, "text": "Headphones", "checked": True},
            {"id": 7, "text": "First aid kit", "checked": False},
        ],
        'mayap': [
            {"id": 1, "text": "Towels (2)", "checked": True},
            {"id": 2, "text": "Bed risers", "checked": False},
            {"id": 3, "text": "Command strips", "checked": True},
            {"id": 4, "text": "Reusable water bottle", "checked": True},
            {"id": 5, "text": "School supplies", "checked": True},
            {"id": 6, "text": "Ethernet cable", "checked": False},
        ],
        # Also give checklists to the Riverview users visible in Explore & Connect
        'quincya': [
            {"id": 1, "text": "Bedding (twin XL)", "checked": True},
            {"id": 2, "text": "Microwave", "checked": False},
            {"id": 3, "text": "Shower caddy", "checked": True},
            {"id": 4, "text": "Storage bins", "checked": False},
        ],
        'peytong': [
            {"id": 1, "text": "Pillow & blanket", "checked": True},
            {"id": 2, "text": "Desk lamp", "checked": True},
            {"id": 3, "text": "Power strip (surge protected)", "checked": True},
            {"id": 4, "text": "Mini fridge", "checked": False},
            {"id": 5, "text": "Hangers", "checked": False},
        ],
        'reedm': [
            {"id": 1, "text": "Twin XL sheets", "checked": True},
            {"id": 2, "text": "Toiletries", "checked": True},
            {"id": 3, "text": "Laundry supplies", "checked": False},
            {"id": 4, "text": "Fan", "checked": False},
        ],
        'blakec': [
            {"id": 1, "text": "Bedding", "checked": True},
            {"id": 2, "text": "Laptop stand", "checked": True},
            {"id": 3, "text": "Shower shoes", "checked": True},
            {"id": 4, "text": "Command hooks", "checked": False},
            {"id": 5, "text": "Surge protector", "checked": False},
        ],
        'finnob': [
            {"id": 1, "text": "Mattress topper", "checked": False},
            {"id": 2, "text": "Towels", "checked": True},
            {"id": 3, "text": "Study lamp", "checked": True},
            {"id": 4, "text": "Bluetooth speaker", "checked": True},
            {"id": 5, "text": "Trash can", "checked": False},
        ],
    }

    for username, items in CHECKLISTS.items():
        try:
            u = User.objects.get(username=username)
            u.profile.checklist = items
            u.profile.save()
            print(f"  checklist set for {username} ({len(items)} items)")
        except User.DoesNotExist:
            pass

    # Send a few test match requests to the dev account
    try:
        me = User.objects.get(email='admeder@uwm.edu')
        senders = ['sarahj', 'ethanm', 'mayap']
        for username in senders:
            try:
                sender = User.objects.get(username=username)
                me.profile.incoming_requests.add(sender.profile)
                print(f"  test request: {username} -> {me.username}")
            except User.DoesNotExist:
                pass
    except User.DoesNotExist:
        print("\n  NOTE: Dev account (admeder@uwm.edu) not found — log in first, then re-run.")


if __name__ == '__main__':
    create_fake_users()
