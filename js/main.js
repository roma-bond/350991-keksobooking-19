'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN_OPTIONS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MAP_X_MIN = 31;
var MAP_X_MAX = 1169;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;

var adsAmount = 8;
var mapElement = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
};

mapElement.classList.remove('map--faded');
var ads = createAds(adsAmount);
renderPins(ads);
renderCard(ads[0]);
