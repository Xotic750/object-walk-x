(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.returnExports = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * @file Walks a given object and invokes a function on each iteration.
 * @version 1.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-walk-x
 */

'use strict';

var defineProperties = _dereq_('object-define-properties-x');
var isFunction = _dereq_('is-function-x');
var isPrimitive = _dereq_('is-primitive');
var isArrayLike = _dereq_('is-array-like-x');
var includes = _dereq_('array-includes');
var some = _dereq_('array-some-x');
var SKIP = 'skip';
var BREAK = 'break';
var STOP = 'stop';

/**
 * This method walks a given object and invokes a function on each
 * iteration.
 *
 * @private
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per `depth`.
 * @param {*} thisArg - The `this` binding of `supplier`.
 * @param {!Object} stack - The `stack` for tracking circularity.
 */
// eslint-disable-next-line max-params
var iWalk = function internalWalk(object, props, supplier, thisArg, stack) {
  if (isPrimitive(object)) {
    return void 0;
  }

  var length = stack.length;
  var keys = props(object, length);
  if (isArrayLike(keys) === false) {
    keys = [];
  }

  var control;
  some(keys, function _some(prop) {
    var value = object[prop];
    control = supplier.call(thisArg, value, prop, object, length);
    if (control === BREAK || control === STOP) {
      return true;
    }

    if (control === SKIP) {
      return false;
    }

    if (includes(stack, value)) {
      throw new RangeError('Circular object');
    }

    stack.push(value);
    control = iWalk(value, props, supplier, thisArg, stack);
    stack.pop();
    return control === STOP;
  });

  return control;
};

/**
 * This method walks a given object and invokes a function on each iteration.
 *
 * @private
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per iteration.
 * @param {*} [thisArg] - The `this` binding of `supplier`.
 */
// eslint-disable-next-line max-params
var oWalk = function objectWalk(object, props, supplier, thisArg) {
  if (isPrimitive(object) || isFunction(supplier) === false) {
    return;
  }

  iWalk(
    object,
    isFunction(props) ? props : Object.keys,
    supplier,
    thisArg,
    [object]
  );
};

defineProperties(oWalk, {
  /**
   * @static
   * @type string
   * @default break
   */
  BREAK: {
    value: BREAK
  },
  /**
   * @static
   * @type string
   * @default skip
   */
  SKIP: {
    value: SKIP
  },
  /**
   * @static
   * @type string
   * @default stop
   */
  STOP: {
    value: STOP
  }
});

/**
 * This method walks a given object and invokes a function on each iteration.
 *
 * @function
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per iteration.
 * @param {*} [thisArg] - The `this` binding of `supplier`.
 * @example
 * var objectWalk = require('object-walk-x');
 *
 * var subject = {
 *   one: {
 *     a: true,
 *     b: true
 *   },
 *   two: {
 *     x: true,
 *     y: true
 *   }
 * };
 *
 * objectWalk(
 *   subject,
 *   Object.keys,
 *   function (value, prop, object, depth) {
 *     object[prop + '_renamed' ] = value;
 *     delete object[prop];
 *   }
 * );
 *
 * // {
 * //  one_renamed: {
 * //    a_renamed: true,
 * //     b_renamed: true
 * //   },
 * //   two_renamed: {
 * //    x_renamed: true,
 * //     y_renamed: true
 * //   }
 * // }
 */
module.exports = oWalk;

},{"array-includes":4,"array-some-x":7,"is-array-like-x":31,"is-function-x":35,"is-primitive":41,"object-define-properties-x":50}],2:[function(_dereq_,module,exports){
/**
 * @file Executes a provided function once for each array element.
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-for-each-x
 */

'use strict';

var toObject = _dereq_('to-object-x');
var assertIsFunction = _dereq_('assert-is-function-x');
var some = _dereq_('array-some-x');

var $forEach = function forEach(array, callBack /* , thisArg */) {
  var object = toObject(array);
  // If no callback function or if callback is not a callable function
  assertIsFunction(callBack);
  var wrapped = function _wrapped(item, idx, obj) {
    // eslint-disable-next-line no-invalid-this
    callBack.call(this, item, idx, obj);
  };

  var args = [object, wrapped];
  if (arguments.length > 2) {
    args[2] = arguments[2];
  }

  some.apply(void 0, args);
};

/**
 * This method executes a provided function once for each array element.
 *
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @example
 * var forEach = require('array-for-each-x');
 *
 * var items = ['item1', 'item2', 'item3'];
 * var copy = [];
 *
 * forEach(items, function(item){
 *   copy.push(item)
 * });
 */
module.exports = $forEach;

},{"array-some-x":7,"assert-is-function-x":8,"to-object-x":60}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';

var ES = _dereq_('es-abstract/es6');
var $isNaN = Number.isNaN || function isNaN(a) {
	return a !== a;
};
var $isFinite = Number.isFinite || function isFinite(n) {
	return typeof n === 'number' && global.isFinite(n);
};
var indexOf = Array.prototype.indexOf;

module.exports = function includes(searchElement) {
	var fromIndex = arguments.length > 1 ? ES.ToInteger(arguments[1]) : 0;
	if (indexOf && !$isNaN(searchElement) && $isFinite(fromIndex) && typeof searchElement !== 'undefined') {
		return indexOf.apply(this, arguments) > -1;
	}

	var O = ES.ToObject(this);
	var length = ES.ToLength(O.length);
	if (length === 0) {
		return false;
	}
	var k = fromIndex >= 0 ? fromIndex : Math.max(0, length + fromIndex);
	while (k < length) {
		if (ES.SameValueZero(searchElement, O[k])) {
			return true;
		}
		k += 1;
	}
	return false;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"es-abstract/es6":12}],4:[function(_dereq_,module,exports){
'use strict';

var define = _dereq_('define-properties');
var ES = _dereq_('es-abstract/es6');

var implementation = _dereq_('./implementation');
var getPolyfill = _dereq_('./polyfill');
var polyfill = getPolyfill();
var shim = _dereq_('./shim');

var slice = Array.prototype.slice;

/* eslint-disable no-unused-vars */
var boundIncludesShim = function includes(array, searchElement) {
/* eslint-enable no-unused-vars */
	ES.RequireObjectCoercible(array);
	return polyfill.apply(array, slice.call(arguments, 1));
};
define(boundIncludesShim, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundIncludesShim;

},{"./implementation":3,"./polyfill":5,"./shim":6,"define-properties":9,"es-abstract/es6":12}],5:[function(_dereq_,module,exports){
'use strict';

var implementation = _dereq_('./implementation');

module.exports = function getPolyfill() {
	return Array.prototype.includes || implementation;
};

},{"./implementation":3}],6:[function(_dereq_,module,exports){
'use strict';

var define = _dereq_('define-properties');
var getPolyfill = _dereq_('./polyfill');

module.exports = function shimArrayPrototypeIncludes() {
	var polyfill = getPolyfill();
	define(
		Array.prototype,
		{ includes: polyfill },
		{ includes: function () { return Array.prototype.includes !== polyfill; } }
	);
	return polyfill;
};

},{"./polyfill":5,"define-properties":9}],7:[function(_dereq_,module,exports){
/**
 * @file Tests whether some element passes the provided function.
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-some-x
 */

'use strict';

var toObject = _dereq_('to-object-x');
var assertIsFunction = _dereq_('assert-is-function-x');

var tests = {
  // Check node 0.6.21 bug where third parameter is not boxed
  properlyBoxesNonStrict: true,
  properlyBoxesStrict: true
};

var nativeSome = Array.prototype.some;
if (nativeSome) {
  try {
    nativeSome.call([1], function () {
      // eslint-disable-next-line no-invalid-this
      tests.properlyBoxesStrict = typeof this === 'string';
    }, 'x');

    var fn = [
      'return nativeSome.call("foo", function (_, __, context) {',
      'if (Boolean(context) === false || typeof context !== "object") {',
      'tests.properlyBoxesNonStrict = false;}});'
    ].join('');

    // eslint-disable-next-line no-new-func
    Function('nativeSome', 'tests', fn)(nativeSome, tests);
  } catch (e) {
    nativeSome = null;
  }
}

var $some;
if (nativeSome && tests.properlyBoxesNonStrict && tests.properlyBoxesStrict) {
  $some = function some(array, callBack /* , thisArg */) {
    var object = toObject(array);
    var args = [assertIsFunction(callBack)];
    if (arguments.length > 2) {
      args.push(arguments[2]);
    }

    return nativeSome.apply(object, args);
  };
} else {
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
  var isString = _dereq_('is-string');
  var toLength = _dereq_('to-length-x');
  var isUndefined = _dereq_('validate.io-undefined');
  var splitString = _dereq_('has-boxed-string-x') === false;
  $some = function some(array, callBack /* , thisArg */) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitString && isString(object) ? object.split('') : object;
    var length = toLength(iterable.length);
    var thisArg;
    if (arguments.length > 2) {
      thisArg = arguments[2];
    }

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var result;
        if (isUndefined(thisArg)) {
          result = callBack(iterable[i], i, object);
        } else {
          result = callBack.call(thisArg, iterable[i], i, object);
        }

        if (result) {
          return true;
        }
      }
    }

    return false;
  };
}

