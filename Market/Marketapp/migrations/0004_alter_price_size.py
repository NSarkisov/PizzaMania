# Generated by Django 4.2.6 on 2023-10-31 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Marketapp', '0003_alter_dishesoptions_options_alter_dishes_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='price',
            name='size',
            field=models.CharField(blank=True, choices=[('Mаленькая', 'Mаленькая'), ('Средняя', 'Средняя'), ('Большая', 'Большая')], max_length=50, verbose_name='Размер'),
        ),
    ]
