/*!
 *  __  __    _    ____ _   _ ___ _______   __
 * |  \/  |  / \  / ___| \ | |_ _|  ___\ \ / /
 * | |\/| | / _ \| |  _|  \| || || |_   \ V /
 * | |  | |/ ___ \ |_| | |\  || ||  _|   | |
 * |_|  |_/_/   \_\____|_| \_|___|_|     |_|
 *
 * jquery.magnify - v1.6.2
 * A jQuery plugin to view images just like in windows
 * https://github.com/nzbin/magnify#readme
 *
 * Copyright (c) 2017 nzbin
 * Released under the MIT License
 */
;
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function($) {

  'use strict';
