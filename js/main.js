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

var adsAmount = 8;
var mapElement = document.querySelector('.map');
var mapMainPinElement = document.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapFiltersForm = document.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('#address');
var roomsInput = document.querySelector('#room_number');
var capacityInput = document.querySelector('#capacity');

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

var createAds = function (amount) {
  var accommodation = getRandomArrayValue(OFFER_TYPES);

  var ads = [];
  for (var i = 0; i < amount; i++) {
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

var renderPins = function (ads) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createPinButton(ads[i]));
  }
  mapPins.appendChild(fragment);
};

var declineNum = function (num, nominative, genitiveSingular, genitivePlural) {
  if (num > 10 && (Math.round((num % 100) / 10)) === 1) {
    return genitivePlural;
  } else {
    switch (num % 10) {
      case 1: return nominative;
      case 2:
      case 3:
      case 4: return genitiveSingular;
    }
    return genitivePlural;
  }
};

var getNotValidMessage = function (num) {
  num++;
  var str = '';
  if (num === 4) {
    str = '«не для гостей»';
  } else if (num === 1) {
    str = '«для ' + num + ' ' + declineNum(num, 'гостя', 'гостей', 'гостей') + '»';
  } else {
    for (var i = num; i > 0; i--) {
      if (i > 1) {
        str = str + '«для ' + i + ' ' + declineNum(i, 'гостя', 'гостей', 'гостей') + '», ';
      } else {
        str = str.slice(0, str.length - 2) + ' или «для ' + i + ' ' + declineNum(i, 'гостя', 'гостей', 'гостей') + '»';
      }
    }
  }
  return str;
};

var verifySelectValues = function () {
  if (roomsInput.selectedIndex === 3) {
    if (capacityInput.selectedIndex < 3) {
      capacityInput.setCustomValidity(getNotValidMessage(roomsInput.selectedIndex));
    } else {
      capacityInput.setCustomValidity('');
    }
  } else if (roomsInput.selectedIndex >= Math.abs(capacityInput.selectedIndex - 2)) {
    capacityInput.setCustomValidity('');
  } else {
    capacityInput.setCustomValidity(getNotValidMessage(roomsInput.selectedIndex));
  }
};

var togglePageState = function (activate, adFieldsets, filterFieldsets, filterSelects) {
  if (activate) {
    mapElement.classList.remove('map--faded');
    adFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    filterFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    filterSelects.forEach(function (select) {
      select.disabled = false;
    });
  } else {
    if (!mapElement.classList.contains('map--faded')) {
      mapElement.classList.add('map--faded');
    }
    adFieldsets.forEach(function (fieldset) {
      fieldset.disabled = true;
    });
    filterFieldsets.forEach(function (fieldset) {
      fieldset.disabled = true;
    });
    filterSelects.forEach(function (select) {
      select.disabled = true;
    });
    verifySelectValues();
  }
};

var getAddresCoordinates = function () {
  var x = mapMainPinElement.offsetLeft + PIN_WIDTH / 2;
  var y = mapMainPinElement.offsetTop + PIN_HEIGHT;
  return x + ', ' + y;
};

togglePageState(false, adForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('select'));

var onMainPinLeftClick = function (evt) {
  if (evt.buttons === 1) {
    togglePageState(true, adForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('select'));
    var ads = createAds(adsAmount);
    renderPins(ads);
  }
  mapMainPinElement.removeEventListener('mousedown', onMainPinLeftClick);
};

var onMainPinHitEnter = function (evt) {
  if (evt.key === ENTER_KEY) {
    togglePageState(true, adForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('select'));
    var ads = createAds(adsAmount);
    renderPins(ads);
  }
  mapMainPinElement.removeEventListener('keydown', onMainPinHitEnter);
};

mapMainPinElement.addEventListener('mousedown', onMainPinLeftClick);
mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);

roomsInput.addEventListener('change', function () {
  verifySelectValues();
});

capacityInput.addEventListener('change', function () {
  verifySelectValues();
});

togglePageState(false, adForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('fieldset'), mapFiltersForm.querySelectorAll('select'));
addressInput.value = getAddresCoordinates();
