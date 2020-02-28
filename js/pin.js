'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var createPinButton = function (ad) {
    if (ad.offer) {
      var pinButton = pinTemplate.cloneNode(true);
      pinButton.style.left = ad.location.x + 'px';
      pinButton.style.top = ad.location.y + 'px';
      var imgElement = pinButton.querySelector('img');
      imgElement.src = ad.author.avatar;
      imgElement.alt = ad.offer.title;
      pinButton.addEventListener('click', function () {
        window.card.closePopup();
        window.card.renderCard(ad);
        pinButton.classList.add('map__pin--active');
      });
      return pinButton;
    } else {
      return '';
    }
  };

  var renderPins = function (ads) {
    var mapPins = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      var pin = createPinButton(ads[i]);
      if (pin) {
        fragment.appendChild(pin);
      }
    }
    mapPins.appendChild(fragment);
  };

  var removePins = function () {
    var listOfPins = document.querySelectorAll('.map__pin');
    listOfPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.remove();
      }
    });
  };

  window.pin = {
    renderPins: renderPins,
    removePins: removePins
  };
})();
