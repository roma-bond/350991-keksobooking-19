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

var ROOMS_CAPACITY = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0']
};

var adsAmount = 8;
var mapElement = document.querySelector('.map');
var mapMainPinElement = document.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var adForm = document.querySelector('.ad-form');
var fieldsets = document.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('#address');
var roomsInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');

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

var togglePageState = function (list) {
  toggleFields(list);
  if (mapElement.classList.contains('map--faded')) {
    mapElement.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    roomsInput.addEventListener('change', onRoomChange);
    var ads = createAds(adsAmount);
    renderPins(ads);
  } else {
    mapElement.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    roomsInput.removeEventListener('change', onRoomChange);
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

var onRoomChange = function () {
  if (capacityInput.options.length > 0) {
    [].forEach.call(capacityInput.options, function (item) {
      item.selected = (ROOMS_CAPACITY[roomsInput.value][0] === item.value) ? true : false;
      item.hidden = (ROOMS_CAPACITY[roomsInput.value].indexOf(item.value) >= 0) ? false : true;
    });
  }
};

mapMainPinElement.addEventListener('mousedown', onMainPinLeftClick);
mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);

disableFieldsets(fieldsets);
addressInput.value = getAddressCoordinates();
onRoomChange();
