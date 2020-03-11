'use strict';

(function () {
  var MAP_MAX_PINS = 5;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var createPinButton = function (ad) {
    if (ad.offer) {
      var pinButton = pinTemplate.cloneNode(true);
      pinButton.style.left = (ad.location.x - (PIN_WIDTH / 2)) + 'px';
      pinButton.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
      var imgElement = pinButton.querySelector('img');
      imgElement.src = ad.author.avatar;
      imgElement.alt = ad.offer.title;
      pinButton.addEventListener('click', function () {
        window.card.close();
        window.card.render(ad);
        pinButton.classList.add('map__pin--active');
      });
      return pinButton;
    } else {
      return '';
    }
  };

  var render = function (ads) {
    remove();
    window.card.close();
    var mapPins = document.querySelector('.map__pins');
    var pinsOnMap = (ads.length > MAP_MAX_PINS) ? MAP_MAX_PINS : ads.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pinsOnMap; i++) {
      var pin = createPinButton(ads[i]);
      if (pin) {
        fragment.appendChild(pin);
      }
    }
    mapPins.appendChild(fragment);
  };

  var remove = function () {
    var listOfPins = document.querySelectorAll('.map__pin');
    listOfPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.remove();
      }
    });
  };

  window.pin = {
    render: render,
    remove: remove
  };
})();
