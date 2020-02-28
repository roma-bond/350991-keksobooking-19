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
  var pageActive = false;

  var getAddressCoordinates = function () {
    var x = mapMainPinElement.offsetLeft + PIN_WIDTH / 2;
    var y;
    if (pageActive) {
      y = mapMainPinElement.offsetTop + PIN_HEIGHT;
    } else {
      y = mapMainPinElement.offsetTop + PIN_WIDTH / 2;
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
    }
    pageActive = true;
    window.form.addressInput.value = getAddressCoordinates();
  };

  var disablePageElements = function () {
    mapElement.classList.add('map--faded');
    window.form.disableForm();
    window.pin.removePins();
    pageActive = false;
    window.form.addressInput.value = '';
  };

  var togglePageState = function (pinDragged) {
    var list = window.form.fieldsets;
    window.form.toggleFields(list);
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

  mapMainPinElement.addEventListener('mousedown', onMainPinMousedown);
  mapMainPinElement.addEventListener('keydown', onMainPinHitEnter);

  window.map = {
    MAP_X_MIN: MAP_X_MIN,
    MAP_X_MAX: MAP_X_MAX,
    MAP_Y_MIN: MAP_Y_MIN,
    MAP_Y_MAX: MAP_Y_MAX,
    mapElement: mapElement
  };
})();
