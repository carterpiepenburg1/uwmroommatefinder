from django import forms
from django.contrib import admin
from .models import Profile, Program
from django.contrib.admin.widgets import FilteredSelectMultiple

class ProfileAdminForm(forms.ModelForm):
    programs = forms.MultipleChoiceField(
        choices=Program.choices,
        widget=FilteredSelectMultiple("Programs", is_stacked=False),
        required=False
    )

    class Media:
        css = {'all': ('admin/css/widgets.css',)}
        js = ('/admin/jsi18n/',)

    class Meta:
        model = Profile
        fields = '__all__'

@admin.register(Profile)

class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm