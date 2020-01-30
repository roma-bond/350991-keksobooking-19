'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN_OPTIONS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel1.jpg'];
var MAP_X_MIN = 31;
var MAP_X_MAX = 1169;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;

var adsAmount = 8;
var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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
    ads[i] = {
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
    };
  }
  return ads;
};

var createPinButton = function (ad) {
  var pinButton = pinTemplate.cloneNode(true);
  pinButton.style = 'left: ' + ad.offer.location.x + 'px; top: ' + ad.offer.location.y + 'px;';
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

map.classList.remove('map--faded');
renderPins(createAds(adsAmount));
