from django import forms
from django.contrib.admin.widgets import FilteredSelectMultiple
from .models import *


class DishesForm(forms.ModelForm):
    class Meta:
        model = Dishes
        fields = '__all__'
        widgets = {
            'prices': FilteredSelectMultiple('Цены и размеры', is_stacked=False),
            'options': FilteredSelectMultiple('Опции', is_stacked=False),
        }


# class PriceForm(forms.ModelForm):
#     class Meta:
#         model = Price
#         fields = '__all__'
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         used_items = Price.objects.values_list('name', flat=True)
#         print(used_items)
#         for item in used_items:
#             self.fields['name'].queryset = self.fields['name'].queryset.exclude(name=item)
