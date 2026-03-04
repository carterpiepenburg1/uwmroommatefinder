from django.db import migrations


def set_site_domain(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.update_or_create(
        id=1,
        defaults={'domain': 'localhost:8000', 'name': 'localhost:8000'},
    )


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_group_profile_group'),
        ('sites', '0002_alter_domain_unique'),
    ]

    operations = [
        migrations.RunPython(set_site_domain, migrations.RunPython.noop),
    ]
