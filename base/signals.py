import random
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver


@receiver(user_logged_in)
def seed_notifications_on_first_login(sender, request, user, **kwargs):
    if request.session.get('notifications_seeded'):
        return

    from django.contrib.auth.models import User

    my_profile = user.profile

    # Pick 3 fake users who aren't in the same group and haven't already sent a request
    existing_sender_ids = set(my_profile.incoming_requests.values_list('user__pk', flat=True))
    candidates = User.objects.exclude(pk=user.pk).exclude(pk__in=existing_sender_ids)
    if my_profile.group:
        candidates = candidates.exclude(profile__group=my_profile.group)

    candidates = list(candidates.filter(profile__is_active=True))
    random.shuffle(candidates)
    senders = candidates[:3]

    for sender_user in senders:
        my_profile.incoming_requests.add(sender_user.profile)

    request.session['notifications_seeded'] = True
