/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:3,
  maxstatements:11, maxcomplexity:4 */

/*global JSON:true, expect, module, require, describe, it, returnExports */

(function () {
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
    objectWalk = require('../../index.js');
  } else {
    objectWalk = returnExports;
  }

  describe('objectWalk', function () {
    function getArrayIndexes(object) {
      var props = [];
      if (Array.isArray(object)) {
        for (var i = 0; i < object.length; i += 1) {
          if (i in object) {
            props.push(i);
          }
        }
      }
      return props;
    }

    it('should return `undefined`', function () {
      var values = [true, 'abc', 1, null, undefined, function () {},
          [], /r/
        ],
        expected = values.map(function () {}),
        actual = values.map(objectWalk);
      expect(actual).toEqual(expected);
    });

    it('should return `undefined`', function () {
      var values = [true, 'abc', 1, null, undefined, function () {},
          [], /r/
        ],
        expected = values.map(function () {}),
        actual = values.map(function (value) {
          return objectWalk(
            value,
            function () {
              return ['abc'];
            },
            function () {}, {}
          );
        });
      expect(actual).toEqual(expected);
    });

    it('should enumerate all own keys', function () {
      var subject = [1, 2, 3],
        values = [1, 2, 3, true],
        props = ['0', '1', '2', 'abc'],
        objects = [subject, subject, subject, subject],
        depths = [1, 1, 1, 1],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [];
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
      var subject = [1, 2, 3],
        values = [1, 2, 3],
        props = [0, 1, 2],
        objects = [subject, subject, subject],
        depths = [1, 1, 1],
        propDepths = [1],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [],
        actualPropDepths = [];
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
      var object1 = [1, true],
        object2 = [2, false],
        object4 = [4],
        object3 = [3, object4],
        object5 = {
          a: true
        },
        subject = [object1, object2, object3, object5],
        values = [
          [1, true], 1, true, [2, false], 2, false, [3, [4]], 3, [4], 4, {
            a: true
          }
        ],
        props = [0, 0, 1, 1, 0, 1, 2, 0, 1, 0, 3],
        objects = [
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
        ],
        depths = [1, 2, 2, 1, 2, 2, 1, 2, 2, 3, 1],
        propDepths = [1, 2, 2, 2, 3, 2],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [],
        actualPropDepths = [];
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
      var object1 = [1, true],
        object2 = [2, false],
        subject = [object1, object2, [3, [4]], {
          a: true
        }],
        values = [true, false],
        props = [1, 1],
        objects = [object1, object2],
        depths = [2, 2],
        propDepths = [1, 2, 2, 2, 3, 2],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [],
        actualPropDepths = [];
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
      var object1 = [1, true],
        object2 = [2, false],
        object3 = [4],
        subject = [object1, object2, [3, object3], {
          a: true
        }];
      object3.push(subject);
      expect(function () {
        objectWalk(subject, Object.keys, function () {});
      }).toThrow('Circular object');
    });

    it('should skip `value` when predicate returns `SKIP`', function () {
      var object1 = [1, true],
        object2 = [2, false],
        object3 = [4],
        object4 = [3, object3],
        object5 = {
          a: true
        },
        subject = [object1, object2, object4, object5],
        values = [{
          a: true
        }, true, true],
        props = ['3', 'a', 'abc'],
        objects = [subject, object5, subject],
        depths = [1, 2, 1],
        propDepths = [],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [],
        actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        if (Array.isArray(value)) {
          return objectWalk.SKIP;
        }
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

    it('should exit iteration when predicate returns `BREAK`', function () {
      var object1 = [1, true, 'a'],
        object2 = [2, false, 'b'],
        object3 = [4],
        object4 = [3, object3],
        object5 = {
          a: false,
          b: true
        },
        subject = [object1, object2, object4, object5],
        values = [
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
        ],
        props = ['0', '0', '1', '0', '1', '2', '2', '0', '1', '0', '3', 'a'],
        objects = [
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
        ],
        depths = [1, 2, 1, 2, 2, 2, 1, 2, 2, 3, 1, 2],
        propDepths = [],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [],
        actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        if (value === true) {
          return objectWalk.BREAK;
        }
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

    it('should stop execution when predicate returns `STOP`', function () {
      var object1 = [1, true, 'a'],
        object2 = [2, false, 'b'],
        object3 = [4],
        object4 = [3, object3],
        object5 = {
          a: false,
          b: true
        },
        subject = [object1, object2, object4, object5],
        values = [[1, true, 'a'], 1],
        props = ['0', '0'],
        objects = [subject, object1],
        depths = [1, 2],
        propDepths = [],
        actualValues = [],
        actualProps = [],
        actualObjects = [],
        actualDepths = [],
        actualPropDepths = [];
      subject.abc = true;
      objectWalk(subject, Object.keys, function (value, prop, object, depth) {
        if (value === true) {
          return objectWalk.STOP;
        }
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
  });
}());
