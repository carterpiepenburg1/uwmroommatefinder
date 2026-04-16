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

    # Send a few test match requests to the dev account
    try:
        me = User.objects.get(email='admeder@uwm.edu')
        senders = ['sarahj', 'ethanm', 'mayap']
        for username in senders:
            try:
                sender = User.objects.get(username=username)
                me.profile.incoming_requests.add(sender.profile)
                print(f"  test request: {username} → {me.username}")
            except User.DoesNotExist:
                pass
    except User.DoesNotExist:
        pass  # dev account not in DB, skip silently


if __name__ == '__main__':
    create_fake_users()
