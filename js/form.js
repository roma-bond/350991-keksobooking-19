'use strict';

(function () {
  var ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  var TYPE_MAXPRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var fieldsets = document.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('#address');
  var roomsInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var typeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeinInput = adForm.querySelector('#timein');
  var timeoutInput = adForm.querySelector('#timeout');

  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    roomsInput.addEventListener('change', onRoomChange);
    typeInput.addEventListener('change', onTypeChange);
    timeinInput.addEventListener('change', onTimeinChange);
    timeoutInput.addEventListener('change', onTimeoutChange);
  };

  var disableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    roomsInput.addEventListener('change', onRoomChange);
    typeInput.addEventListener('change', onTypeChange);
    timeinInput.addEventListener('change', onTimeinChange);
    timeoutInput.addEventListener('change', onTimeoutChange);
  };

  var toggleFields = function (list) {
    list.forEach(function (item) {
      item.disabled = !item.disabled;
    });
  };

  var disableFieldsets = function (list) {
    list.forEach(function (item) {
      item.disabled = true;
    });
  };

  var onRoomChange = function () {
    if (capacityInput.options.length > 0) {
      [].forEach.call(capacityInput.options, function (item) {
        item.selected = (ROOMS_CAPACITY[roomsInput.value][0] === item.value);
        item.hidden = !(ROOMS_CAPACITY[roomsInput.value].indexOf(item.value) >= 0);
      });
    }
  };

  var onTypeChange = function () {
    var minPrice = TYPE_MAXPRICE[typeInput.options[typeInput.selectedIndex].value];
    priceInput.placeholder = minPrice;
    priceInput.min = minPrice;
  };

  var onTimeinChange = function () {
    timeoutInput.value = timeinInput.value;
  };

  var onTimeoutChange = function () {
    timeinInput.value = timeoutInput.value;
  };

  disableFieldsets(fieldsets);
  addressInput.value = window.map.getAddressCoordinates();
  onRoomChange();

  window.form = {
    fieldsets: fieldsets,
    addressInput: addressInput,

    enableForm: enableForm,
    disableForm: disableForm,
    toggleFields: toggleFields
  };
})();
