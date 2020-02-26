'use strict';

(function () {
  var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_CHECKIN_OPTIONS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var ads = [];

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
            x: getRandomValue(window.map.MAP_X_MAX, window.map.MAP_X_MIN),
            y: getRandomValue(window.map.MAP_Y_MAX, window.map.MAP_Y_MIN)
          },
        }
      });
    }
    return ads;
  };

  window.data = {
    ads: ads,

    convertOfferType: convertOfferType,
    createAds: createAds
  };
})();
