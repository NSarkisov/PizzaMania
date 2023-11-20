import json
import math
from django.shortcuts import redirect
from django.http import HttpRequest
from django.shortcuts import render
from django.http import JsonResponse
from .models import *


def main_page(request):
    information = Dishes.objects.all().filter(category__name="Пицца")
    context = {"information": information}
    return render(request, 'Marketapp/pizza.html', context)


def lunch(request):
    information = Dishes.objects.all().filter(category__name="Ланч")
    context = {"information": information}
    return render(request, 'Marketapp/lunch.html', context)


def wings(request):
    information = Dishes.objects.all().filter(category__name="Курица")
    context = {"information": information}
    return render(request, 'Marketapp/wings.html', context)


def potato(request):
    information = Dishes.objects.all().filter(category__name="Картофель")
    context = {"information": information}
    return render(request, 'Marketapp/potato.html', context)


def bread(request):
    information = Dishes.objects.all().filter(category__name="Хлебцы")
    context = {"information": information}
    return render(request, 'Marketapp/bread.html', context)


def salads(request):
    information = Dishes.objects.all().filter(category__name="Салаты")
    context = {"information": information}
    return render(request, 'Marketapp/salads.html', context)


def deserts(request):
    information = Dishes.objects.all().filter(category__name="Десерты")
    context = {"information": information}
    return render(request, 'Marketapp/deserts.html', context)


def drinks(request):
    information = Dishes.objects.all().filter(category__name="Напитки")
    context = {"information": information}
    return render(request, 'Marketapp/drinks.html', context)


def sauce(request):
    information = Dishes.objects.all().filter(category__name="Соусы")
    context = {"information": information}
    return render(request, 'Marketapp/sauce.html', context)


def product_card(request):
    requestData = request.GET.get('requested_data', None)
    response_data = {}
    if requestData:
        requestDict = json.loads(requestData)
        name = requestDict['name']

        if requestDict['requesting'] == 'Options':
            size = requestDict['size']
            db_option = Dishes.objects.get(name=name)
            db_weight = Price.objects.get(name=name, size=size).weight
            print(db_weight)
            options_list = []
            for option in db_option.options.all():
                options_list.append(option.name)
            response_data = {
                'options': options_list
            }
        if requestDict['requesting'] == 'Price and Weight':
            size = requestDict['size']
            option_name = requestDict['option']
            db_price = Price.objects.get(name=name, size=size)
            db_option = DishesOptions.objects.get(name=option_name)
            weight = float(db_price.weight.split(' ')[0])
            if size != "Mаленькая":
                cost = str(round((db_price.cost + db_option.cost), 2)) + " руб."
                new_weight = str(int(weight - (math.floor(weight * (-db_option.weight_changes))))) + " гр"
                print("не маленькая")
                print(cost, new_weight)
            else:
                cost = str(round(db_price.cost, 2)) + " руб."
                new_weight = db_price.weight
                print("другие")
                print(cost, new_weight)
            response_data = {
                'cost': cost,
                'weight': new_weight
            }
        if requestDict['requesting'] == 'Description':
            db_description = Dishes.objects.get(name=name).description
            response_data = {
                'description': db_description
            }
    else:
        requestDict = {}
    return JsonResponse(response_data)


def cart(request):
    if request.method == 'POST':
        # Получение данных из запроса
        name = request.POST.get('name')
        size = request.POST.get('size')
        option = request.POST.get('option')

        if 'cart' not in request.session:
            request.session['cart'] = {}

        try:
            dish_id = Dishes.objects.get(name=name).id
            product_price = Price.objects.get(name=name, size=size).cost
            product_weight = Price.objects.get(name=name, size=size).weight
            option_price = DishesOptions.objects.get(name=option).cost
            total_cost = str(round((product_price + option_price), 2)) + " руб."
            product_data = {
                'id': dish_id,
                'name': name,
                'price': total_cost,
                'size': size,
                'option': option,
                'weight': product_weight,
            }
        except Dishes.DoesNotExist:
            response = {
                'status': 'error',
                'message': 'Продукт не найден.'
            }
            return JsonResponse(response, status=404)

        # Добавьте продукт в корзину в сессии
        cart = request.session['cart']
        cart[name] = product_data
        request.session['cart'] = cart
        print(cart)
        response = {
            'status': 'success',
            'message': 'Товар успешно добавлен в корзину.'
        }
        return JsonResponse(response)

    else:
        # Возвращаем ошибку, если метод запроса или AJAX-флаг не соответствуют ожидаемым значениям
        response = {
            'status': 'error',
            'message': 'Неверный метод запроса или AJAX-флаг не установлен.'
        }
        return JsonResponse(response, status=400)


def cart_info(request):
    cart_data = request.session.get('cart', {})
    return JsonResponse({'cart': cart_data})
