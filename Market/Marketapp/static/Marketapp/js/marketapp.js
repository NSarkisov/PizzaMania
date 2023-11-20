$(document).ready(function() {
  $('.product-grid__content').addClass('show');
  var panelElement = $('.sticky-component__content');
  var panelOffsetTop = panelElement.offset().top;
  var isSticky = false;

  $(window).scroll(function() {

    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
      var scrollTop = $(window).scrollTop();

      if (scrollTop > panelOffsetTop && !isSticky) {
        panelElement.addClass('sticky');
        isSticky = true;
      } else if (scrollTop <= panelOffsetTop && isSticky) {
        panelElement.removeClass('sticky');
        isSticky = false;
      }
    }, 1));
  });
    // Обработчик клика на ссылку
  $(document).on('click' , 'a[data-manual]', function(event) {
    event.preventDefault(); // Отменяем стандартное действие перехода по ссылке
    event.stopPropagation();
    var url = $(this).attr('href'); // Получаем URL из атрибута href

    // Получаем текущую позицию прокрутки
    var scrollPosition = $(window).scrollTop();

    // Выполняем AJAX-запрос для загрузки фрагмента страницы
    $.ajax({

      url: url,
      success: function(data) {

        // Находим фрагмент страницы, который нужно обновить
        var updateTitle = $(data).filter('head, title').text();
        var updatedContent = $(data).find('.categories__product-groups');

        // Обновляем содержимое фрагмента страницы
        $('title').text(updateTitle);
        $('.categories__product-groups').html(updatedContent.html());
        $('.product-grid__content').fadeIn();
        $('.product-grid__content').addClass('show');
        history.pushState(null, '', url);
        var stickyMenuHeight = $('.sticky-component__content').outerHeight();
        if (!$('.sticky-component__content').hasClass('sticky')) {
            $('.sticky-component__content').addClass('sticky')
        }
        var targetOffset = $('.categories__navigation').offset().top - stickyMenuHeight;
        $('html, body').animate({
          scrollTop: targetOffset}, 500);
      }
    });
  });

  $('.select_options').change(function() {
    const container = $(this).closest('.product-card__content');
    handleSelectChange(container);
  });

  $(document).on('click', 'a.product-card__media-wrapper', function (event) {
    event.preventDefault();
    event.stopPropagation();
    container = $(this)

    const title = $(this).closest('.product-card.product-card--vertical')
      .find('.product-card__title').text().trim();
    const description = $(this).closest('.product-card.product-card--vertical')
      .find('.product-card__description').text().trim();
    const imagePath = $(this).closest('.product-card.product-card--vertical')
      .find('.media-image__element.product-card-media__element')[0].src
    const sizeSelect = $(this).closest('.product-card.product-card--vertical')
      .find('.select_options.sizes').val()
    const optionsSelect = $(this).closest('.product-card.product-card--vertical')
      .find('.select_options.options').val()


    const customModal = $('<div class="custom-modal' +
      ' custom-modal--overflow-free' +
      ' product-details-modal' +
      ' custom-modal--size-content' +
      ' custom-modal--padding-none">')

    const customModalOverlay = $('<div class="custom-modal__overlay">')
    const customModalContentHolder = $('<div class="custom-modal__content-holder">')

    const customButton = $('<button class="custom-button' +
      ' custom-button--transparent' +
      ' custom-button--no-paddings' +
      ' custom-button--size-small' +
      ' custom-modal__close-button">')
    const customModalContent = $('<div class="custom-modal__content">')

    //Button elements
    const customButtonSpan = $('<span class="custom-button__content">')
    //Span elements
    const customButtonInnerSpan1 = $('<span class="custom-button__badge">')
    const customButtonInnerSpan2 = $('<span class="custom-button__content-children">')
    //InnerSpan2 elements
    const customIcon = $('<svg class="custom-icon__popup"' +
      ' width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"' +
      ' fill="rgba(255,255,255,.54)">' +
      '<g>' +
      '<path d="M23.6663 2.66668L21.333 0.333344L11.9997 9.66668L2.66634 0.333344L0.333008 2.66668L9.66634 12L0.333008' +
      ' 21.3333L2.66634 23.6667L11.9997 14.3333L21.333 23.6667L23.6663 21.3333L14.333 12L23.6663 2.66668Z"></path>' +
      '</g>' +
      '</svg>')
    //Button elements end
    //customModalContent elements
    const productDetails = $('<div class="product-details">')
    //productDetails elements //Вставить в класс атрибут имя карточки
    const productCardHorizontal = $('<div class="product-card' +
      ' product-card--horizontal' +
      ' product-card--media-full' +
      ' product-card--details' +
      ' product-details__product-card"' +
      ' data-code="data-code">')
    //productCardHorizontal elements  // взять ссылку с карточки
    const productCardMedia = $('<a target="_blank"' +
      ' class="product-card__media-wrapper product-card__media-wrapper--full">').attr('href', imagePath)
    //productCardMedia elements
    const mediaImage = $('<div class="media-image media-image--lazy media-image--loaded product-card-media">')
    const mediaImageElementToClone = container.find('.media-image__element.product-card-media__element')
    const mediaImageElement = mediaImageElementToClone.clone()

    //mediaImageElement element
    const mediaImageChildren = $('<div class="media-image__children">')
    //mediaImageChildren element
    const productCardMinPrice = container.find('.product-card__min-price').clone()
    // Элементы тега <a> закончились
    //Здесь нужно склонировать div
    const productCardContent = $('<div class="product-card__content">')

    const name = $('<h1 class="product-card__title">')
    const subtitle = $('<div class="product-card__subtitle">')
    const productCardDescription = $('<div class="product-card__description">')
    //Забрать с базы описание
    const nutritionalInfo = $('<div class="product-card__nutritional-info">')

    const valuesData = {
    'requesting': "Description",
    'name': title,
    'size': sizeSelect
    };
    const requestData = {'requested_data': JSON.stringify(valuesData)}
    $.ajax({
      url: '/card',  // URL-адрес, по которому будет обрабатываться запрос на сервере Django
      type: 'GET',
      data: requestData,
      success: function(response) {
        nutritionalInfo.text(response.description);
      },
      error: function(xhr, status, error) {

        console.log(error);
      }
    });

    const modifications = $(this).closest('.product-card.product-card--vertical')
      .find('.modifications__content').clone()

    //Устанавливаем значение с select карточки в select окна
    modifications.find('.select_options.sizes').val(sizeSelect)
    modifications.find('.select_options.options').val(optionsSelect)

    const modificationsSummary = $(this).closest('.product-card.product-card--vertical')
      .find('.product-card__modification-summary').clone()


    name.text(title)
    productCardDescription.text(description)

    //Иерархия popup карточки
    customButtonInnerSpan2.append(customIcon)
    customButtonSpan.append(customButtonInnerSpan1)
    customButtonSpan.append(customButtonInnerSpan2)
    customButton.append(customButtonSpan)

    mediaImageChildren.append(productCardMinPrice)
    mediaImage.append(mediaImageElement)
    mediaImage.append(mediaImageChildren)
    productCardMedia.append(mediaImage)

    //Добавь в блок productCardContent элементы о карточке
    productCardContent.append(name)
    productCardContent.append(subtitle)
    productCardContent.append(productCardDescription)
    productCardContent.append(nutritionalInfo)
    productCardContent.append(modifications)
    productCardContent.append(modificationsSummary)

    productCardHorizontal.append(productCardMedia)
    productCardHorizontal.append(productCardContent)

    productDetails.append(productCardHorizontal)
    customModalContent.append(productDetails)

    customModalContentHolder.append(customButton)
    customModalContentHolder.append(customModalContent)

    customModal.append(customModalOverlay)
    customModal.append(customModalContentHolder)
    //Добавляем на страничку Иерархию
    $('.scene-content').append(customModal);

    customModal.find('.select_options').change(function() {
        handleSelectChange(customModal);
    });

    // Функция для закрытия и уничтожения всплывающего окна
    function closePopup() {
      $('.custom-modal').fadeOut(function () {
        if ($('.select_options').length > 0) {
        card = container.closest('.product-card.product-card--vertical');
        sizeFromPopup = $(this).find('.select_options.sizes').val();
        optionFromPopup = $(this).find('.select_options.options').val();
        priceFromPopup = $(this).find('.product-card__modification-info-price').text().trim();
        weightFromPopup = $(this).find('.product-card__modification-info-weight').text().trim();


        card.find('.select_options.sizes').val(sizeFromPopup);
        if (typeof элемент !== 'undefined') {}
        for (let i = 0; i < card.find('.select_options.options')[0].options.length; i++) {
          if (card.find('.select_options.options')[0].options[i].value === optionFromPopup) {
            // Опция с заданным значением найдена
            card.find('.select_options.options').val(optionFromPopup);
            break;
          }
          else{
            card.find('.select_options.options').empty();
            card.find('.select_options.options').append($('<option>', {
              value: optionFromPopup,
              text: optionFromPopup
            }));

          }
        }
        handleSelectChange(card)
        card.find('.product-card__modification-info-price').text(priceFromPopup);
        card.find('.product-card__modification-info-weight').text(weightFromPopup);
        }
        $(this).remove();

      });
    }
    // При клике вне всплывающего окна закрываем и уничтожаем его
    $(document).on('click', function (event) {
      if ($(event.target).closest('.custom-modal__content-holder').length === 0 &&
        !$(event.target).is('.product-card__media-wrapper')) {
        closePopup();
      }
    });
    // При клике на значок крестика закрываем и уничтожаем всплывающее окно
    $(document).on('click', '.custom-modal__close-button', function () {
      closePopup();
    });
  });

  $(document).on('click', '.custom-button.custom-button--secondary.custom-button--size-medium', function (event) {
  if (!$(event.target).closest('.cart-button__button').length) {
  function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    var container = $(this).closest('.product-card__content');
    var name = container.find('.product-card__title').text().trim()
    if (container.find('.select_options').length > 0) {
      var size = $('.select_options.sizes').val();
      var option = $('.select_options.options').val();
      console.log(name, size, option);
    }
    else{
      var size = null;
      var option = null;
    }
    $.ajax({
      url: '/cart/',
      type: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      },
      data: {
        'name': name,
        'size': size,
        'option': option,
      },
      success: function(response) {
        // Обработка успешного ответа от сервера
      },
      error: function(xhr, status, error) {
        // Обработка ошибки
      }
    });
    }
  });

  $(document).on('click', '.custom-button.custom-button--secondary.custom-button--size-medium.cart-button__button', function (event) {

      const cartButtonMiniBag = $('<div class="cart-button__mini-bag" style="max-height: 650px;">')

      const cartDivMiniBagHide = $('<div class="cart-button__mini-bag-actions cart-button__mini-bag-actions--top">')

      cartButtonMiniBag.append(cartDivMiniBagHide)

      const cartButtonMiniBagHide = $('<button class="custom-button' +
             ' custom-button--transparent' +
             ' custom-button--full-width' +
             ' custom-button--size-large' +
             ' cart-button__mini-bag-hide-button"' +
             ' type="button">')

      cartDivMiniBagHide.append(cartButtonMiniBagHide)

      const bagHideContent = $('<span class="custom-button__content">')

      cartButtonMiniBagHide.append(bagHideContent)

      const bagHideContentSpan1 = $('<span class="custom-button__badge">')
      const bagHideContentSpan2 = $('<span class="custom-button__content-children">')
      bagHideContentSpan2.text("Свернуть корзину")

      bagHideContent.append(bagHideContentSpan1)
      bagHideContent.append(bagHideContentSpan2)

      const cartButtonMiniBagProducts = $('<div class="cart-button__mini-bag-products-wrapper">')

      cartButtonMiniBag.append(cartButtonMiniBagProducts)

      const orderProducts = $('<div class="order-products cart-button__mini-bag-products">')

      cartButtonMiniBagProducts.append(orderProducts)

      const orderProductsAdded = $('<div class="order-products__added-products">')

      orderProducts.append(orderProductsAdded)



      $.ajax({
        url: '/cartInfo',  // Замените на свой URL-маршрут
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          var cartData = data.cart;

          for (var item_id in cartData) {

              if (cartData.hasOwnProperty(item_id)) {
                var itemData = cartData[item_id];
                console.log(itemData.name)
                var horizontalCard = $('<div class="product-card product-card--horizontal product-card--media-full product-card--mini-bag">')
                var productCardContent = $('<div class="product-card__content">')
                horizontalCard.append(productCardContent)
                var closeButton = $('<button class="jss436 jss429 product-card__button-close" type="button">')
                productCardContent.append(closeButton)
                var closeButtonSpan = $('<span class="jss434">')
                closeButton.append(closeButtonSpan)
                var closeButtonIco = $('<svg class="jss21 jss52" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">')
                closeButtonSpan.append(closeButtonIco)
                var parag = $('<p>')
                parag.text("x")
                closeButton.append(parag)
                var g = $('<g>')
                closeButtonIco.append(g)
                const closeButtonIcoPath = $('<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">')
                g.append(closeButtonIcoPath)
                var closeButtonSpan2 = $('<span class="jss438">')
                closeButton.append(closeButtonSpan2)
                var productTitle = $('<div class="product-card__title">')
                productTitle.text(itemData.name)
                productCardContent.append(productTitle)
                var productSubTitle = $('<div class="product-card__subtitle">') // Забери с базы ингридиенты
                productCardContent.append(productSubTitle)
                var productModificationSummary = $('<div class="product-card__modification-summary">')
                productCardContent.append(productModificationSummary)
                var productModificationInfo = $('<div class="product-card__modification-info">')
                productModificationSummary.append(productModificationInfo)
                var productModificationInfoPrice = $('<p class="product-card__modification-info-price">')
                productModificationInfoPrice.text(itemData.price)
                productModificationInfo.append(productModificationInfoPrice)
                var productModificationInfoWeight = $('<p class="product-card__modification-info-weight">')
                productModificationInfoWeight.text(itemData.weight)
                productModificationInfo.append(productModificationInfoWeight)
                var productCardActions = $('<div class="product-card__actions">')
                productModificationSummary.append(productCardActions)
                var productCounter = $('<div class="product-counter product-counter--theme-secondary">')
                productCardActions.append(productCounter)
                var productCounterInner = $('<div class="product-counter__content">')
                productCounter.append(productCounterInner)
                var productCardActionsDecrease = $('<button class="product-counter__action product-counter__action--decrease" type="button">')
                productCardActionsDecrease.text("-")
                var productCardActionsInput = $('<input class="product-counter__input" disabled type="text" value="1">')
                var productCardActionsIncrease = $('<button class="product-counter__action product-counter__action--encrease" type="button">')
                productCardActionsIncrease.text("+")
                productCounterInner.append(productCardActionsDecrease)
                productCounterInner.append(productCardActionsInput)
                productCounterInner.append(productCardActionsIncrease)
                orderProductsAdded.append(horizontalCard)
              }
            }
        },
        error: function(xhr, status, error) {
          console.error(error);
        }
      });

      function closeCart() {

      }
      const cardButtonMiniBagDetails = $('<div class="cart-button__mini-bag-details">')
      cartButtonMiniBag.append(cardButtonMiniBagDetails)
      const cardButtonMiniBagPrice = $('<div class="cart-button__mini-bag-price">')
      // нужно каким то образом общую сумму подсчитать и добавить текст
      const cardButtonMiniBagActions = $('<div class="cart-button__mini-bag-actions cart-button__mini-bag-actions--bottom">')
      cardButtonMiniBagDetails.append(cardButtonMiniBagPrice)
      cardButtonMiniBagDetails.append(cardButtonMiniBagActions)
      const purchaseOrder = $('<a class="custom-button custom-button--secondary custom-button--full-width custom-button--size-medium" href="">')
      cardButtonMiniBagActions.append(purchaseOrder)
      const cardButtonContent = $('<span class="custom-button__content">')
      purchaseOrder.append(cardButtonContent)
      const cardButtonBadge = $('<span class="custom-button__badge">')
      const cardButtonContentChildren = $('<span class="custom-button__content-children">')
      cardButtonContentChildren.text('Оформить заказ')
      cardButtonContent.append(cardButtonBadge)
      cardButtonContent.append(cardButtonContentChildren)

      $('.cart-button').append(cartButtonMiniBag)

      function closeCart() {
        cartButtonMiniBag.remove();
      }
      $(document).on('click', '.custom-button.custom-button--transparent.custom-button--full-width.custom-button--size-large.cart-button__mini-bag-hide-button', function (event) {
        closeCart();
        });
      $(document).on('click', '.product-card__button-close', function (event) {
        closeCart();
        });
  });

  function handleSelectChange(container) {

    const size = container.find('.select_options.sizes').val();
    const option = container.find('.select_options.options').val();
    const name = container.find('.product-card__title').text().trim();

    cost = container.find('.product-card__modification-info-price');
    weight = container.find('.product-card__modification-info-weight');

    selectSizesTag = container.find('.select_options.sizes')[0];
    selectOptionsTag = container.find('.select_options.options')[0];

    if (size === 'Mаленькая') {
        for (let i = selectOptionsTag.options.length - 1; i > 0; i--) {
          selectOptionsTag.remove(i);
        }
    }
    if (selectOptionsTag.options.length === 1 && size !== 'Mаленькая') {
        const optionsInSelectData = {
            'requesting': "Options",
            'name': name,
            'size': size,
        }
        const optionsData = {'requested_data': JSON.stringify(optionsInSelectData)}
        $.ajax({
          url: '/card',
          type: 'GET',
          data: optionsData,
          success: function(response) {
            const optionsFromDB = response.options
            container.find('.select_options.options').empty();
            for (let i = 0; i < optionsFromDB.length; i++) {
                const item = optionsFromDB[i];
                addOption(selectOptionsTag, item, item);
            }
            for (let i = 0; i < selectOptionsTag.options.length; i++) {
              if (selectOptionsTag.options[i].text === option) {
                selectOptionsTag.options[i].selected = true;
                break;
              }
            }
          },
          error: function(xhr, status, error) {
            console.log(error);
          }
        });
    }
    const valuesData = {
    'requesting': "Price and Weight",
    'name': name,
    'size': size,
    'option': option
    };
    const requestData = {'requested_data': JSON.stringify(valuesData)}
    $.ajax({
      url: '/card',  // URL-адрес, по которому будет обрабатываться запрос на сервере Django
      type: 'GET',
      data: requestData,
      success: function(response) {
        cost.text(response.cost);
        weight.text(response.weight);
      },
      error: function(xhr, status, error) {
        console.log(error);
      }
    });

}
});
function addOption(select, value, text) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      select.add(option);
      };

