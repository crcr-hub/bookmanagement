# Generated by Django 5.2.1 on 2025-06-10 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0004_alter_books_nopage'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
