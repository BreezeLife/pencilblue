/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Provides a set of functions for common validations.
 *
 * @class ValidationService
 * @constructor
 * @module Validation
 */
function ValidationService(){}

var FILE_NAME_SAFE_REGEX = /^[a-zA-Z0-9-_\.]+$/;
var VERSION_REGEX        = /^[0-9]+\.[0-9]+\.[0-9]+$/;
var EMAIL_REGEX          = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var URL_REGEX            = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var URL_REGEX_NO_HOST    = /^\/.*\/{0,1}$/;

/**
 * Validates an email address
 *
 * @method validateEmail
 * @param {String} value
 * @param {Boolean} required
 */
ValidationService.validateEmail = function(value, required) {
	if (!value && !required) {
		return true;
	}

	return pb.utils.isString(value) && value.search(EMAIL_REGEX) !== -1;
};

/**
 * Validates a version number
 *
 * @method validateVersionNum
 * @param {String} value
 * @param {Boolean} required
 */
ValidationService.validateVersionNum = function(value, required) {
	if (!value && !required) {
		return true;
	}

	return pb.utils.isString(value) && value.search(VERSION_REGEX) !== -1;
};

/**
 * Validates an URL
 *
 * @method validateUrl
 * @param {String} value
 * @param {Boolean} required
 */
ValidationService.validateUrl = function(value, required) {
	if (!value && !required) {
		return true;
	}

	return pb.utils.isString(value) && (value.search(URL_REGEX) !== -1 || value.search(URL_REGEX_NO_HOST) !== -1);
};

/**
 * Validates a file name
 *
 * @method validateSafeFileName
 * @param {String} value
 * @param {Boolean} required
 */
ValidationService.validateSafeFileName = function(value, required) {
	if (!value && !required) {
		return true;
	}

	return pb.utils.isString(value) && value.search(FILE_NAME_SAFE_REGEX) !== -1;
};

/**
 * Validates a string
 *
 * @method validateStr
 * @param {String} value
 * @param {Boolean} required
 */
ValidationService.validateStr = function(value, required) {
	if (!value && !required) {
		return true;
	}
	return pb.utils.isString(value);
};

/**
 * Validates a string is not empty
 *
 * @method validateNonEmptyStr
 * @param {String} value
 * @param {Boolean} required
 */
ValidationService.validateNonEmptyStr = function(value, required) {
	if (!value && !required) {
		return true;
	}
	return pb.utils.isString(value) && value.length > 0;
};

/**
 * Validates an array
 *
 * @method validateArray
 * @param {Array} value
 * @param {Boolean} required
 */
ValidationService.validateArray = function(value, required) {
	if (!value && !required) {
		return true;
	}
	return util.isArray(value);
};

/**
 * Validates an object
 *
 * @method validateObject
 * @param {Object} value    
 * @param {Boolean} required
 */
ValidationService.validateObject = function(value, required) {
	if (!value && !required) {
		return true;
	}
	return pb.utils.isObject(value);
};

//exports
module.exports = ValidationService;
