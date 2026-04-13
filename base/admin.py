"""
  /admin/dashboard/                          — analytics dashboard (PostgreSQL + Firestore stats)
  /admin/firestore/                          — raw Firestore collection browser
  /admin/firestore/<collection>/             — list documents in a collection
  /admin/firestore/<collection>/<doc_id>/    — single document JSON detail
"""

import json
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.urls import path
from django.shortcuts import render
from django.db.models import Count
from .models import Profile, Group


# ---------------------------------------------------------------------------
# Custom AdminSite
# ---------------------------------------------------------------------------

class UWMAdminSite(admin.AdminSite):
    site_header = "UWM Roommate Finder — Admin"
    site_title  = "UWM Admin"
    index_title = "Database Management"

    def index(self, request, extra_context=None):
        from django.shortcuts import redirect
        return redirect("uwm_admin:admin_dashboard")

    def get_urls(self):
        custom_urls = [
            path(
                "dashboard/",
                self.admin_view(self.dashboard_view),
                name="admin_dashboard",
            ),
            path(
                "firestore/",
                self.admin_view(self.firestore_view),
                name="admin_firestore",
            ),
            path(
                "firestore/<str:collection>/",
                self.admin_view(self.firestore_collection),
                name="admin_firestore_collection",
            ),
        ]
        return custom_urls + super().get_urls()

    # ------------------------------------------------------------------
    # Dashboard view
    # ------------------------------------------------------------------
    def dashboard_view(self, request):
        # ---- PostgreSQL stats ----------------------------------------
        total_users       = User.objects.count()
        total_profiles    = Profile.objects.count()
        complete_profiles = Profile.objects.filter(is_profile_complete=True).count()
        active_profiles   = Profile.objects.filter(is_active=True).count()
        total_groups      = Group.objects.count()
        pending_requests  = Profile.objects.filter(
            incoming_requests__isnull=False
        ).distinct().count()

        # Gender distribution
        gender_qs = (
            Profile.objects
            .exclude(gender__isnull=True)
            .values("gender")
            .annotate(count=Count("id"))
        )
        gender_map    = {"M": "Male", "F": "Female", "O": "Other"}
        gender_labels = [gender_map.get(g["gender"], g["gender"]) for g in gender_qs]
        gender_data   = [g["count"] for g in gender_qs]

        # Standing distribution
        standing_qs = (
            Profile.objects
            .exclude(standing__isnull=True)
            .values("standing")
            .annotate(count=Count("id"))
        )
        standing_map    = {"FR": "Freshman", "SO": "Sophomore", "JR": "Junior", "SR": "Senior"}
        standing_labels = [standing_map.get(s["standing"], s["standing"]) for s in standing_qs]
        standing_data   = [s["count"] for s in standing_qs]

        # Dorm distribution
        dorm_qs = (
            Profile.objects
            .exclude(dorm_building__isnull=True)
            .values("dorm_building")
            .annotate(count=Count("id"))
        )
        dorm_map    = {"C": "Cambridge", "R": "Riverview", "S1": "Sandburg N/S/W", "S2": "Sandburg E"}
        dorm_labels = [dorm_map.get(d["dorm_building"], d["dorm_building"]) for d in dorm_qs]
        dorm_data   = [d["count"] for d in dorm_qs]

        # Term distribution
        term_qs = (
            Profile.objects
            .exclude(term__isnull=True)
            .values("term")
            .annotate(count=Count("id"))
        )
        term_map    = {"F": "Fall", "S": "Spring"}
        term_labels = [term_map.get(t["term"], t["term"]) for t in term_qs]
        term_data   = [t["count"] for t in term_qs]

        # ---- Firestore stats -----------------------------------------
        firestore_stats = {"conversations": 0, "messages": 0, "error": None}
        try:
            import firebase_admin
            if firebase_admin._apps:
                from firebase_admin import firestore as fb_store
                db = fb_store.client()
                convos = list(db.collection("conversations").stream())
                firestore_stats["conversations"] = len(convos)
                total_msg = 0
                for c in convos:
                    msgs = (
                        db.collection("conversations")
                        .document(c.id)
                        .collection("messages")
                        .stream()
                    )
                    total_msg += sum(1 for _ in msgs)
                firestore_stats["messages"] = total_msg
        except Exception as exc:
            firestore_stats["error"] = str(exc)

        context = dict(
            self.each_context(request),
            title="Analytics Dashboard",
            total_users=total_users,
            total_profiles=total_profiles,
            complete_profiles=complete_profiles,
            active_profiles=active_profiles,
            total_groups=total_groups,
            pending_requests=pending_requests,
            firestore_stats=firestore_stats,
            gender_labels=json.dumps(gender_labels),
            gender_data=json.dumps(gender_data),
            standing_labels=json.dumps(standing_labels),
            standing_data=json.dumps(standing_data),
            dorm_labels=json.dumps(dorm_labels),
            dorm_data=json.dumps(dorm_data),
            term_labels=json.dumps(term_labels),
            term_data=json.dumps(term_data),
        )
        return render(request, "admin/dashboard.html", context)

    # ------------------------------------------------------------------
    # Firestore browser – top-level collection list
    # ------------------------------------------------------------------
    def firestore_view(self, request):
        collections = []
        error = None
        try:
            import firebase_admin
            if firebase_admin._apps:
                from firebase_admin import firestore as fb_store
                db = fb_store.client()
                for col in db.collections():
                    doc_count = sum(1 for _ in col.stream())
                    collections.append({"id": col.id, "doc_count": doc_count})
            else:
                error = "Firebase not initialized (check GS_CREDENTIALS in .env)"
        except Exception as exc:
            error = str(exc)

        context = dict(
            self.each_context(request),
            title="Firestore Raw Browser",
            collections=collections,
            error=error,
        )
        return render(request, "admin/firestore_browser.html", context)

    # ------------------------------------------------------------------
    # Firestore browser – document list within a collection
    # ------------------------------------------------------------------
    def firestore_collection(self, request, collection):
        documents = []
        error = None
        try:
            import firebase_admin
            if firebase_admin._apps:
                from firebase_admin import firestore as fb_store
                db = fb_store.client()
                for doc in db.collection(collection).stream():
                    documents.append({
                        "id": doc.id,
                        "preview": json.dumps(doc.to_dict(), default=str)[:200],
                    })
        except Exception as exc:
            error = str(exc)

        context = dict(
            self.each_context(request),
            title=f"Firestore › {collection}",
            collection=collection,
            documents=documents,
            error=error,
        )
        return render(request, "admin/firestore_collection.html", context)

        context = dict(
            self.each_context(request),
            title=f"Firestore › {collection}",
            collection=collection,
            documents=documents,
            error=error,
        )
        return render(request, "admin/firestore_collection.html", context)


