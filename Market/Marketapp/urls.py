from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('pizza/', views.main_page, name='pizza'),
    path('lunch/', views.lunch, name='lunch'),
    path('wings/', views.wings, name='wings'),
    path('potato/', views.potato, name='potato'),
    path('bread/', views.bread, name='bread'),
    path('salads/', views.salads, name='salads'),
    path('deserts/', views.deserts, name='deserts'),
    path('drinks/', views.drinks, name='drinks'),
    path('sauce/', views.sauce, name='sauce'),
    path('card/', views.product_card, name='product_card'),
    path('cart/', views.cart, name='cart'),
    path('cartInfo/', views.cart_info, name='cartInfo'),

]
