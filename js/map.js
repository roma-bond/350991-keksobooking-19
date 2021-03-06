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

  var mapElement = document.querySelector('.map');
  var mapMainPinElement = document.querySelector('.map__pin--main');
  var defaultMainPinTopOffset = mapMainPinElement.offsetTop;
  var defaultMainPinLeftOffset = mapMainPinElement.offsetLeft;
  var mapFiltersForm = mapElement.querySelector('.map__filters');
  var filterFieldsets = document.querySelectorAll('.map__filters fieldset, .map__filters select');
  var filterElements = Array.from(filterFieldsets);
  var pageActive = false;
  var advertisements = [];
  var priceMap = {
    'low': {
      min: 0,
      max: 10000
    },
    'middle': {
      min: 10000,
      max: 50000
    },
    'high': {
      min: 50000,
      max: Infinity
    }
  };

  var getAddressCoordinates = function () {
    var x = mapMainPinElement.offsetLeft + PIN_WIDTH / 2;
    var y = (pageActive) ? (mapMainPinElement.offsetTop + PIN_HEIGHT) : (defaultMainPinTopOffset + PIN_WIDTH / 2);
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
    if (!pageActive) {
      mapElement.classList.remove('map--faded');
      window.form.enable();
      window.form.toggle(window.form.fieldsets);
      window.form.toggle(filterFieldsets);
      window.backend.download(window.pin.render, errorHandler);
      window.form.adForm.addEventListener('submit', window.form.onSubmit);
      mapFiltersForm.addEventListener('change', window.data.debounce(onFiltersChange));
    }
    pageActive = true;
    window.form.addressInput.value = getAddressCoordinates();
  };

  var disablePageElements = function () {
    mapElement.classList.add('map--faded');
    window.card.close();
    window.form.adForm.removeEventListener('submit', window.form.onSubmit);
    window.pin.remove();
    pageActive = false;
    mapMainPinElement.style.top = defaultMainPinTopOffset + 'px';
    mapMainPinElement.style.left = defaultMainPinLeftOffset + 'px';
    window.form.toggle(window.form.fieldsets);
    window.form.toggle(filterFieldsets);
    window.form.disable();
    mapFiltersForm.removeEventListener('change', window.data.debounce(onFiltersChange));
  };

  var togglePageState = function (pinDragged) {
    if (!(pageActive && !pinDragged)) {
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
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };

      var left = mapMainPinElement.offsetLeft - shift.x;
      var top = mapMainPinElement.offsetTop - shift.y;

      if (((left + PIN_WIDTH / 2 > MAP_X_MIN) && (left + PIN_WIDTH / 2 < MAP_X_MAX)) &&
        ((moveEvt.pageX > left + MAP_LEFT_OFFSET) && (moveEvt.pageX < left + PIN_WIDTH + MAP_LEFT_OFFSET))) {
        mapMainPinElement.style.left = left + 'px';
      }

      if (((top + PIN_HEIGHT > MAP_Y_MIN) && (top + PIN_HEIGHT < MAP_Y_MAX)) &&
        ((moveEvt.pageY > top) && (moveEvt.pageY < top + PIN_HEIGHT))) {
        mapMainPinElement.style.top = top + 'px';
      }

      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
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
        x: evt.pageX,
        y: evt.pageY
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

  var filterRules = {
    'housing-type': function (data, filter) {
      return filter.value === data.offer.type;
    },
    'housing-price': function (data, filter) {
      return data.offer.price >= priceMap[filter.value].min && data.offer.price < priceMap[filter.value].max;
    },
    'housing-rooms': function (data, filter) {
      return filter.value === data.offer.rooms.toString();
    },
    'housing-guests': function (data, filter) {
      return filter.value === data.offer.guests.toString();
    },
    'housing-features': function (data, filter) {
      var checkListElements = Array.from(filter.querySelectorAll('input[type=checkbox]:checked'));

      return checkListElements.every(function (it) {
        return data.offer.features.some(function (feature) {
          return feature === it.value;
        });
      });
    }
  };

  var applyFilters = function (list) {
    return list.filter(function (item) {
      return filterElements.every(function (filter) {
        return (filter.value === 'any') ? true : filterRules[filter.id](item, filter);
      });
    });
  };

  var onFiltersChange = function () {
    window.pin.render(applyFilters(window.map.advertisements));
  };

  mapMainPinElement.addEventListener('mousedown', onMainPinMousedown);
  mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);

  window.map = {
    X_MIN: MAP_X_MIN,
    X_MAX: MAP_X_MAX,
    Y_MIN: MAP_Y_MIN,
    Y_MAX: MAP_Y_MAX,
    element: mapElement,
    filterFieldsets: filterFieldsets,
    advertisements: advertisements,

    getAddressCoordinates: getAddressCoordinates,
    errorHandler: errorHandler,
    togglePageState: togglePageState,
    disablePageElements: disablePageElements,
    applyFilters: applyFilters
  };
})();
