let objectWalk;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');

  if (typeof JSON === 'undefined') {
    JSON = {};
  }

  require('json3').runInContext(null, JSON);
  require('es6-shim');
  const es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    const obj = es7[key];

    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  objectWalk = require('../../index.js');
} else {
  objectWalk = returnExports;
}

describe('objectWalk', function() {
  const getArrayIndexes = function(object) {
    const props = [];

    if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i += 1) {
        if (i in object) {
          props.push(i);
        }
      }
    }

    return props;
  };

  it('should return `undefined`', function() {
    expect.assertions(1);
    expect.assertions(1);
    const values = [true, 'abc', 1, null, undefined, function() {}, [], /r/];
    const expected = new Array(values.length).fill();
    const actual = values.map(objectWalk);
    expect(actual).toStrictEqual(expected);
  });

  it('should return `undefined`', function() {
    expect.assertions(1);
    expect.assertions(1);
    const values = [true, 'abc', 1, null, undefined, function() {}, [], /r/];
    const expected = new Array(values.length).fill();
    const actual = values.map(function(value) {
      return objectWalk(
        value,
        function() {
          return ['abc'];
        },
        function() {},
        {},
      );
    });
    expect(actual).toStrictEqual(expected);
  });

  it('should enumerate all own keys', function() {
    expect.assertions(1);
    expect.assertions(1);
    const subject = [1, 2, 3];
    const values = [1, 2, 3, true];
    const props = ['0', '1', '2', 'abc'];
    const objects = [subject, subject, subject, subject];
    const depths = [1, 1, 1, 1];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      Object.keys,
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
  });

  it('should only iterate array indexes', function() {
    expect.assertions(1);
    expect.assertions(1);
    const subject = [1, 2, 3];
    const values = [1, 2, 3];
    const props = [0, 1, 2];
    const objects = [subject, subject, subject];
    const depths = [1, 1, 1];
    const propDepths = [1];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    const actualPropDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      function(object, depth) {
        actualPropDepths.push(depth);

        return getArrayIndexes(object);
      },
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
    expect(actualPropDepths).toStrictEqual(propDepths);
  });

  it('should only deep iterate arrays', function() {
    expect.assertions(1);
    expect.assertions(1);
    const object1 = [1, true];
    const object2 = [2, false];
    const object4 = [4];
    const object3 = [3, object4];
    const object5 = {a: true};
    const subject = [object1, object2, object3, object5];
    const values = [[1, true], 1, true, [2, false], 2, false, [3, [4]], 3, [4], 4, {a: true}];
    const props = [0, 0, 1, 1, 0, 1, 2, 0, 1, 0, 3];
    const objects = [subject, object1, object1, subject, object2, object2, subject, object3, object3, object4, subject];
    const depths = [1, 2, 2, 1, 2, 2, 1, 2, 2, 3, 1];
    const propDepths = [1, 2, 2, 2, 3, 2];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    const actualPropDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      function(object, depth) {
        actualPropDepths.push(depth);

        return getArrayIndexes(object);
      },
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
    expect(actualPropDepths).toStrictEqual(propDepths);
  });

  it('should only deep iterate arrays and report booleans', function() {
    expect.assertions(1);
    expect.assertions(1);
    const object1 = [1, true];
    const object2 = [2, false];
    const subject = [object1, object2, [3, [4]], {a: true}];
    const values = [true, false];
    const props = [1, 1];
    const objects = [object1, object2];
    const depths = [2, 2];
    const propDepths = [1, 2, 2, 2, 3, 2];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    const actualPropDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      function(object, depth) {
        actualPropDepths.push(depth);

        return getArrayIndexes(object);
      },
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        if (typeof value === 'boolean') {
          actualValues.push(value);
          actualProps.push(prop);
          actualObjects.push(object);
          actualDepths.push(depth);
        }
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
    expect(actualPropDepths).toStrictEqual(propDepths);
  });

  it('should detect circular objects', function() {
    expect.assertions(1);
    expect.assertions(1);
    const object1 = [1, true];
    const object2 = [2, false];
    const object3 = [4];
    const subject = [object1, object2, [3, object3], {a: true}];
    object3.push(subject);
    expect(function() {
      objectWalk(subject, Object.keys, function() {});
    }).toThrow('Circular object');
  });

  it('should skip `value` when supplier returns `SKIP`', function() {
    expect.assertions(1);
    expect.assertions(1);
    const object1 = [1, true];
    const object2 = [2, false];
    const object3 = [4];
    const object4 = [3, object3];
    const object5 = {a: true};
    const subject = [object1, object2, object4, object5];
    const values = [{a: true}, true, true];
    const props = ['3', 'a', 'abc'];
    const objects = [subject, object5, subject];
    const depths = [1, 2, 1];
    const propDepths = [];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    const actualPropDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      Object.keys,
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        if (Array.isArray(value)) {
          return objectWalk.SKIP;
        }

        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);

        return void 0;
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
    expect(actualPropDepths).toStrictEqual(propDepths);
  });

  it('should exit iteration when supplier returns `BREAK`', function() {
    expect.assertions(1);
    expect.assertions(1);
    const object1 = [1, true, 'a'];
    const object2 = [2, false, 'b'];
    const object3 = [4];
    const object4 = [3, object3];
    const object5 = {
      a: false,
      b: true,
    };
    const subject = [object1, object2, object4, object5];
    const values = [
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
        b: true,
      },
      false,
    ];
    const props = ['0', '0', '1', '0', '1', '2', '2', '0', '1', '0', '3', 'a'];
    const objects = [subject, object1, subject, object2, object2, object2, subject, object4, object4, object3, subject, object5];
    const depths = [1, 2, 1, 2, 2, 2, 1, 2, 2, 3, 1, 2];
    const propDepths = [];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    const actualPropDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      Object.keys,
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        if (value === true) {
          return objectWalk.BREAK;
        }

        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);

        return void 0;
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
    expect(actualPropDepths).toStrictEqual(propDepths);
  });

  it('should stop execution when supplier returns `STOP`', function() {
    expect.assertions(1);
    expect.assertions(1);
    const object1 = [1, true, 'a'];
    const object2 = [2, false, 'b'];
    const object3 = [4];
    const object4 = [3, object3];
    const object5 = {
      a: false,
      b: true,
    };
    const subject = [object1, object2, object4, object5];
    const values = [[1, true, 'a'], 1];
    const props = ['0', '0'];
    const objects = [subject, object1];
    const depths = [1, 2];
    const propDepths = [];
    const actualValues = [];
    const actualProps = [];
    const actualObjects = [];
    const actualDepths = [];
    const actualPropDepths = [];
    subject.abc = true;
    objectWalk(
      subject,
      Object.keys,
      // eslint-disable-next-line max-params
      function(value, prop, object, depth) {
        if (value === true) {
          return objectWalk.STOP;
        }

        actualValues.push(value);
        actualProps.push(prop);
        actualObjects.push(object);
        actualDepths.push(depth);

        return void 0;
      },
    );
    expect(actualValues).toStrictEqual(values);
    expect(actualProps).toStrictEqual(props);
    expect(actualObjects).toStrictEqual(objects);
    expect(actualDepths).toStrictEqual(depths);
    expect(actualPropDepths).toStrictEqual(propDepths);
  });
});
