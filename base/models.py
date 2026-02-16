from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

class Term(models.TextChoices):
    fall = 'F', 'Fall'
    spring = 'S', 'Spring'

class DormBuilding(models.TextChoices):
    cambridge = 'C', 'Cambridge Commons'
    riverview = 'R', 'Riverview'
    sandburgnsw = 'S1', 'Sandburg (N/S/W)'
    sandburge = 'S2', 'Sandburg (E)'

class RoomType(models.TextChoices):
    single = 'S', 'Single'
    double = 'D', 'Double'
    triple = 'T', 'Triple'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    #ADD ALL CUSTOM FIELDS HERE
    

    def __str__(self):
        return self.user.username

#Automatically creates profiles for new users
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

#Automatically saves profiles when you save User changes
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()