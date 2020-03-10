'use strict';

(function () {
  var DEFAULT_PREVIEW_IMG_SRC = 'img/muffin-grey.svg';
  var ESC_KEY = 'Escape';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
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

  var adFieldsets = document.querySelectorAll('.ad-form fieldset');
  var adForm = document.querySelector('.ad-form');
  var titleInput = adForm.querySelector('#title');
  var addressInput = adForm.querySelector('#address');
  var roomsInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var typeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeinInput = adForm.querySelector('#timein');
  var timeoutInput = adForm.querySelector('#timeout');
  var descriptionInput = adForm.querySelector('#description');
  var adFormResetButton = adForm.querySelector('.ad-form__reset');
  var successPopupTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var avatarInput = adForm.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var accommodationPhotoInput = adForm.querySelector('.ad-form__upload input[type=file]');
  var accommodationPreview = adForm.querySelector('.ad-form__photo');

  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    roomsInput.addEventListener('change', onRoomChange);
    typeInput.addEventListener('change', onTypeChange);
    timeinInput.addEventListener('change', onTimeinChange);
    timeoutInput.addEventListener('change', onTimeoutChange);
    avatarInput.addEventListener('change', onAvatarChange);
    accommodationPhotoInput.addEventListener('change', onAccommodationPhotoChange);
  };

  var toggleDefaultInputValues = function () {
    addressInput.value = window.map.getAddressCoordinates();
    titleInput.value = titleInput.placeholder;
    descriptionInput.value = descriptionInput.placeholder;
    avatarPreview.src = DEFAULT_PREVIEW_IMG_SRC;
  };

  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
    roomsInput.removeEventListener('change', onRoomChange);
    typeInput.removeEventListener('change', onTypeChange);
    timeinInput.removeEventListener('change', onTimeinChange);
    timeoutInput.removeEventListener('change', onTimeoutChange);
    avatarInput.removeEventListener('change', onAvatarChange);
    accommodationPhotoInput.removeEventListener('change', onAccommodationPhotoChange);
    accommodationPreview.innerHTML = '';
    toggleDefaultInputValues();
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

  var onSuccessPopupClick = function () {
    document.querySelector('.success').remove();
  };

  var onSuccessPopupHitEsc = function (evt) {
    if (evt.key === ESC_KEY) {
      document.querySelector('.success').remove();
      document.removeEventListener('keydown', onSuccessPopupHitEsc);
    }
  };

  var showSuccessPopup = function () {
    var fragment = document.createDocumentFragment();
    var successPopup = successPopupTemplate.cloneNode(true);
    successPopup.addEventListener('click', onSuccessPopupClick);
    document.addEventListener('keydown', onSuccessPopupHitEsc);
    fragment.appendChild(successPopup);
    document.querySelector('body').appendChild(fragment);
  };

  var submitHandler = function () {
    window.map.togglePageState();
    showSuccessPopup();
  };

  var onErrorPopupClick = function () {
    document.querySelector('.error').remove();
  };

  var onErrorPopupHitEsc = function (evt) {
    if (evt.key === ESC_KEY) {
      document.querySelector('.error').remove();
      document.removeEventListener('keydown', onErrorPopupHitEsc);
    }
  };

  var onErrorButtonClick = function () {
    document.querySelector('.error').remove();
  };

  var errorHandler = function () {
    var fragment = document.createDocumentFragment();
    var errorPopup = errorPopupTemplate.cloneNode(true);
    errorPopup.querySelector('.error__button').addEventListener('click', onErrorButtonClick);
    errorPopup.addEventListener('click', onErrorPopupClick);
    document.addEventListener('keydown', onErrorPopupHitEsc);
    fragment.appendChild(errorPopup);
    document.querySelector('main').appendChild(fragment);
  };

  var onAdFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(adForm), submitHandler, errorHandler);
  };

  var onAvatarChange = function () {
    var file = avatarInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var onAccommodationPhotoChange = function () {
    var file = accommodationPhotoInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var imgElement = document.createElement('img');
        imgElement.style.maxHeight = '100%';
        imgElement.src = reader.result;
        accommodationPreview.appendChild(imgElement);
      });

      reader.readAsDataURL(file);
    }
  };

  adFormResetButton.addEventListener('click', toggleDefaultInputValues);

  avatarInput.addEventListener('change', onAvatarChange);
  accommodationPhotoInput.addEventListener('change', onAccommodationPhotoChange);

  disableFieldsets(window.map.filterFieldsets);
  disableFieldsets(adFieldsets);
  addressInput.value = window.map.getAddressCoordinates();
  onRoomChange();

  window.form = {
    adFieldsets: adFieldsets,
    adForm: adForm,
    addressInput: addressInput,

    enableForm: enableForm,
    disableForm: disableForm,
    toggleFields: toggleFields,
    onAdFormSubmit: onAdFormSubmit
  };
})();
