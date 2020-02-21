'use strict';

(function () {
  var PIN_WIDTH = 62;
  var PIN_HEIGHT = 84;

  var ENTER_KEY = 'Enter';

  var mapMainPinElement = document.querySelector('.map__pin--main');

  var adsAmount = 8;

  var togglePageState = function (list) {
    window.form.toggleFields(list);
    if (window.map.mapElement.classList.contains('map--faded')) {
      window.map.mapElement.classList.remove('map--faded');
      window.form.enableForm();
      window.data.ads = window.data.createAds(adsAmount);
      window.pin.renderPins(window.data.ads);
    } else {
      window.map.mapElement.classList.add('map--faded');
      window.form.disableForm();
      window.pin.removePins();
    }
  };

  var onMainPinLeftClick = function (evt) {
    if (evt.buttons === 1) {
      togglePageState(window.form.fieldsets);
    }
  };

  var onMainPinHitEnter = function (evt) {
    if (evt.key === ENTER_KEY) {
      togglePageState(window.form.fieldsets);
    }
  };

  mapMainPinElement.addEventListener('mousedown', onMainPinLeftClick);
  mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);
  window.map = {
    MAP_X_MIN: PIN_WIDTH / 2,
    MAP_X_MAX: 1200 - PIN_WIDTH / 2,
    MAP_Y_MIN: 130,
    MAP_Y_MAX: 630,
    mapElement: document.querySelector('.map'),

    getAddressCoordinates: function () {
      var x = mapMainPinElement.offsetLeft + PIN_WIDTH / 2;
      var y = mapMainPinElement.offsetTop + PIN_HEIGHT;
      return x + ', ' + y;
    }
  };
})();
