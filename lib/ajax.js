'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var param = require('jquery-param');

function isObject(data) {
    return Object.prototype.toString.call(data) === '[object Object]' || Object.prototype.toString.call(data) === '[object Array]';
}

function hasContentType(headers) {
    return (0, _keys2.default)(headers).some(function (name) {
        return name.toLowerCase() === 'content-type';
    });
}

function setHeaders(xhr, headers) {
    headers = headers || {};

    if (!hasContentType(headers)) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    (0, _keys2.default)(headers).forEach(function (name) {
        xhr.setRequestHeader(name, headers[name]);
    });
}

function xhrConnection(type, url, data, options) {
    if (isObject(data)) {
        data = param(data);
    }
    return new _promise2.default(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        if (type === 'get') {
            url = url.replace(/#.*$/, '');
            var divider = url.indexOf('?') !== -1 ? '&' : '?';
            url = [url, data].join(divider);
            data = null;
        }

        xhr.open(type, url || '', true);
        setHeaders(xhr, options.headers);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var result = void 0;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = xhr.responseText;
                }
                resolve(result);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error('Network Error'));
        };
        xhr.send(data);
    });
}

function Ajax(options) {
    options = options || {};

    var ajax = {};

    var httpMethods = ['get', 'post', 'put', 'delete'];

    httpMethods.forEach(function (method) {
        ajax[method] = function (url, data) {
            return xhrConnection(method, url, data, options);
        };
    });
    return ajax;
}

module.exports = Ajax;