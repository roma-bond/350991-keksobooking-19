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

  var fieldsets = document.querySelectorAll('.ad-form fieldset');
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
  var featuresInputs = Array.from(adForm.querySelectorAll('.features input'));

  var enable = function () {
    adForm.classList.remove('ad-form--disabled');
    roomsInput.addEventListener('change', onRoomChange);
    typeInput.addEventListener('change', onTypeChange);
    timeinInput.addEventListener('change', onTimeinChange);
    timeoutInput.addEventListener('change', onTimeoutChange);
    avatarInput.addEventListener('change', onAvatarChange);
    accommodationPhotoInput.addEventListener('change', onAccommodationPhotoChange);
  };

  var toggleDefaultFilterValues = function () {
    window.map.filterFieldsets.forEach(function (filterNode) {
      if (filterNode.value) {
        filterNode.value = 'any';
      } else {
        Array.from(filterNode.elements).forEach(function (input) {
          input.checked = false;
        });
      }
    });
  };

  var toggleDefaultAdFormValues = function (evt) {
    if (evt) {
      evt.preventDefault();
    }
    avatarPreview.src = DEFAULT_PREVIEW_IMG_SRC;
    titleInput.value = '';
    addressInput.value = window.map.getAddressCoordinates();
    typeInput.value = 'bungalo';
    priceInput.value = '0';
    timeinInput.value = '12:00';
    timeoutInput.value = '12:00';
    roomsInput.value = '1';
    capacityInput.value = '1';
    descriptionInput.value = '';
    accommodationPreview.innerHTML = '';
    featuresInputs.forEach(function (el) {
      el.checked = false;
    });
  };

  var toggleDefaultInputValues = function () {
    toggleDefaultFilterValues();
    toggleDefaultAdFormValues();
  };

  var disable = function () {
    adForm.classList.add('ad-form--disabled');
    roomsInput.removeEventListener('change', onRoomChange);
    typeInput.removeEventListener('change', onTypeChange);
    timeinInput.removeEventListener('change', onTimeinChange);
    timeoutInput.removeEventListener('change', onTimeoutChange);
    avatarInput.removeEventListener('change', onAvatarChange);
    accommodationPhotoInput.removeEventListener('change', onAccommodationPhotoChange);
    toggleDefaultInputValues();
  };

  var toggle = function (list) {
    list.forEach(function (item) {
      item.disabled = !item.disabled;
    });
  };

  var disableFieldsets = function (list) {
    list.forEach(function (item) {
      item.disabled = true;
    });
  };

  var onResetButtonClick = function () {
    window.map.togglePageState(false);
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
    showSuccessPopup();
    window.map.togglePageState();
  };

  var onErrorPopupClick = function () {
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', onErrorPopupHitEsc);
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

  var onSubmit = function (evt) {
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

  disableFieldsets(window.map.filterFieldsets);
  disableFieldsets(fieldsets);
  onRoomChange();
  addressInput.value = window.map.getAddressCoordinates();

  avatarInput.addEventListener('change', onAvatarChange);
  accommodationPhotoInput.addEventListener('change', onAccommodationPhotoChange);
  adFormResetButton.addEventListener('click', onResetButtonClick);

  window.form = {
    fieldsets: fieldsets,
    adForm: adForm,
    addressInput: addressInput,

    enable: enable,
    disable: disable,
    toggle: toggle,
    onSubmit: onSubmit
  };
})();
