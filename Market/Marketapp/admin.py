from django.contrib import admin
from .models import *
from .forms import *
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe


class CategoriesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


class PriceAdmin(admin.ModelAdmin):
    def get_link(self, obj):
        url = reverse('admin:Marketapp_price_change', args=[obj.id])
        return format_html('<a href="{}">{}</a>', url, obj.name)

    get_link.short_description = 'Имя'
    list_display = ("id", "get_link", "size", "cost", "weight")
    # form = PriceForm


class DishesAdmin(admin.ModelAdmin):

    def display_prices_field(self, obj):
        return ', '.join([str(item.size) + " : " + str(item.cost)
                          if item.size is not ""
                          else str(item.cost)
                          for item in obj.prices.all()])

    def display_options_field(self, obj):
        return ', '.join([str(item) for item in obj.options.all()])

    def get_thumbnail(self, obj):
        return format_html('<a href="{}" target="_blank"><img src="{}" width="50" height="50" /></a>',
                           obj.img.url, obj.img.url)

    def get_link(self, obj):
        url = reverse('admin:Marketapp_dishes_change', args=[obj.id])
        return format_html('<a href="{}">{}</a>', url, obj)

    get_link.short_description = 'Имя'
    get_thumbnail.short_description = 'Изображение'
    display_prices_field.short_description = "Размер и Цена"
    display_options_field.short_description = "Опции"
    list_display = ('id', 'category', 'get_link', 'get_thumbnail', "description", "display_prices_field",
                    "display_options_field")
    form = DishesForm


class DishesOptionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'cost', 'weight_changes')


class TablesAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'number_of_seats', 'availability')


class TableOccupationAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_table', 'start_time', 'end_time')


class EmployeesAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_category', 'name', 'surname', 'telephone', 'position')


class OrdersAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'orders_date', 'address', 'cost', 'payment_type', 'delivery_type')


class OrderListAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_order', 'id_dish', 'amount')


class ProductsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'amount', 'measure', 'unit_cost', 'expiring_date')


class IngredientsAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_dishes', 'id_product', 'amount', 'measure')


class DeliveriesToMarketAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_product', 'supplier', 'expires', 'amount', 'cost', 'status')


class UsersAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'telephone', 'email', 'birth_date')


class AdministratorsAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_user', 'access_level')


admin.site.register(Categories, CategoriesAdmin)
admin.site.register(Dishes, DishesAdmin)
admin.site.register(DishesOptions, DishesOptionsAdmin)
admin.site.register(Price, PriceAdmin)
admin.site.register(Tables, TablesAdmin)
admin.site.register(TableOccupation, TableOccupationAdmin)
admin.site.register(Employees, EmployeesAdmin)
admin.site.register(Orders, OrdersAdmin)
admin.site.register(OrderList, OrderListAdmin)
admin.site.register(Products, ProductsAdmin)
admin.site.register(Ingredients, IngredientsAdmin)
admin.site.register(DeliveriesToMarket, DeliveriesToMarketAdmin)
admin.site.register(Users, UsersAdmin)
admin.site.register(Administrators, AdministratorsAdmin)
