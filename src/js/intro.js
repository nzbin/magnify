/**
 *  ___  ___  _____   ______  __   __ _____ ______ __    __
 * |   \/   |/  _  \ /  __  \|  \ |  |_   _|   ___|  \  /  |
 * |        |  / \  |  |  \__|   \|  | | | |  |__  \  \/  /
 * |  |\/|  |  |_|  |  |  ___        | | | |   __|  \    /
 * |  |  |  |   _   |  \_/   |  |\   |_| |_|  |      |  |
 * |__|  |__|__| |__|\____/|_|__| \__|_____|__|      |__|
 *
 * jquery.magnify.js v0.4.1
 *
 * A jQuery plugin to view images just like in windows
 *
 * Copyright (c) 2017 nzbin
 *
 * Released under the MIT License
 *
 *
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
