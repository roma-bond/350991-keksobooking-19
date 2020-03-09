'use strict';

(function () {
  var PIN_WIDTH = 62;
  var PIN_HEIGHT = 84;
  var MAP_LEFT_OFFSET = document.querySelector('.map').offsetLeft;
  var MAP_X_MIN = 0;
  var MAP_X_MAX = 1200;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;
  var ENTER_KEY = 'Enter';
  var PRICE_LOW = 10000;
  var PRICE_MIDDLE = 50000;

  var mapElement = document.querySelector('.map');
  var mapMainPinElement = document.querySelector('.map__pin--main');
  var defaultMainPinTopOffset = mapMainPinElement.offsetTop;
  var defaultMainPinLeftOffset = mapMainPinElement.offsetLeft;
  var mapFiltersForm = mapElement.querySelector('.map__filters');
  var filterFieldsets = document.querySelectorAll('.map__filters fieldset, .map__filters select');
  var housingTypeInput = mapElement.querySelector('#housing-type');
  var selectedHousingType = housingTypeInput.value;
  var housingPriceInput = mapElement.querySelector('#housing-price');
  var selectedHousingPrice = housingPriceInput.value;
  var housingRoomsInput = mapElement.querySelector('#housing-rooms');
  var selectedHousingRooms = housingRoomsInput.value;
  var housingGuestsInput = mapElement.querySelector('#housing-guests');
  var selectedHousingGuests = housingGuestsInput.value;
  var pageActive = false;
  var ads = [];
  var checkedFeatures = [];

  var getAddressCoordinates = function () {
    var x = mapMainPinElement.offsetLeft + PIN_WIDTH / 2;
    var y;
    if (pageActive) {
      y = mapMainPinElement.offsetTop + PIN_HEIGHT;
    } else {
      y = defaultMainPinTopOffset + PIN_WIDTH / 2;
    }
    return x + ', ' + y;
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var updatePageElements = function () {
    mapElement.classList.remove('map--faded');
    window.form.enableForm();
    if (!pageActive) {
      window.backend.download(window.pin.renderPins, errorHandler);
      window.form.adForm.addEventListener('submit', window.form.onAdFormSubmit);
    }
    pageActive = true;
    window.form.addressInput.value = getAddressCoordinates();
  };

  var disablePageElements = function () {
    mapElement.classList.add('map--faded');
    window.form.adForm.removeEventListener('submit', window.form.onAdFormSubmit);
    window.pin.removePins();
    pageActive = false;
    mapMainPinElement.style.top = defaultMainPinTopOffset + 'px';
    mapMainPinElement.style.left = defaultMainPinLeftOffset + 'px';
    window.form.disableForm();
  };

  var togglePageState = function (pinDragged) {
    window.form.toggleFields(window.form.adFieldsets);
    if (pageActive && !pinDragged) {
      disablePageElements();
    } else {
      updatePageElements();
    }
  };

  var onMainPinMousedown = function (evt) {
    evt.preventDefault();
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      if (pageActive) {
        window.form.addressInput.value = getAddressCoordinates();
      }

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var left = mapMainPinElement.offsetLeft - shift.x;
      var top = mapMainPinElement.offsetTop - shift.y;

      if (((left + PIN_WIDTH / 2 > MAP_X_MIN) && (left + PIN_WIDTH / 2 < MAP_X_MAX)) &&
        ((moveEvt.clientX > left + MAP_LEFT_OFFSET) && (moveEvt.clientX < left + PIN_WIDTH + MAP_LEFT_OFFSET))) {
        mapMainPinElement.style.left = left + 'px';
      }

      if (((top + PIN_HEIGHT > MAP_Y_MIN) && (top + PIN_HEIGHT < MAP_Y_MAX)) &&
        ((moveEvt.clientY > top) && (moveEvt.clientY < top + PIN_HEIGHT))) {
        mapMainPinElement.style.top = top + 'px';
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      togglePageState(dragged);
    };

    if (evt.buttons === 1) {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      var dragged = false;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  var onMainPinHitEnter = function (evt) {
    if (evt.key === ENTER_KEY) {
      togglePageState(false);
    }
  };

  var verifyPrice = function (price, filterValue) {
    var match;
    switch (filterValue) {
      case 'any':
        match = true;
        break;
      case 'low':
        match = (price <= PRICE_LOW);
        break;
      case 'middle':
        match = (price <= PRICE_MIDDLE);
        break;
      case 'high':
        match = (price > PRICE_MIDDLE);
        break;
    }
    return match;
  };

  var verifyFeatures = function (adFeatures) {
    var tempCheckedFeatures = checkedFeatures.slice();
    for (var i = 0; i < adFeatures.length; i++) {
      if (tempCheckedFeatures.length > 0) {
        for (var j = 0; j < tempCheckedFeatures.length; j++) {
          if (adFeatures[i] === tempCheckedFeatures[j]) {
            tempCheckedFeatures.splice(j, 1);
            break;
          }
        }
      } else {
        break;
      }
    }
    return (tempCheckedFeatures.length === 0);
  };

  var applyFilters = function (list) {
    var filteredList = [];
    if (list) {
      filteredList = list.filter(function (ad) {
        return ((selectedHousingType === 'any') || (ad.offer.type === selectedHousingType));
      }).filter(function (ad) {
        return verifyPrice(ad.offer.price, selectedHousingPrice);
      }).filter(function (ad) {
        return ((selectedHousingRooms === 'any') || (ad.offer.rooms === parseInt(selectedHousingRooms, 10)));
      }).filter(function (ad) {
        return ((selectedHousingGuests === 'any') || (ad.offer.guests === parseInt(selectedHousingGuests, 10)));
      }).filter(function (ad) {
        return verifyFeatures(ad.offer.features);
      });
    }
    return filteredList;
  };

  var onHousingTypeChange = window.data.debounce(function (evt) {
    selectedHousingType = evt.target.value;
    window.pin.renderPins(applyFilters(window.map.ads));
  });

  var onHousingPriceChange = window.data.debounce(function (evt) {
    selectedHousingPrice = evt.target.value;
    window.pin.renderPins(applyFilters(window.map.ads));
  });

  var onHousingRoomsChange = window.data.debounce(function (evt) {
    selectedHousingRooms = evt.target.value;
    window.pin.renderPins(applyFilters(window.map.ads));
  });

  var onHousingGuestsChange = window.data.debounce(function (evt) {
    selectedHousingGuests = evt.target.value;
    window.pin.renderPins(applyFilters(window.map.ads));
  });

  var onHousingFeaturesChange = window.data.debounce(function (evt) {
    if (evt.target.checked) {
      checkedFeatures.push(evt.target.value);
    } else {
      checkedFeatures.splice(checkedFeatures.indexOf(evt.target.value), 1);
    }
    window.pin.renderPins(applyFilters(window.map.ads));
  });

  var onFiltersChange = function (evt) {
    var filterType = evt.target;
    switch (filterType) {
      case housingTypeInput: onHousingTypeChange(evt); break;
      case housingPriceInput: onHousingPriceChange(evt); break;
      case housingRoomsInput: onHousingRoomsChange(evt); break;
      case housingGuestsInput: onHousingGuestsChange(evt); break;
      default: onHousingFeaturesChange(evt); break;
    }
  };

  mapMainPinElement.addEventListener('mousedown', onMainPinMousedown);
  mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);

  mapFiltersForm.addEventListener('change', onFiltersChange);

  window.map = {
    MAP_X_MIN: MAP_X_MIN,
    MAP_X_MAX: MAP_X_MAX,
    MAP_Y_MIN: MAP_Y_MIN,
    MAP_Y_MAX: MAP_Y_MAX,
    mapElement: mapElement,
    filterFieldsets: filterFieldsets,
    ads: ads,

    getAddressCoordinates: getAddressCoordinates,
    errorHandler: errorHandler,
    togglePageState: togglePageState,
    applyFilters: applyFilters
  };
})();
