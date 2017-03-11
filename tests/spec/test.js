/* jslint maxlen:80, es6:true, white:true */

/* jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
   freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
   nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
   es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
   maxstatements:3, maxcomplexity:2 */

/* eslint strict: 1, max-statements: 1, array-callback-return: 1,
   max-statements-per-line: 1, max-nested-callbacks: 1, max-lines: 1 */

/* global JSON:true, expect, module, require, describe, it, returnExports */

;(function () { // eslint-disable-line no-extra-semi

  'use strict';

  var objectWalk;
  if (typeof module === 'object' && module.exports) {
    require('es5-shim');
    require('es5-shim/es5-sham');
    if (typeof JSON === 'undefined') {
      JSON = {};
    }
    require('json3').runInContext(null, JSON);
    require('es6-shim');
    var es7 = require('es7-shim');
    Object.keys(es7).forEach(function (key) {
      var obj = es7[key];
      if (typeof obj.shim === 'function') {
        obj.shim();
      }
    });
    objectWalk = require('../../index.js');
  } else {
    objectWalk = returnExports;
  }

  describe('objectWalk', function () {
    var getArrayIndexes = function (object) {
      var props = [];
      if (Array.isArray(object)) {
        for (var i = 0; i < object.length; i += 1) {
          if (i in object) {
            props.push(i);
          }
        }
      }
      return props;
    };

    it('should return `undefined`', function () {
      var values = [true, 'abc', 1, null, undefined, function () {}, [], /r/];
      var expected = values.map(function () {});
      var actual = values.map(objectWalk);
      expect(actual).toEqual(expected);
    });

    it('should return `undefined`', function () {
      var values = [true, 'abc', 1, null, undefined, function () {}, [], /r/];
      var expected = values.map(function () {});
      var actual = values.map(function (value) {
        return objectWalk(value, function () { return ['abc']; }, function () {}, {});
      });
      expect(actual).toEqual(expected);
    });

    it('should enumerate all own keys', function () {
      var subject = [1, 2, 3];
      var values = [1, 2, 3, true];
      var props = ['0', '1', '2', 'abc'];
      var objects = [subject, subject, subject, subject];
      var depths = [1, 1, 1, 1];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
    });

    it('should only iterate array indexes', function () {
      var subject = [1, 2, 3];
      var values = [1, 2, 3];
      var props = [0, 1, 2];
      var objects = [subject, subject, subject];
      var depths = [1, 1, 1];
      var propDepths = [1];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      var actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, function (object, depth) {
        actualPropDepths.push(depth);
        return getArrayIndexes(object);
      }, function (value, prop, object, depth) {
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
      expect(actualPropDepths).toEqual(propDepths);
    });

    it('should only deep iterate arrays', function () {
      var object1 = [1, true];
      var object2 = [2, false];
      var object4 = [4];
      var object3 = [3, object4];
      var object5 = { a: true };
      var subject = [object1, object2, object3, object5];
      var values = [[1, true], 1, true, [2, false], 2, false, [3, [4]], 3, [4], 4, { a: true }];
      var props = [0, 0, 1, 1, 0, 1, 2, 0, 1, 0, 3];
      var objects = [
        subject,
        object1,
        object1,
        subject,
        object2,
        object2,
        subject,
        object3,
        object3,
        object4,
        subject
      ];
      var depths = [1, 2, 2, 1, 2, 2, 1, 2, 2, 3, 1];
      var propDepths = [1, 2, 2, 2, 3, 2];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      var actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, function (object, depth) {
        actualPropDepths.push(depth);
        return getArrayIndexes(object);
      }, function (value, prop, object, depth) {
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
      expect(actualPropDepths).toEqual(propDepths);
    });

    it('should only deep iterate arrays and report booleans', function () {
      var object1 = [1, true];
      var object2 = [2, false];
      var subject = [object1, object2, [3, [4]], { a: true }];
      var values = [true, false];
      var props = [1, 1];
      var objects = [object1, object2];
      var depths = [2, 2];
      var propDepths = [1, 2, 2, 2, 3, 2];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      var actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, function (object, depth) {
        actualPropDepths.push(depth);
        return getArrayIndexes(object);
      }, function (value, prop, object, depth) {
        if (typeof value === 'boolean') {
          actualValues.push(value);
          actualProps.push(prop);
          actualObjects.push(object);
          actualDepths.push(depth);
        }
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
      expect(actualPropDepths).toEqual(propDepths);
    });

    it('should detect circular objects', function () {
      var object1 = [1, true];
      var object2 = [2, false];
      var object3 = [4];
      var subject = [object1, object2, [3, object3], { a: true }];
      object3.push(subject);
      expect(function () {
        objectWalk(subject, Object.keys, function () {});
      }).toThrow('Circular object');
    });

    it('should skip `value` when predicate returns `SKIP`', function () {
      var object1 = [1, true];
      var object2 = [2, false];
      var object3 = [4];
      var object4 = [3, object3];
      var object5 = { a: true };
      var subject = [object1, object2, object4, object5];
      var values = [{ a: true }, true, true];
      var props = ['3', 'a', 'abc'];
      var objects = [subject, object5, subject];
      var depths = [1, 2, 1];
      var propDepths = [];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      var actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        if (Array.isArray(value)) {
          return objectWalk.SKIP;
        }
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
        return void 0;
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
      expect(actualPropDepths).toEqual(propDepths);
    });

    it('should exit iteration when predicate returns `BREAK`', function () {
      var object1 = [1, true, 'a'];
      var object2 = [2, false, 'b'];
      var object3 = [4];
      var object4 = [3, object3];
      var object5 = {
        a: false,
        b: true
      };
      var subject = [object1, object2, object4, object5];
      var values = [
        [1, true, 'a'],
        1,
        [2, false, 'b'],
        2,
        false,
        'b',
        [3, [4]],
        3,
        [4],
        4,
        {
          a: false,
          b: true
        },
        false
      ];
      var props = ['0', '0', '1', '0', '1', '2', '2', '0', '1', '0', '3', 'a'];
      var objects = [
        subject,
        object1,
        subject,
        object2,
        object2,
        object2,
        subject,
        object4,
        object4,
        object3,
        subject,
        object5
      ];
      var depths = [1, 2, 1, 2, 2, 2, 1, 2, 2, 3, 1, 2];
      var propDepths = [];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      var actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        if (value === true) {
          return objectWalk.BREAK;
        }
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
        return void 0;
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
      expect(actualPropDepths).toEqual(propDepths);
    });

    it('should stop execution when predicate returns `STOP`', function () {
      var object1 = [1, true, 'a'];
      var object2 = [2, false, 'b'];
      var object3 = [4];
      var object4 = [3, object3];
      var object5 = {
        a: false,
        b: true
      };
      var subject = [object1, object2, object4, object5];
      var values = [[1, true, 'a'], 1];
      var props = ['0', '0'];
      var objects = [subject, object1];
      var depths = [1, 2];
      var propDepths = [];
      var actualValues = [];
      var actualProps = [];
      var actualObjects = [];
      var actualDepths = [];
      var actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        if (value === true) {
          return objectWalk.STOP;
        }
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
        return void 0;
      });
      expect(actualValues).toEqual(values);
      expect(actualProps).toEqual(props);
      expect(actualObjects).toEqual(objects);
      expect(actualDepths).toEqual(depths);
      expect(actualPropDepths).toEqual(propDepths);
    });
  });
}());
