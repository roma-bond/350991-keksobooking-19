'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN_OPTIONS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_WIDTH = 62;
var PIN_HEIGHT = 84;
var MAP_X_MIN = PIN_WIDTH / 2;
var MAP_X_MAX = 1200 - PIN_WIDTH / 2;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;

var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';

var ROOMS_CAPACITY = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0']
};

var TYPE_MAXPRICE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var pins;
var ads = [];
var adsAmount = 8;
var mapElement = document.querySelector('.map');
var mapMainPinElement = document.querySelector('.map__pin--main');
var mapFilters = document.querySelector('.map__filters-container');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var fieldsets = document.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('#address');
var roomsInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');
var typeInput = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var timeinInput = adForm.querySelector('#timein');
var timeoutInput = adForm.querySelector('#timeout');

var getRandomValue = function (max, min) {
  var minValue = min || 0;
  return minValue + Math.ceil(Math.random() * (max - minValue));
};

var getRandomArrayValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getSomeArrayValues = function (array) {
  var arrayCopy = array.slice();
  var selection = [];
  var selectionArrayLength = getRandomValue(arrayCopy.length);
  for (var i = 0; i < selectionArrayLength; i++) {
    var selectionElement = arrayCopy.splice(getRandomValue(arrayCopy.length - 1), 1)[0];
    selection.push(selectionElement);
  }
  return selection;
};

var convertOfferType = function (typeOfAccomodation) {
  var offerRus;
  switch (typeOfAccomodation) {
    case 'palace':
      offerRus = 'Дворец';
      break;
    case 'flat':
      offerRus = 'Квартира';
      break;
    case 'house':
      offerRus = 'Дом';
      break;
    case 'bungalo':
      offerRus = 'Бунгало';
      break;
  }
  return offerRus;
};

var createAds = function (amount) {
  ads = [];
  for (var i = 0; i < amount; i++) {
    var accommodation = getRandomArrayValue(OFFER_TYPES);
    ads.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: accommodation.toUpperCase() + ' вашей мечты',
        address: '600, 350',
        price: getRandomValue(100000),
        type: accommodation,
        rooms: getRandomValue(10),
        guests: getRandomValue(10),
        checkin: getRandomArrayValue(OFFER_CHECKIN_OPTIONS),
        checkout: getRandomArrayValue(OFFER_CHECKIN_OPTIONS),
        features: getSomeArrayValues(OFFER_FEATURES),
        description: 'Лучший вариант ' + accommodation + ' в этом районе',
        photos: getSomeArrayValues(OFFER_PHOTOS),
        location: {
          x: getRandomValue(MAP_X_MAX, MAP_X_MIN),
          y: getRandomValue(MAP_Y_MAX, MAP_Y_MIN)
        },
      }
    });
  }
  return ads;
};

var createPinButton = function (ad) {
  var pinButton = pinTemplate.cloneNode(true);
  pinButton.style.left = ad.offer.location.x + 'px';
  pinButton.style.top = ad.offer.location.y + 'px';
  var imgElement = pinButton.querySelector('img');
  imgElement.src = ad.author.avatar;
  imgElement.alt = ad.offer.title;
  return pinButton;
};

var enablePinsListeners = function () {
  pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  pins.forEach(function (pin) {
    pin.addEventListener('click', onPinClick);
  });
};

var disablePinsListeners = function (num) {
  ads.forEach(function (ad, i) {
    if (i !== num) {
      pins[i].removeEventListener('click', onPinClick);
    }
  });
};

