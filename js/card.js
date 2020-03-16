'use strict';

(function () {
  var OFFER_PHOTOS_WIDTH = '45px';
  var OFFER_PHOTOS_HEIGHT = '40px';
  var ESC_KEY = 'Escape';

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapFilters = document.querySelector('.map__filters-container');

  var onPopupCloseClick = function () {
    window.card.close();
  };

  var onPopupEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      window.card.close();
    }
  };

  var close = function () {
    var popup = document.querySelector('.map__card');
    if (popup) {
      var popupCloseButton = popup.querySelector('.popup__close');
      popup.remove();
      popupCloseButton.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onPopupEscPress);
      window.map.element.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  };

  var fillInElementData = function (element, elementData) {
    if (elementData) {
      element.textContent = elementData;
    } else {
      element.classList.add('hidden');
    }
  };

  var render = function (ad) {
    var fragment = document.createDocumentFragment();
    var cardElement = cardTemplate.cloneNode(true);
    var cardTitleElement = cardElement.querySelector('.popup__title');
    var cardAddressElement = cardElement.querySelector('.popup__text--address');
    var cardPriceElement = cardElement.querySelector('.popup__text--price');
    var cardTypeElement = cardElement.querySelector('.popup__type');
    var cardCapacityElement = cardElement.querySelector('.popup__text--capacity');
    var cardTimeElement = cardElement.querySelector('.popup__text--time');
    var cardFeaturesList = cardElement.querySelector('.popup__features');
    var cardDescriptionElement = cardElement.querySelector('.popup__description');
    var cardPhotosElement = cardElement.querySelector('.popup__photos');
    var cardAvatarElement = cardElement.querySelector('.popup__avatar');
    var popupCloseButton = cardElement.querySelector('.popup__close');

    fillInElementData(cardTitleElement, ad.offer.title);
    fillInElementData(cardAddressElement, ad.offer.address);
    fillInElementData(cardPriceElement, ad.offer.price + ' ₽/ночь');
    fillInElementData(cardTypeElement, window.data.convertOfferType(ad.offer.type));
    fillInElementData(cardCapacityElement, ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    fillInElementData(cardTimeElement, 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);

    cardFeaturesList.innerHTML = '';
    ad.offer.features.forEach(function (feature) {
      var listElement = document.createElement('li');
      listElement.className = 'popup__feature popup__feature--' + feature;
      cardFeaturesList.appendChild(listElement);
    });

    cardDescriptionElement.textContent = ad.offer.description;

    cardPhotosElement.innerHTML = '';
    ad.offer.photos.forEach(function (photo) {
      var image = document.createElement('img');
      image.className = 'popup__photo';
      image.src = photo;
      image.style.width = OFFER_PHOTOS_WIDTH;
      image.style.height = OFFER_PHOTOS_HEIGHT;
      image.alt = 'Фотография жилья';
      cardPhotosElement.appendChild(image);
    });

    cardAvatarElement.src = ad.author.avatar;
    fragment.appendChild(cardElement);
    window.map.element.insertBefore(fragment, mapFilters);

    popupCloseButton.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);
  };

  window.card = {
    close: close,
    render: render
  };
})();
