'use strict';

(function () {
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
    convertOfferType: convertOfferType
  };
})();