/**
 * This method tests whether some element in the array passes the test
 * implemented by the provided function.
 *
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  any array element; otherwise, `false`.
 * @example
 * var some = require('array-some-x');
 *
 * function isBiggerThan10(element, index, array) {
 *   return element > 10;
 * }
 *
 * some([2, 5, 8, 1, 4], isBiggerThan10);  // false
 * some([12, 5, 8, 1, 4], isBiggerThan10); // true
 */
module.exports = $some;

},{"assert-is-function-x":8,"has-boxed-string-x":25,"is-string":43,"to-length-x":59,"to-object-x":60,"validate.io-undefined":66}],8:[function(_dereq_,module,exports){
/**
 * @file If isFunction(callbackfn) is false, throw a TypeError exception.
 * @version 1.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module assert-is-function-x
 */

'use strict';

var isFunction = _dereq_('is-function-x');
var safeToString = _dereq_('safe-to-string-x');
var isPrimitive = _dereq_('is-primitive');

/**
 * Tests `callback` to see if it is a function, throws a `TypeError` if it is
 * not. Otherwise returns the `callback`.
 *
 * @param {*} callback - The argument to be tested.
 * @throws {TypeError} Throws if `callback` is not a function.
 * @returns {*} Returns `callback` if it is function.
 * @example
 * var assertIsFunction = require('assert-is-function-x');
 * var primitive = true;
 * var mySymbol = Symbol('mySymbol');
 * var symObj = Object(mySymbol);
 * var object = {};
 * function fn () {}
 *
 * assertIsFunction(primitive);
 *    // TypeError 'true is not a function'.
 * assertIsFunction(object);
 *    // TypeError '#<Object> is not a function'.
 * assertIsFunction(mySymbol);
 *    // TypeError 'Symbol(mySymbol) is not a function'.
 * assertIsFunction(symObj);
 *    // TypeError '#<Object> is not a function'.
 * assertIsFunction(fn);
 *    // Returns fn.
 */
module.exports = function assertIsFunction(callback) {
  if (isFunction(callback) === false) {
    var msg = isPrimitive(callback) ? safeToString(callback) : '#<Object>';
    throw new TypeError(msg + ' is not a function');
  }
  return callback;
};

},{"is-function-x":35,"is-primitive":41,"safe-to-string-x":57}],9:[function(_dereq_,module,exports){
'use strict';

var keys = _dereq_('object-keys');
var foreach = _dereq_('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":22,"object-keys":53}],10:[function(_dereq_,module,exports){
'use strict';

var has = _dereq_('has');

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

var $isNaN = _dereq_('./helpers/isNaN');
var $isFinite = _dereq_('./helpers/isFinite');
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = _dereq_('./helpers/assign');
var sign = _dereq_('./helpers/sign');
var mod = _dereq_('./helpers/mod');
var isPrimitive = _dereq_('./helpers/isPrimitive');
var toPrimitive = _dereq_('es-to-primitive/es6');
var parseInteger = parseInt;
var bind = _dereq_('function-bind');
var arraySlice = bind.call(Function.call, Array.prototype.slice);
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var regexExec = bind.call(Function.call, RegExp.prototype.exec);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function (value) {
	return replace(value, trimRegex, '');
};

var ES5 = _dereq_('./es5');

var hasRegExpMatcher = _dereq_('is-regex');

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
		if (typeof value === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) { return 0; }
		if (number >= 0xFF) { return 0xFF; }
		var f = Math.floor(argument);
		if (f + 0.5 < number) { return f + 1; }
		if (number < f + 0.5) { return f; }
		if (f % 2 !== 0) { return f + 1; }
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) { return 0; } // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
		return len;
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') { return -0; }
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) { return n; }
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) { return true; }
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = argument[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return (x === y) || ($isNaN(x) && $isNaN(y));
	},

	/**
	 * 7.3.2 GetV (V, P)
	 * 1. Assert: IsPropertyKey(P) is true.
	 * 2. Let O be ToObject(V).
	 * 3. ReturnIfAbrupt(O).
	 * 4. Return O.[[Get]](P, V).
	 */
	GetV: function GetV(V, P) {
		// 7.3.2.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.2.2-3
		var O = this.ToObject(V);

		// 7.3.2.4
		return O[P];
	},

	/**
	 * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
	 * 1. Assert: IsPropertyKey(P) is true.
	 * 2. Let func be GetV(O, P).
	 * 3. ReturnIfAbrupt(func).
	 * 4. If func is either undefined or null, return undefined.
	 * 5. If IsCallable(func) is false, throw a TypeError exception.
	 * 6. Return func.
	 */
	GetMethod: function GetMethod(O, P) {
		// 7.3.9.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = this.GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return undefined;
		}

		// 7.3.9.5
		if (!this.IsCallable(func)) {
			throw new TypeError(P + 'is not a function');
		}

		// 7.3.9.6
		return func;
	},

	/**
	 * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
	 * 1. Assert: Type(O) is Object.
	 * 2. Assert: IsPropertyKey(P) is true.
	 * 3. Return O.[[Get]](P, O).
	 */
	Get: function Get(O, P) {
		// 7.3.1.1
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		// 7.3.1.3
		return O[P];
	},

	Type: function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		return ES5.Type(x);
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new TypeError('no constructor found');
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor
	CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
			if (!has(Desc, '[[Value]]')) {
				Desc['[[Value]]'] = void 0;
			}
			if (!has(Desc, '[[Writable]]')) {
				Desc['[[Writable]]'] = false;
			}
		} else {
			if (!has(Desc, '[[Get]]')) {
				Desc['[[Get]]'] = void 0;
			}
			if (!has(Desc, '[[Set]]')) {
				Desc['[[Set]]'] = void 0;
			}
		}
		if (!has(Desc, '[[Enumerable]]')) {
			Desc['[[Enumerable]]'] = false;
		}
		if (!has(Desc, '[[Configurable]]')) {
			Desc['[[Configurable]]'] = false;
		}
		return Desc;
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw
	Set: function Set(O, P, V, Throw) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		if (this.Type(Throw) !== 'Boolean') {
			throw new TypeError('Throw must be a Boolean');
		}
		if (Throw) {
			O[P] = V;
			return true;
		} else {
			try {
				O[P] = V;
			} catch (e) {
				return false;
			}
		}
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-hasownproperty
	HasOwnProperty: function HasOwnProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		return has(O, P);
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-hasproperty
	HasProperty: function HasProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		return P in O;
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
	IsConcatSpreadable: function IsConcatSpreadable(O) {
		if (this.Type(O) !== 'Object') {
			return false;
		}
		if (hasSymbols && typeof Symbol.isConcatSpreadable === 'symbol') {
			var spreadable = this.Get(O, Symbol.isConcatSpreadable);
			if (typeof spreadable !== 'undefined') {
				return this.ToBoolean(spreadable);
			}
		}
		return this.IsArray(O);
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-invoke
	Invoke: function Invoke(O, P) {
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		var argumentsList = arraySlice(arguments, 2);
		var func = this.GetV(O, P);
		return this.Call(func, O, argumentsList);
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject
	CreateIterResultObject: function CreateIterResultObject(value, done) {
		if (this.Type(done) !== 'Boolean') {
			throw new TypeError('Assertion failed: Type(done) is not Boolean');
		}
		return {
			value: value,
			done: done
		};
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-regexpexec
	RegExpExec: function RegExpExec(R, S) {
		if (this.Type(R) !== 'Object') {
			throw new TypeError('R must be an Object');
		}
		if (this.Type(S) !== 'String') {
			throw new TypeError('S must be a String');
		}
		var exec = this.Get(R, 'exec');
		if (this.IsCallable(exec)) {
			var result = this.Call(exec, R, [S]);
			if (result === null || this.Type(result) === 'Object') {
				return result;
			}
			throw new TypeError('"exec" method must return `null` or an Object');
		}
		return regexExec(R, S);
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

},{"./es5":11,"./helpers/assign":13,"./helpers/isFinite":14,"./helpers/isNaN":15,"./helpers/isPrimitive":16,"./helpers/mod":17,"./helpers/sign":18,"es-to-primitive/es6":20,"function-bind":24,"has":29,"is-regex":42}],11:[function(_dereq_,module,exports){
'use strict';

var $isNaN = _dereq_('./helpers/isNaN');
var $isFinite = _dereq_('./helpers/isFinite');

var sign = _dereq_('./helpers/sign');
var mod = _dereq_('./helpers/mod');

var IsCallable = _dereq_('is-callable');
var toPrimitive = _dereq_('es-to-primitive/es5');

var has = _dereq_('has');

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return !!value;
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) { return 0; }
		if (number === 0 || !$isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
		if (this.Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};
		// jscs:disable
		for (var key in Desc) { // eslint-disable-line
			if (has(Desc, key) && !allowed[key]) {
				return false;
			}
		}
		// jscs:enable
		var isData = has(Desc, '[[Value]]');
		var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new TypeError('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.1
	IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
			return false;
		}

		return true;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.2
	IsDataDescriptor: function IsDataDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
			return false;
		}

		return true;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.3
	IsGenericDescriptor: function IsGenericDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
			return true;
		}

		return false;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.4
	FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return Desc;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (this.IsDataDescriptor(Desc)) {
			return {
				value: Desc['[[Value]]'],
				writable: !!Desc['[[Writable]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else if (this.IsAccessorDescriptor(Desc)) {
			return {
				get: Desc['[[Get]]'],
				set: Desc['[[Set]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else {
			throw new TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
		}
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.5
	ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
		if (this.Type(Obj) !== 'Object') {
			throw new TypeError('ToPropertyDescriptor requires an object');
		}

		var desc = {};
		if (has(Obj, 'enumerable')) {
			desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
		}
		if (has(Obj, 'configurable')) {
			desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
		}
		if (has(Obj, 'value')) {
			desc['[[Value]]'] = Obj.value;
		}
		if (has(Obj, 'writable')) {
			desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
		}
		if (has(Obj, 'get')) {
			var getter = Obj.get;
			if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
				throw new TypeError('getter must be a function');
			}
			desc['[[Get]]'] = getter;
		}
		if (has(Obj, 'set')) {
			var setter = Obj.set;
			if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
				throw new TypeError('setter must be a function');
			}
			desc['[[Set]]'] = setter;
		}

		if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
			throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
		}
		return desc;
	}
};

module.exports = ES5;

},{"./helpers/isFinite":14,"./helpers/isNaN":15,"./helpers/mod":17,"./helpers/sign":18,"es-to-primitive/es5":19,"has":29,"is-callable":32}],12:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./es2015');

},{"./es2015":10}],13:[function(_dereq_,module,exports){
var has = Object.prototype.hasOwnProperty;
module.exports = function assign(target, source) {
	if (Object.assign) {
		return Object.assign(target, source);
	}
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

},{}],14:[function(_dereq_,module,exports){
var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

},{}],15:[function(_dereq_,module,exports){
module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

},{}],16:[function(_dereq_,module,exports){
module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],17:[function(_dereq_,module,exports){
module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

},{}],18:[function(_dereq_,module,exports){
module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

},{}],19:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = _dereq_('./helpers/isPrimitive');

var isCallable = _dereq_('is-callable');

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

},{"./helpers/isPrimitive":21,"is-callable":32}],20:[function(_dereq_,module,exports){
'use strict';

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = _dereq_('./helpers/isPrimitive');
var isCallable = _dereq_('is-callable');
var isDate = _dereq_('is-date-object');
var isSymbol = _dereq_('is-symbol');

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

},{"./helpers/isPrimitive":21,"is-callable":32,"is-date-object":33,"is-symbol":44}],21:[function(_dereq_,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],22:[function(_dereq_,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],23:[function(_dereq_,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],24:[function(_dereq_,module,exports){
var implementation = _dereq_('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":23}],25:[function(_dereq_,module,exports){
/**
 * @file Check support of by-index access of string characters.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-boxed-string-x
 */

'use strict';

var boxedString = Object('a');

/**
 * Check failure of by-index access of string characters (IE < 9)
 * and failure of `0 in boxedString` (Rhino).
 *
 * `true` if no failure; otherwise `false`.
 *
 * @type boolean
 */
module.exports = boxedString[0] === 'a' && (0 in boxedString);

},{}],26:[function(_dereq_,module,exports){
/**
 * @file Used to determine whether an object has an own property with the specified property key.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-hasownproperty|7.3.11 HasOwnProperty (O, P)}
 * @version 2.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-own-property-x
 */

'use strict';

var toObject = _dereq_('to-object-x');
var toPrimitive = _dereq_('es-to-primitive/es6');
var safeToString = _dereq_('safe-to-string-x');
var isSymbol = _dereq_('is-symbol');
var hop = Object.prototype.hasOwnProperty;

/**
 * The `hasOwnProperty` method returns a boolean indicating whether
 * the `object` has the specified `property`. Does not attempt to fix known
 * issues in older browsers, but does ES6ify the method.
 *
 * @param {!Object} object - The object to test.
 * @param {string|Symbol} property - The name or Symbol of the property to test.
 * @returns {boolean} `true` if the property is set on `object`, else `false`.
 * @example
 * var hasOwnProperty = require('has-own-property-x');
 * var o = {
 *   foo: 'bar'
 * };
 *
 *
 * hasOwnProperty(o, 'bar'); // false
 * hasOwnProperty(o, 'foo'); // true
 * hasOwnProperty(undefined, 'foo');
 *                   // TypeError: Cannot convert undefined or null to object
 */
module.exports = function hasOwnProperty(object, property) {
  var prop = isSymbol(property) ? property : safeToString(toPrimitive(property, String));

  return hop.call(toObject(object), prop);
};

},{"es-to-primitive/es6":20,"is-symbol":44,"safe-to-string-x":57,"to-object-x":60}],27:[function(_dereq_,module,exports){
/**
 * @file Tests if ES6 Symbol is supported.
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-symbol-support-x
 */

'use strict';

/**
 * Indicates if `Symbol`exists and creates the correct type.
 * `true`, if it exists and creates the correct type, otherwise `false`.
 *
 * @type boolean
 */
module.exports = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';

},{}],28:[function(_dereq_,module,exports){
/**
 * @file Tests if ES6 @@toStringTag is supported.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-@@tostringtag|26.3.1 @@toStringTag}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-to-string-tag-x
 */

'use strict';

/**
 * Indicates if `Symbol.toStringTag`exists and is the correct type.
 * `true`, if it exists and is the correct type, otherwise `false`.
 *
 * @type boolean
 */
module.exports = _dereq_('has-symbol-support-x') && typeof Symbol.toStringTag === 'symbol';

},{"has-symbol-support-x":27}],29:[function(_dereq_,module,exports){
var bind = _dereq_('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":24}],30:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	return toStr.call(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		toStr.call(value) !== '[object Array]' &&
		toStr.call(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{}],31:[function(_dereq_,module,exports){
/**
 * @file Determine if a value is array like.
 * @version 1.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-array-like-x
 */

'use strict';

var isNil = _dereq_('is-nil-x');
var isFunction = _dereq_('is-function-x');
var isLength = _dereq_('lodash.islength');

/**
 * Checks if value is array-like. A value is considered array-like if it's
 * not a function and has a `length` that's an integer greater than or
 * equal to 0 and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @param {*} value - The object to be tested.
 * @returns {boolean} Returns `true` if subject is array-like, else `false`.
 * @example
 * var isArrayLike = require('is-array-like-x');
 *
 * isArrayLike([1, 2, 3]); // true
 * isArrayLike(document.body.children); // true
 * isArrayLike('abc'); // true
 * isArrayLike(_.noop); // false
 */
module.exports = function isArrayLike(value) {
  return isNil(value) === false && isFunction(value, true) === false && isLength(value.length);
};

},{"is-function-x":35,"is-nil-x":40,"lodash.islength":45}],32:[function(_dereq_,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],33:[function(_dereq_,module,exports){
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},{}],34:[function(_dereq_,module,exports){
/**
 * @file ES6-compliant shim for Number.isFinite.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-number.isfinite|20.1.2.2 Number.isFinite ( number )}
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-finite-x
 */

'use strict';

var $isNaN = _dereq_('is-nan');

var $isFinite;
if (typeof Number.isFinite === 'function') {
  var MAX_SAFE_INTEGER = _dereq_('max-safe-integer');
  try {
    if (Number.isFinite(MAX_SAFE_INTEGER) && Number.isFinite(Infinity) === false) {
      $isFinite = Number.isFinite;
    }
  } catch (ignore) {}
}

/**
 * This method determines whether the passed value is a finite number.
 *
 * @param {*} number - The value to be tested for finiteness.
 * @returns {boolean} A Boolean indicating whether or not the given value is a finite number.
 * @example
 * var numIsFinite = require('is-finite-x');
 *
 * numIsFinite(Infinity);  // false
 * numIsFinite(NaN);       // false
 * numIsFinite(-Infinity); // false
 *
 * numIsFinite(0);         // true
 * numIsFinite(2e64);      // true
 *
 * numIsFinite('0');       // false, would've been true with
 *                         // global isFinite('0')
 * numIsFinite(null);      // false, would've been true with
 */
module.exports = $isFinite || function isFinite(number) {
  return !(typeof number !== 'number' || $isNaN(number) || number === Infinity || number === -Infinity);
};

},{"is-nan":37,"max-safe-integer":48}],35:[function(_dereq_,module,exports){
/**
 * @file Determine whether a given value is a function object.
 * @version 3.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-function-x
 */

'use strict';

var fToString = Function.prototype.toString;
var toStringTag = _dereq_('to-string-tag-x');
var hasToStringTag = _dereq_('has-to-string-tag-x');
var isPrimitive = _dereq_('is-primitive');
var normalise = _dereq_('normalize-space-x');
var deComment = _dereq_('replace-comments-x');
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var asyncTag = '[object AsyncFunction]';

var hasNativeClass = true;
try {
  // eslint-disable-next-line no-new-func
  Function('"use strict"; return class My {};')();
} catch (ignore) {
  hasNativeClass = false;
}

var ctrRx = /^class /;
var isES6ClassFn = function isES6ClassFunc(value) {
  try {
    return ctrRx.test(normalise(deComment(fToString.call(value), ' ')));
  } catch (ignore) {}

  // not a function
  return false;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @private
 * @param {*} value - The value to check.
 * @param {boolean} allowClass - Whether to filter ES6 classes.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 */

var tryFuncToString = function funcToString(value, allowClass) {
  try {
    if (hasNativeClass && allowClass === false && isES6ClassFn(value)) {
      return false;
    }

    fToString.call(value);
    return true;
  } catch (ignore) {}

  return false;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param {*} value - The value to check.
 * @param {boolean} [allowClass=false] - Whether to filter ES6 classes.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 * @example
 * var isFunction = require('is-function-x');
 *
 * isFunction(); // false
 * isFunction(Number.MIN_VALUE); // false
 * isFunction('abc'); // false
 * isFunction(true); // false
 * isFunction({ name: 'abc' }); // false
 * isFunction(function () {}); // true
 * isFunction(new Function ()); // true
 * isFunction(function* test1() {}); // true
 * isFunction(function test2(a, b) {}); // true
 * isFunction(async function test3() {}); // true
 * isFunction(class Test {}); // false
 * isFunction(class Test {}, true); // true
 * isFunction((x, y) => {return this;}); // true
 */
module.exports = function isFunction(value) {
  if (isPrimitive(value)) {
    return false;
  }

  var allowClass = arguments.length > 0 ? Boolean(arguments[1]) : false;
  if (hasToStringTag) {
    return tryFuncToString(value, allowClass);
  }

  if (hasNativeClass && allowClass === false && isES6ClassFn(value)) {
    return false;
  }

  var strTag = toStringTag(value);
  return strTag === funcTag || strTag === genTag || strTag === asyncTag;
};

},{"has-to-string-tag-x":28,"is-primitive":41,"normalize-space-x":49,"replace-comments-x":55,"to-string-tag-x":61}],36:[function(_dereq_,module,exports){
'use strict';

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function isNaN(value) {
	return value !== value;
};

},{}],37:[function(_dereq_,module,exports){
'use strict';

var define = _dereq_('define-properties');

var implementation = _dereq_('./implementation');
var getPolyfill = _dereq_('./polyfill');
var shim = _dereq_('./shim');

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

define(implementation, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = implementation;

},{"./implementation":36,"./polyfill":38,"./shim":39,"define-properties":9}],38:[function(_dereq_,module,exports){
'use strict';

var implementation = _dereq_('./implementation');

module.exports = function getPolyfill() {
	if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
		return Number.isNaN;
	}
	return implementation;
};

},{"./implementation":36}],39:[function(_dereq_,module,exports){
'use strict';

var define = _dereq_('define-properties');
var getPolyfill = _dereq_('./polyfill');

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function shimNumberIsNaN() {
	var polyfill = getPolyfill();
	define(Number, { isNaN: polyfill }, { isNaN: function () { return Number.isNaN !== polyfill; } });
	return polyfill;
};

},{"./polyfill":38,"define-properties":9}],40:[function(_dereq_,module,exports){
/**
 * @file Checks if `value` is `null` or `undefined`.
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-nil-x
 */

'use strict';

var isUndefined = _dereq_('validate.io-undefined');
var isNull = _dereq_('lodash.isnull');

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 * var isNil = require('is-nil-x');
 *
 * isNil(null); // => true
 * isNil(void 0); // => true
 * isNil(NaN); // => false
 */
module.exports = function isNil(value) {
  return isNull(value) || isUndefined(value);
};

},{"lodash.isnull":46,"validate.io-undefined":66}],41:[function(_dereq_,module,exports){
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

// see http://jsperf.com/testing-value-is-primitive/7
module.exports = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],42:[function(_dereq_,module,exports){
'use strict';

var has = _dereq_('has');
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

},{"has":29}],43:[function(_dereq_,module,exports){
'use strict';

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
	if (typeof value === 'string') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};

},{}],44:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}],45:[function(_dereq_,module,exports){
/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],46:[function(_dereq_,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],47:[function(_dereq_,module,exports){
/**
 * @file ES6-compliant shim for Math.sign.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-math.sign|20.2.2.29 Math.sign(x)}
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module math-sign-x
 */

'use strict';

var $isNaN = _dereq_('is-nan');

var $sign;
if (typeof Math.sign === 'function') {
  try {
    if (Math.sign(10) === 1 && Math.sign(-10) === -1 && Math.sign(0) === 0) {
      $sign = Math.sign;
    }
  } catch (ignore) {}
}

/**
 * This method returns the sign of a number, indicating whether the number is positive,
 * negative or zero.
 *
 * @param {*} x - A number.
 * @returns {number} A number representing the sign of the given argument. If the argument
 * is a positive number, negative number, positive zero or negative zero, the function will
 * return 1, -1, 0 or -0 respectively. Otherwise, NaN is returned.
 * @example
 * var mathSign = require('math-sign-x');
 *
 * mathSign(3);     //  1
 * mathSign(-3);    // -1
 * mathSign('-3');  // -1
 * mathSign(0);     //  0
 * mathSign(-0);    // -0
 * mathSign(NaN);   // NaN
 * mathSign('foo'); // NaN
 * mathSign();      // NaN
 */
module.exports = $sign || function sign(x) {
  var n = Number(x);
  if (n === 0 || $isNaN(n)) {
    return n;
  }

  return n > 0 ? 1 : -1;
};

},{"is-nan":37}],48:[function(_dereq_,module,exports){
'use strict';
module.exports = 9007199254740991;

},{}],49:[function(_dereq_,module,exports){
/**
 * @file Trims and replaces sequences of whitespace characters by a single space.
 * @version 1.3.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module normalize-space-x
 */

'use strict';

var trim = _dereq_('trim-x');
var reNormalize = new RegExp('[' + _dereq_('white-space-x').string + ']+', 'g');

/**
 * This method strips leading and trailing white-space from a string,
 * replaces sequences of whitespace characters by a single space,
 * and returns the resulting string.
 *
 * @param {string} string - The string to be normalized.
 * @returns {string} The normalized string.
 * @example
 * var normalizeSpace = require('normalize-space-x');
 *
 * normalizeSpace(' \t\na \t\nb \t\n') === 'a b'; // true
 */
module.exports = function normalizeSpace(string) {
  return trim(string).replace(reNormalize, ' ');
};

},{"trim-x":65,"white-space-x":67}],50:[function(_dereq_,module,exports){
/**
 * @file Sham for Object.defineProperties
 * @version 2.0.4
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-define-properties-x
 */

'use strict';

var forEach = _dereq_('array-for-each-x');
var $keys = _dereq_('object-keys-x');
var $defineProperty = _dereq_('object-define-property-x');
var $defineProperties = Object.defineProperties;
var definePropertiesFallback;

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

var doesDefinePropertyWork = function _doesDefinePropertyWork(object) {
  try {
    $defineProperty(object, 'sentinel', {});
    return 'sentinel' in object;
  } catch (exception) {
    return false;
  }
};

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if ($defineProperty) {
  // eslint-disable-next-line id-length
  var definePropertyWorksOnObject = doesDefinePropertyWork({});
  var definePropertyWorksOnDom = typeof document === 'undefined' || doesDefinePropertyWork(document.createElement('div'));
  if (definePropertyWorksOnObject === false || definePropertyWorksOnDom === false) {
    definePropertiesFallback = Object.defineProperties;
  }
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (Boolean($defineProperties) === false || definePropertiesFallback) {
  $defineProperties = function defineProperties(object, properties) {
    // make a valiant attempt to use the real defineProperties
    if (definePropertiesFallback) {
      try {
        return definePropertiesFallback.call(Object, object, properties);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    forEach($keys(properties), function (property) {
      if (property !== '__proto__') {
        $defineProperty(object, property, properties[property]);
      }
    });
    return object;
  };
}

/**
 * This method defines new or modifies existing properties directly on an
 * object, returning the object.
 *
 * @param {Object} object - The object on which to define or modify properties.
 * @param {Object} properties - An object whose own enumerable properties
 *  constitute descriptors for the
 * properties to be defined or modified.
 * @returns {Object} The object that was passed to the function.
 * @example
 * var defineProperties = require('object-define-properties-x');
 *
 * var obj = {};
 * defineProperties(obj, {
 *   'property1': {
 *     value: true,
 *     writable: true
 *   },
 *   'property2': {
 *     value: 'Hello',
 *     writable: true
 *   }
 *   // etc. etc.
 * });
 */
module.exports = $defineProperties;

},{"array-for-each-x":2,"object-define-property-x":51,"object-keys-x":52}],51:[function(_dereq_,module,exports){
/**
 * @file Sham for Object.defineProperty
 * @version 2.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-define-property-x
 */

'use strict';

var isPrimitive = _dereq_('is-primitive');
var owns = _dereq_('has-own-property-x');
var $defineProperty = Object.defineProperty;

var prototypeOfObject = Object.prototype;
var definePropertyFallback;
// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
if (supportsAccessors) {
  /* eslint-disable no-underscore-dangle, no-restricted-properties */
  defineGetter = prototypeOfObject.__defineGetter__;
  defineSetter = prototypeOfObject.__defineSetter__;
  lookupGetter = prototypeOfObject.__lookupGetter__;
  lookupSetter = prototypeOfObject.__lookupSetter__;
  /* eslint-enable no-underscore-dangle, no-restricted-properties */
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

var doesDefinePropertyWork = function _doesDefinePropertyWork(object) {
  try {
    $defineProperty(object, 'sentinel', {});
    return 'sentinel' in object;
  } catch (exception) {
    return false;
  }
};

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if ($defineProperty) {
  // eslint-disable-next-line id-length
  var definePropertyWorksOnObject = doesDefinePropertyWork({});
  var definePropertyWorksOnDom = typeof document === 'undefined' || doesDefinePropertyWork(document.createElement('div'));
  if (definePropertyWorksOnObject === false || definePropertyWorksOnDom === false) {
    definePropertyFallback = Object.defineProperty;
  }
}

if (Boolean($defineProperty) === false || definePropertyFallback) {
  var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
  var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
  // eslint-disable-next-line id-length
  var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

  $defineProperty = function defineProperty(object, property, descriptor) {
    if (isPrimitive(object)) {
      throw new TypeError(ERR_NON_OBJECT_TARGET + object);
    }
    if (isPrimitive(descriptor)) {
      throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
    }
    // make a valiant attempt to use the real defineProperty
    // for I8's DOM elements.
    if (definePropertyFallback) {
      try {
        return definePropertyFallback.call(Object, object, property, descriptor);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    // If it's a data property.
    if ('value' in descriptor) {
      // fail silently if 'writable', 'enumerable', or 'configurable'
      // are requested but not supported
      /*
      // alternate approach:
      if ( // can't implement these features; allow false but not true
          ('writable' in descriptor && !descriptor.writable) ||
          ('enumerable' in descriptor && !descriptor.enumerable) ||
          ('configurable' in descriptor && !descriptor.configurable)
      ))
          throw new RangeError(
            'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
          );
      */

      if (supportsAccessors && (lookupGetter.call(object, property) || lookupSetter.call(object, property))) {
        // As accessors are supported only on engines implementing
        // `__proto__` we can safely override `__proto__` while defining
        // a property to make sure that we don't hit an inherited
        // accessor.
        /* eslint-disable no-proto */
        var prototype = object.__proto__;
        object.__proto__ = prototypeOfObject;
        // Deleting a property anyway since getter / setter may be
        // defined on object itself.
        delete object[property];
        object[property] = descriptor.value;
        // Setting original `__proto__` back now.
        object.__proto__ = prototype;
        /* eslint-enable no-proto */
      } else {
        object[property] = descriptor.value;
      }
    } else {
      var hasGetter = 'get' in descriptor;
      var hasSetter = 'set' in descriptor;
      if (supportsAccessors === false && (hasGetter || hasSetter)) {
        throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
      }
      // If we got that far then getters and setters can be defined !!
      if (hasGetter) {
        defineGetter.call(object, property, descriptor.get);
      }
      if (hasSetter) {
        defineSetter.call(object, property, descriptor.set);
      }
    }
    return object;
  };
}

/**
 * This method defines a new property directly on an object, or modifies an existing property on an object,
 * and returns the object.
 *
 * @param {Object} object - The object on which to define the property.
 * @param {string} property - The name of the property to be defined or modified.
 * @param {Object} descriptor - The descriptor for the property being defined or modified.
 * @returns {Object} The object that was passed to the function.
 * @example
 * var defineProperty = require('object-define-property-x');
 *
 * var o = {}; // Creates a new object
 *
 * Object.defineProperty(o, 'a', {
 *   value: 37,
 *   writable: true
 * });
 */
module.exports = $defineProperty;

},{"has-own-property-x":26,"is-primitive":41}],52:[function(_dereq_,module,exports){
/**
 * @file An ES6 Object.keys shim.
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-keys-x
 */

'use strict';

var isArguments = _dereq_('is-arguments');
var toObject = _dereq_('to-object-x');
var originalKeys = Object.keys;

try {
  var arr = originalKeys({ a: 1, b: 2 });
  if (arr.length !== 2 || arr[0] !== 'a' || arr[1] !== 'b') {
    throw new Error('failed keys');
  }
} catch (ignore) {
  originalKeys = _dereq_('object-keys');
}

var keysWorksWithArguments = (function () {
  // Safari 5.0 bug
  return originalKeys(arguments).length === 2;
}(1, 2));

var keysHasArgumentsLengthBug = (function () {
  var argKeys = originalKeys(arguments);
  return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
}(1));

var objectKeys;
if (!keysWorksWithArguments || keysHasArgumentsLengthBug) {
  var arraySlice = Array.prototype.slice;
  objectKeys = function keys(object) {
    var obj = toObject(object);
    if (isArguments(object)) {
      return originalKeys(arraySlice.call(obj));
    }

    return originalKeys(obj);
  };
} else {
  objectKeys = function keys(object) {
    return originalKeys(toObject(object));
  };
}

/**
 * This method returns an array of a given object's own enumerable properties,
 * in the same order as that provided by a for...in loop (the difference being
 * that a for-in loop enumerates properties in the prototype chain as well).
 *
 * @param {*} obj The object of which the enumerable own properties are to be returned.
 * @return {Array} An array of strings that represent all the enumerable properties of the given object.
 * @example
 * var objectKeys = require('object-keys-x');
 *
 * var obj = {
 *   arr: [],
 *   bool: true,
 *   'null': null,
 *   num: 42,
 *   obj: { },
 *   str: 'boz',
 *   undefined: void 0
 * };
 *
 * objectKeys(obj); // ['arr', 'bool', 'null', 'num', 'obj', 'str', 'undefined']
 */
module.exports = objectKeys;

},{"is-arguments":30,"object-keys":53,"to-object-x":60}],53:[function(_dereq_,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = _dereq_('./isArguments');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":54}],54:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],55:[function(_dereq_,module,exports){
/**
 * @file Replace the comments in a string.
 * @version 1.0.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module replace-comments-x
 */

'use strict';

var isString = _dereq_('is-string');
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

var $replaceComments = function replaceComments(string) {
  var replacement = arguments.length > 1 && isString(arguments[1]) ? arguments[1] : '';
  return isString(string) ? string.replace(STRIP_COMMENTS, replacement) : '';
};

/**
 * This method replaces comments in a string.
 *
 * @param {string} string - The string to be stripped.
 * @param {string} [replacement] - The string to be used as a replacement.
 * @returns {string} The new string with the comments replaced.
 * @example
 * var replaceComments = require('replace-comments-x');
 *
 * replaceComments(test;/* test * /, ''), // 'test;'
 * replaceComments(test; // test, ''), // 'test;'
 */
module.exports = $replaceComments;

},{"is-string":43}],56:[function(_dereq_,module,exports){
/**
 * @file ES6-compliant shim for RequireObjectCoercible.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-requireobjectcoercible|7.2.1 RequireObjectCoercible ( argument )}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module require-object-coercible-x
 */

'use strict';

var isNil = _dereq_('is-nil-x');

/**
 * The abstract operation RequireObjectCoercible throws an error if argument
 * is a value that cannot be converted to an Object using ToObject.
 *
 * @param {*} value - The `value` to check.
 * @throws {TypeError} If `value` is a `null` or `undefined`.
 * @returns {string} The `value`.
 * @example
 * var RequireObjectCoercible = require('require-object-coercible-x');
 *
 * RequireObjectCoercible(); // TypeError
 * RequireObjectCoercible(null); // TypeError
 * RequireObjectCoercible('abc'); // 'abc'
 * RequireObjectCoercible(true); // true
 * RequireObjectCoercible(Symbol('foo')); // Symbol('foo')
 */
module.exports = function RequireObjectCoercible(value) {
  if (isNil(value)) {
    throw new TypeError('Cannot call method on ' + value);
  }

  return value;
};

},{"is-nil-x":40}],57:[function(_dereq_,module,exports){
/**
 * @file Like ES6 ToString but handles Symbols too.
 * @see {@link https://github.com/Xotic750/to-string-x|to-string-x}
 * @version 1.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module safe-to-string-x
 */

'use strict';

var isSymbol = _dereq_('is-symbol');
var pToString = _dereq_('has-symbol-support-x') && Symbol.prototype.toString;

/**
 * The abstract operation `safeToString` converts a `Symbol` literal or
 * object to `Symbol()` instead of throwing a `TypeError`.
 *
 * @param {*} value - The value to convert to a string.
 * @returns {string} The converted value.
 * @example
 * var safeToString = require('safe-to-string-x');
 *
 * safeToString(); // 'undefined'
 * safeToString(null); // 'null'
 * safeToString('abc'); // 'abc'
 * safeToString(true); // 'true'
 * safeToString(Symbol('foo')); // 'Symbol(foo)'
 * safeToString(Symbol.iterator); // 'Symbol(Symbol.iterator)'
 * safeToString(Object(Symbol.iterator)); // 'Symbol(Symbol.iterator)'
 */
module.exports = function safeToString(value) {
  return pToString && isSymbol(value) ? pToString.call(value) : String(value);
};

},{"has-symbol-support-x":27,"is-symbol":44}],58:[function(_dereq_,module,exports){
/**
 * @file ToInteger converts 'argument' to an integral numeric value.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger|7.1.4 ToInteger ( argument )}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-integer-x
 */

'use strict';

var $isNaN = _dereq_('is-nan');
var $isFinite = _dereq_('is-finite-x');
var $sign = _dereq_('math-sign-x');

/**
 * Converts `value` to an integer.
 *
 * @param {*} value - The value to convert.
 * @returns {number} Returns the converted integer.
 *
 * @example
 * var toInteger = require('to-integer-x');
 * toInteger(3); // 3
 * toInteger(Number.MIN_VALUE); // 0
 * toInteger(Infinity); // 1.7976931348623157e+308
 * toInteger('3'); // 3
 */
module.exports = function ToInteger(value) {
  var number = Number(value);
  if ($isNaN(number)) {
    return 0;
  }

  if (number === 0 || $isFinite(number) === false) {
    return number;
  }

  return $sign(number) * Math.floor(Math.abs(number));
};

},{"is-finite-x":34,"is-nan":37,"math-sign-x":47}],59:[function(_dereq_,module,exports){
/**
 * @file ES6-compliant shim for ToLength.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-tolength|7.1.15 ToLength ( argument )}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-length-x
 */

'use strict';

var toInteger = _dereq_('to-integer-x');
var MAX_SAFE_INTEGER = _dereq_('max-safe-integer');

/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * @param {*} value - The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 * var toLength = require('to-length-x');
 * toLength(3); // 3
 * toLength(Number.MIN_VALUE); // 0
 * toLength(Infinity); // Number.MAX_SAFE_INTEGER
 * toLength('3'); // 3
 */
module.exports = function ToLength(value) {
  var len = toInteger(value);
  // includes converting -0 to +0
  if (len <= 0) {
    return 0;
  }

  if (len > MAX_SAFE_INTEGER) {
    return MAX_SAFE_INTEGER;
  }

  return len;
};

},{"max-safe-integer":48,"to-integer-x":58}],60:[function(_dereq_,module,exports){
/**
 * @file ES6-compliant shim for ToObject.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-toobject|7.1.13 ToObject ( argument )}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-object-x
 */

'use strict';

var $requireObjectCoercible = _dereq_('require-object-coercible-x');

/**
 * The abstract operation ToObject converts argument to a value of
 * type Object.
 *
 * @param {*} value - The `value` to convert.
 * @throws {TypeError} If `value` is a `null` or `undefined`.
 * @returns {!Object} The `value` converted to an object.
 * @example
 * var ToObject = require('to-object-x');
 *
 * ToObject(); // TypeError
 * ToObject(null); // TypeError
 * ToObject('abc'); // Object('abc')
 * ToObject(true); // Object(true)
 * ToObject(Symbol('foo')); // Object(Symbol('foo'))
 */
module.exports = function ToObject(value) {
  return Object($requireObjectCoercible(value));
};

},{"require-object-coercible-x":56}],61:[function(_dereq_,module,exports){
/**
 * @file Get an object's ES6 @@toStringTag.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring|19.1.3.6 Object.prototype.toString ( )}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-string-tag-x
 */

'use strict';

var isNull = _dereq_('lodash.isnull');
var isUndefined = _dereq_('validate.io-undefined');
var toStr = Object.prototype.toString;

/**
 * The `toStringTag` method returns "[object type]", where type is the
 * object type.
 *
 * @param {*} value - The object of which to get the object type string.
 * @returns {string} The object type string.
 * @example
 * var toStringTag = require('to-string-tag-x');
 *
 * var o = new Object();
 * toStringTag(o); // returns '[object Object]'
 */
module.exports = function toStringTag(value) {
  if (isNull(value)) {
    return '[object Null]';
  }

  if (isUndefined(value)) {
    return '[object Undefined]';
  }

  return toStr.call(value);
};

},{"lodash.isnull":46,"validate.io-undefined":66}],62:[function(_dereq_,module,exports){
/**
 * @file ES6-compliant shim for ToString.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-tostring|7.1.12 ToString ( argument )}
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-string-x
 */

'use strict';

var isSymbol = _dereq_('is-symbol');

/**
 * The abstract operation ToString converts argument to a value of type String.
 *
 * @param {*} value - The value to convert to a string.
 * @throws {TypeError} If `value` is a Symbol.
 * @returns {string} The converted value.
 * @example
 * var $toString = require('to-string-x');
 *
 * $toString(); // 'undefined'
 * $toString(null); // 'null'
 * $toString('abc'); // 'abc'
 * $toString(true); // 'true'
 * $toString(Symbol('foo')); // TypeError
 * $toString(Symbol.iterator); // TypeError
 * $toString(Object(Symbol.iterator)); // TypeError
 */
module.exports = function ToString(value) {
  if (isSymbol(value)) {
    throw new TypeError('Cannot convert a Symbol value to a string');
  }

  return String(value);
};

},{"is-symbol":44}],63:[function(_dereq_,module,exports){
/**
 * @file This method removes whitespace from the left end of a string.
 * @version 1.3.3
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module trim-left-x
 */

'use strict';

var $toString = _dereq_('to-string-x');
var reLeft = new RegExp('^[' + _dereq_('white-space-x').string + ']+');

/**
 * This method removes whitespace from the left end of a string.
 *
 * @param {string} string - The string to trim the left end whitespace from.
 * @returns {undefined|string} The left trimmed string.
 * @example
 * var trimLeft = require('trim-left-x');
 *
 * trimLeft(' \t\na \t\n') === 'a \t\n'; // true
 */
module.exports = function trimLeft(string) {
  return $toString(string).replace(reLeft, '');
};

},{"to-string-x":62,"white-space-x":67}],64:[function(_dereq_,module,exports){
/**
 * @file This method removes whitespace from the right end of a string.
 * @version 1.3.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module trim-right-x
 */

'use strict';

var $toString = _dereq_('to-string-x');
var reRight = new RegExp('[' + _dereq_('white-space-x').string + ']+$');

/**
 * This method removes whitespace from the right end of a string.
 *
 * @param {string} string - The string to trim the right end whitespace from.
 * @returns {undefined|string} The right trimmed string.
 * @example
 * var trimRight = require('trim-right-x');
 *
 * trimRight(' \t\na \t\n') === ' \t\na'; // true
 */
module.exports = function trimRight(string) {
  return $toString(string).replace(reRight, '');
};

},{"to-string-x":62,"white-space-x":67}],65:[function(_dereq_,module,exports){
/**
 * @file This method removes whitespace from the left and right end of a string.
 * @version 1.0.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module trim-x
 */

'use strict';

var trimLeft = _dereq_('trim-left-x');
var trimRight = _dereq_('trim-right-x');

/**
 * This method removes whitespace from the left and right end of a string.
 *
 * @param {string} string - The string to trim the whitespace from.
 * @returns {undefined|string} The trimmed string.
 * @example
 * var trim = require('trim-x');
 *
 * trim(' \t\na \t\n') === 'a'; // true
 */
module.exports = function trim(string) {
  return trimLeft(trimRight(string));
};

},{"trim-left-x":63,"trim-right-x":64}],66:[function(_dereq_,module,exports){
/**
*
*	VALIDATE: undefined
*
*
*	DESCRIPTION:
*		- Validates if a value is undefined.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

/**
* FUNCTION: isUndefined( value )
*	Validates if a value is undefined.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is undefined
*/
function isUndefined( value ) {
	return value === void 0;
} // end FUNCTION isUndefined()


// EXPORTS //

module.exports = isUndefined;

},{}],67:[function(_dereq_,module,exports){
/**
 * @file List of ECMAScript5 white space characters.
 * @version 2.0.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module white-space-x
 */

'use strict';

/**
 * An array of the ES5 whitespace char codes, string, and their descriptions.
 *
 * @name list
 * @type Array.<Object>
 * @example
 * var whiteSpace = require('white-space-x');
 * whiteSpaces.list.foreach(function (item) {
 *   console.log(lib.description, item.code, item.string);
 * });
 */
var list = [
  {
    code: 0x0009,
    description: 'Tab',
    string: '\u0009'
  },
  {
    code: 0x000a,
    description: 'Line Feed',
    string: '\u000a'
  },
  {
    code: 0x000b,
    description: 'Vertical Tab',
    string: '\u000b'
  },
  {
    code: 0x000c,
    description: 'Form Feed',
    string: '\u000c'
  },
  {
    code: 0x000d,
    description: 'Carriage Return',
    string: '\u000d'
  },
  {
    code: 0x0020,
    description: 'Space',
    string: '\u0020'
  },
  /*
  {
    code: 0x0085,
    description: 'Next line - Not ES5 whitespace',
    string: '\u0085'
  }
  */
  {
    code: 0x00a0,
    description: 'No-break space',
    string: '\u00a0'
  },
  {
    code: 0x1680,
    description: 'Ogham space mark',
    string: '\u1680'
  },
  {
    code: 0x180e,
    description: 'Mongolian vowel separator',
    string: '\u180e'
  },
  {
    code: 0x2000,
    description: 'En quad',
    string: '\u2000'
  },
  {
    code: 0x2001,
    description: 'Em quad',
    string: '\u2001'
  },
  {
    code: 0x2002,
    description: 'En space',
    string: '\u2002'
  },
  {
    code: 0x2003,
    description: 'Em space',
    string: '\u2003'
  },
  {
    code: 0x2004,
    description: 'Three-per-em space',
    string: '\u2004'
  },
  {
    code: 0x2005,
    description: 'Four-per-em space',
    string: '\u2005'
  },
  {
    code: 0x2006,
    description: 'Six-per-em space',
    string: '\u2006'
  },
  {
    code: 0x2007,
    description: 'Figure space',
    string: '\u2007'
  },
  {
    code: 0x2008,
    description: 'Punctuation space',
    string: '\u2008'
  },
  {
    code: 0x2009,
    description: 'Thin space',
    string: '\u2009'
  },
  {
    code: 0x200a,
    description: 'Hair space',
    string: '\u200a'
  },
  /*
  {
    code: 0x200b,
    description: 'Zero width space - Not ES5 whitespace',
    string: '\u200b'
  },
  */
  {
    code: 0x2028,
    description: 'Line separator',
    string: '\u2028'
  },
  {
    code: 0x2029,
    description: 'Paragraph separator',
    string: '\u2029'
  },
  {
    code: 0x202f,
    description: 'Narrow no-break space',
    string: '\u202f'
  },
  {
    code: 0x205f,
    description: 'Medium mathematical space',
    string: '\u205f'
  },
  {
    code: 0x3000,
    description: 'Ideographic space',
    string: '\u3000'
  },
  {
    code: 0xfeff,
    description: 'Byte Order Mark',
    string: '\ufeff'
  }
];

var string = '';
var length = list.length;
for (var i = 0; i < length; i += 1) {
  string += list[i].string;
}

/**
 * A string of the ES5 whitespace characters.
 *
 * @name string
 * @type string
 * @example
 * var whiteSpace = require('white-space-x');
 * var characters = [
 *   '\u0009',
 *   '\u000a',
 *   '\u000b',
 *   '\u000c',
 *   '\u000d',
 *   '\u0020',
 *   '\u00a0',
 *   '\u1680',
 *   '\u180e',
 *   '\u2000',
 *   '\u2001',
 *   '\u2002',
 *   '\u2003',
 *   '\u2004',
 *   '\u2005',
 *   '\u2006',
 *   '\u2007',
 *   '\u2008',
 *   '\u2009',
 *   '\u200a',
 *   '\u2028',
 *   '\u2029',
 *   '\u202f',
 *   '\u205f',
 *   '\u3000',
 *   '\ufeff'
 * ];
 * var ws = characters.join('');
 * var re1 = new RegExp('^[' + whiteSpace.string + ']+$)');
 * re1.test(ws); // true
 */
module.exports = {
  list: list,
  string: string
};

},{}]},{},[1])(1)
});