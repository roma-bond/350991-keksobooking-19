'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
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

  window.data = {
    debounce: debounce,
    convertOfferType: convertOfferType
  };
})();
