import defineProperties from 'object-define-properties-x';
import isFunction from 'is-function-x';
import isPrimitive from 'is-primitive';
import isArrayLike from 'is-array-like-x';
import includes from 'array-includes-x';
import some from 'array-some-x';
import objectKeys from 'object-keys-x';
var aPop = [].pop;
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
 * @param {!object} stack - The `stack` for tracking circularity.
 */

var iWalk = function internalWalk(object, props, supplier, thisArg, stack) {
  if (isPrimitive(object)) {
    /* eslint-disable-next-line no-void */
    return void 0;
  }

  var length = stack.length;
  var keys = props(object, length);

  if (isArrayLike(keys) === false) {
    keys = [];
  }
  /* eslint-disable-next-line no-void */


  var control = void 0;
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

    stack[stack.length] = value;
    control = iWalk(value, props, supplier, thisArg, stack);
    aPop.call(stack);
    return control === STOP;
  });
  return control;
};
/**
 * This method walks a given object and invokes a function on each iteration.
 *
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per iteration.
 * @param {*} [thisArg] - The `this` binding of `supplier`.
 */


var oWalk = function objectWalk(object, props, supplier, thisArg) {
  if (isPrimitive(object) || isFunction(supplier) === false) {
    return;
  }

  iWalk(object, isFunction(props) ? props : objectKeys, supplier, thisArg, [object]);
}; // noinspection JSValidateTypes


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
export default oWalk;

//# sourceMappingURL=object-walk-x.esm.js.map