# ---------------------------------------------------------------------------
# Instantiate the custom admin site
# ---------------------------------------------------------------------------
uwm_admin_site = UWMAdminSite(name="uwm_admin")


# ---------------------------------------------------------------------------
# Model Admin classes
# ---------------------------------------------------------------------------

class GroupAdmin(admin.ModelAdmin):
    list_display  = ("id", "name", "member_count")
    search_fields = ("name",)
    ordering      = ("name",)

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = "Members"


class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user", "gender", "standing", "term",
        "dorm_building", "room_type",
        "is_profile_complete", "is_active", "group",
    )
    list_filter  = (
        "gender", "standing", "term", "dorm_building",
        "room_type", "is_profile_complete", "is_active",
    )
    search_fields = (
        "user__username", "user__email",
        "user__first_name", "user__last_name",
    )
    ordering      = ("user__username",)
    readonly_fields = ("user",)

    fieldsets = (
        ("Identity",    {"fields": ("user", "gender", "standing", "term")}),
        ("Housing",     {"fields": ("dorm_building", "room_type")}),
        ("Programs",    {"fields": ("programs",)}),
        ("Preferences", {"fields": (
            "noise_level",       "noise_level_priority",
            "cleanliness",       "cleanliness_priority",
            "sleep_habits",      "sleep_habits_priority",
            "social_level",      "social_level_priority",
            "guest_policy",      "guest_policy_priority",
            "alcohol_policy",    "alcohol_policy_priority",
            "shared_belongings", "shared_belongings_priority",
        )}),
        ("Status",  {"fields": ("is_profile_complete", "is_active", "group")}),
        ("Roommate Requests", {"fields": ("incoming_requests",)}),
    )


# ---------------------------------------------------------------------------
# Register models on the custom site (no decorators to avoid import-time issues)
# ---------------------------------------------------------------------------
uwm_admin_site.register(Group,   GroupAdmin)
uwm_admin_site.register(Profile, ProfileAdmin)
uwm_admin_site.register(User,    BaseUserAdmin)