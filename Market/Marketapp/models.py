from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Categories(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("Название", max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class Price(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.ForeignKey("Dishes", on_delete=models.SET_DEFAULT, verbose_name="Имя",
                             default=None, null=True, blank=True, to_field="name")
    SIZES = (('Mаленькая', 'Mаленькая'), ('Средняя', 'Средняя'), ('Большая', 'Большая'),)
    size = models.CharField("Размер", max_length=50, blank=True, choices=SIZES)
    cost = models.FloatField("Цена", blank=True)
    weight = models.CharField("Вес", max_length=50, blank=True)

    def __str__(self):
        if str(self.size) == "":
            return str(self.name) + " : " + str(self.cost)
        else:
            return str(self.name) + " : " + str(self.size) + ", " + str(self.cost)

    class Meta:
        verbose_name = "Цена и размер"
        verbose_name_plural = "Цены и размеры"
        ordering = ['id']


class DishesOptions(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("Имя", max_length=50, blank=True)
    cost = models.FloatField("Цена", blank=True, null=True)
    weight_changes = models.FloatField("Изменение веса в %", blank=True, null=True)

    def __str__(self):
        return str(self.name) + " : " + str(self.cost)

    class Meta:
        verbose_name = "Опция"
        verbose_name_plural = "Опции"


class Dishes(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.ForeignKey("Categories", on_delete=models.SET_DEFAULT, verbose_name="Категория",
                                 default=None, null=True, blank=True)
    name = models.CharField("Имя", max_length=50, blank=True, unique=True)
    img = models.ImageField("Изображение", upload_to='uploads', blank=True)
    options = models.ManyToManyField(DishesOptions, verbose_name="Опции", blank=True)
    description = models.TextField("Описание", blank=True)
    prices = models.ManyToManyField(Price, verbose_name="Цены/Размеры", blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Блюдо"
        verbose_name_plural = "Блюда"
        ordering = ['id']


@receiver(post_save, sender=Price)
def update_dishes_prices(sender, instance, created, **kwargs):
    if created:
        dishes = (Dishes.objects.filter(name=instance.name))  # Получаем все объекты модели Dishes
        for dish in dishes:
            dish.prices.add(instance)


class Tables(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.PositiveIntegerField("Номер")
    number_of_seats = models.PositiveIntegerField("Количество мест")
    availability_STATUS = (('A', 'Доступен'),
                           ('B', 'Забронирован'),)
    availability = models.CharField('Доступность', max_length=1, choices=availability_STATUS, blank=True)

    def __str__(self):
        return str(self.number)

    class Meta:
        verbose_name = "Стол"
        verbose_name_plural = "Столы"


class TableOccupation(models.Model):
    id = models.AutoField(primary_key=True)
    id_table = models.ForeignKey("Tables", on_delete=models.SET_DEFAULT, verbose_name="Столик",
                                 default=None, null=True, blank=True)
    start_time = models.DateTimeField("Начало бронирования")
    end_time = models.DateTimeField("Конец бронирования")

    def __str__(self):
        return str(self.id_table)

    class Meta:
        verbose_name = "Бронирование"
        verbose_name_plural = "Бронирования"


class Employees(models.Model):
    id = models.AutoField(primary_key=True)
    id_category = models.ForeignKey("Categories", on_delete=models.SET_DEFAULT, verbose_name="Категория",
                                    default=None, null=True, blank=True)
    name = models.CharField("Имя", max_length=30)
    surname = models.CharField("Фамилия", max_length=30)
    telephone = models.CharField("Телефон", max_length=15)
    position = models.CharField("Должность", max_length=30)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"


class Orders(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.IntegerField("Номер заказа", auto_created=True)
    orders_date = models.DateTimeField("Дата")
    address = models.CharField("Адрес", max_length=100)
    cost = models.FloatField("Стоимость")
    payment_type = models.CharField("Способ оплаты", max_length=20)
    delivery_type = models.CharField("Способ доставки", max_length=20)

    def __str__(self):
        return str(self.number)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"


class OrderList(models.Model):
    id = models.AutoField(primary_key=True)
    id_order = models.ForeignKey("Orders", on_delete=models.CASCADE, verbose_name="Заказ")
    id_dish = models.ForeignKey("Dishes", on_delete=models.CASCADE, verbose_name="Блюдо")
    amount = models.PositiveIntegerField("Количество")

    def __str__(self):
        return str(self.id_order)

    class Meta:
        verbose_name = "Состав заказа"
        verbose_name_plural = "Состав заказов"


class Products(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("Название", max_length=100)
    amount = models.FloatField("Количество")
    measure = models.CharField("Ед.Измерения", max_length=20)
    unit_cost = models.FloatField("Цена за единицу")
    expiring_date = models.CharField("Срок годности", max_length=20)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"


class Ingredients(models.Model):
    id = models.AutoField(primary_key=True)
    id_dishes = models.ForeignKey("Dishes", on_delete=models.SET_DEFAULT, verbose_name="Блюдо",
                                  default=None, null=True, blank=True)
    id_product = models.ForeignKey("Products", on_delete=models.SET_DEFAULT, verbose_name="Продукт",
                                   default=None, null=True, blank=True)
    amount = models.IntegerField("Количество", blank=True, null=True)
    measure = models.CharField("Ед.Измерения", max_length=20, blank=True, null=True)

    def __str__(self):
        return str(self.id_product)

    class Meta:
        verbose_name = "Ингридиент"
        verbose_name_plural = "Ингридиенты"


class DeliveriesToMarket(models.Model):
    id = models.AutoField(primary_key=True)
    id_product = models.ForeignKey("Products", on_delete=models.SET_DEFAULT, default=None, null=True, blank=True,
                                   verbose_name="Продукт")
    supplier = models.CharField("Поставщик", max_length=50)
    expires = models.DateField("Истечение срока")
    amount = models.IntegerField("Количество")
    cost = models.FloatField("Сумма")
    status = models.CharField("Статус", max_length=30)

    def __str__(self):
        return str(self.id_product)

    class Meta:
        verbose_name = "Поставка"
        verbose_name_plural = "Поставки"


class Users(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("Имя", max_length=100)
    telephone = models.CharField("Телефон", max_length=15, unique=True)
    email = models.EmailField("Почта", unique=True)
    birth_date = models.DateField("Дата рождение")

    def __str__(self):
        return f"{self.name} {self.email}"

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class Administrators(models.Model):
    id = models.AutoField(primary_key=True)
    id_user = models.ForeignKey("Users", on_delete=models.CASCADE, verbose_name="Имя")
    access_level = models.IntegerField("Уровень доступа")

    def __str__(self):
        return self.id_user.name

    class Meta:
        verbose_name = "Администратор"
        verbose_name_plural = "Администраторы"
