'use strict';

(function () {
  var TIMEOUT_IN_MS = 15000;
  var StatusCode = {
    OK: 200
  };

  var serverRequest = function (url, onLoad, onError, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open(method, url);
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    if (data) {
      xhr.addEventListener('load', onLoad, onError);
      xhr.send(data);
    } else {
      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          window.map.advertisements = xhr.response;
          onLoad(window.map.applyFilters(window.map.advertisements));
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.send();
    }
  };

  var download = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    serverRequest(URL, onLoad, onError, 'GET');
  };

  var upload = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';
    serverRequest(URL, onLoad, onError, 'POST', data);
  };

  window.backend = {
    download: download,
    upload: upload
  };
})();