var renderCard = function (ad) {
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

  cardTitleElement.textContent = ad.offer.title;
  cardAddressElement.textContent = ad.offer.address;
  cardPriceElement.textContent = ad.offer.price + ' ₽/ночь';
  cardTypeElement.textContent = convertOfferType(ad.offer.type);
  cardCapacityElement.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardTimeElement.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  cardFeaturesList.innerHTML = '';
  for (var i = 0; i < ad.offer.features.length; i++) {
    var listElement = document.createElement('li');
    listElement.className = 'popup__feature popup__feature--' + ad.offer.features[i];
    cardFeaturesList.appendChild(listElement);
  }

  cardDescriptionElement.textContent = ad.offer.description;

  cardPhotosElement.innerHTML = '';
  for (var j = 0; j < ad.offer.photos.length; j++) {
    var image = document.createElement('img');
    image.className = 'popup__photo';
    image.src = ad.offer.photos[j];
    image.style.width = 45 + 'px';
    image.style.height = 40 + 'px';
    image.alt = 'Фотография жилья';
    cardPhotosElement.appendChild(image);
  }

  cardAvatarElement.src = ad.author.avatar;
  fragment.appendChild(cardElement);
  mapElement.insertBefore(fragment, mapFilters);

  var onPopupCloseClick = function () {
    document.querySelector('.map__card').remove();
    popupCloseButton.removeEventListener('click', onPopupCloseClick);
    enablePinsListeners();
  };

  var onPopupEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      onPopupCloseClick();
    }
  };

  popupCloseButton.addEventListener('click', onPopupCloseClick);
  document.addEventListener('keydown', onPopupEscPress);
};

var onPinClick = function (evt) {
  var id = parseInt(evt.target.src.split('/user')[1].split('.png')[0], 10) - 1;
  renderCard(ads[id]);
  disablePinsListeners(id);
};

var renderPins = function () {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createPinButton(ads[i]));
  }
  mapPins.appendChild(fragment);

  enablePinsListeners();
};

var toggleFields = function (list) {
  list.forEach(function (item) {
    item.disabled = !item.disabled;
  });
};

var disableFieldsets = function (list) {
  list.forEach(function (item) {
    item.disabled = true;
  });
};

var removePins = function () {
  var listOfPins = document.querySelectorAll('.map__pin');
  listOfPins.forEach(function (item) {
    if (!item.classList.contains('map__pin--main')) {
      item.remove();
    }
  });
};

var onRoomChange = function () {
  if (capacityInput.options.length > 0) {
    [].forEach.call(capacityInput.options, function (item) {
      item.selected = (ROOMS_CAPACITY[roomsInput.value][0] === item.value) ? true : false;
      item.hidden = (ROOMS_CAPACITY[roomsInput.value].indexOf(item.value) >= 0) ? false : true;
    });
  }
};

var onTypeChange = function () {
  var minPrice = TYPE_MAXPRICE[typeInput.options[typeInput.selectedIndex].value];
  priceInput.placeholder = minPrice;
  priceInput.min = minPrice;
};

var onTimeinChange = function () {
  timeoutInput.value = timeinInput.value;
};

var onTimeoutChange = function () {
  timeinInput.value = timeoutInput.value;
};

var togglePageState = function (list) {
  toggleFields(list);
  if (mapElement.classList.contains('map--faded')) {
    mapElement.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    roomsInput.addEventListener('change', onRoomChange);
    typeInput.addEventListener('change', onTypeChange);
    timeinInput.addEventListener('change', onTimeinChange);
    timeoutInput.addEventListener('change', onTimeoutChange);
    ads = createAds(adsAmount);
    renderPins(ads);
  } else {
    mapElement.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    roomsInput.removeEventListener('change', onRoomChange);
    typeInput.removeEventListener('change', onTypeChange);
    timeinInput.addEventListener('change', onTimeinChange);
    timeoutInput.addEventListener('change', onTimeoutChange);
    removePins();
  }
};

var getAddressCoordinates = function () {
  var x = mapMainPinElement.offsetLeft + PIN_WIDTH / 2;
  var y = mapMainPinElement.offsetTop + PIN_HEIGHT;
  return x + ', ' + y;
};

var onMainPinLeftClick = function (evt) {
  if (evt.buttons === 1) {
    togglePageState(fieldsets);
  }
};

var onMainPinHitEnter = function (evt) {
  if (evt.key === ENTER_KEY) {
    togglePageState(fieldsets);
  }
};

mapMainPinElement.addEventListener('mousedown', onMainPinLeftClick);
mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);

disableFieldsets(fieldsets);
addressInput.value = getAddressCoordinates();
onRoomChange();
