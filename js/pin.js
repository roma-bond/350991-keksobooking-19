'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var createPinButton = function (ad) {
    var pinButton = pinTemplate.cloneNode(true);
    pinButton.style.left = ad.offer.location.x + 'px';
    pinButton.style.top = ad.offer.location.y + 'px';
    var imgElement = pinButton.querySelector('img');
    imgElement.src = ad.author.avatar;
    imgElement.alt = ad.offer.title;
    pinButton.addEventListener('click', function () {
      window.card.closePopup();
      window.card.renderCard(ad);
      pinButton.classList.add('map__pin--active');
    });
    return pinButton;
  };

  var renderPins = function () {
    var mapPins = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.ads.length; i++) {
      fragment.appendChild(createPinButton(window.data.ads[i]));
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
