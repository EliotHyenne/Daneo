'use strict';

jest.dontMock('../src/model');

var Model = require('../src/model');
var noop = () => void 0;

describe('Model', function() {

  describe('constructor', function() {

    it('should parse input data', function() {
      var model1 = new Model('{}', noop);
      var model2 = new Model('{"a": 1}', noop);
      var model3 = new Model('{"b": [1, "2"]}', noop);

      expect(model1.data).toEqual({});
      expect(model2.data).toEqual({a: 1});
      expect(model3.data).toEqual({b: [1, '2']});
    });

    it('should throw the error in case input data is not valid', function() {
      expect(() => new Model('', noop)).toThrow('Invalid data');
      expect(() => new Model('{a: b}', noop)).toThrow('Invalid data');
    });

    it('should create save method', function() {
      var saveMock = jest.genMockFunction();
      var model = new Model('{"a": 1, "b": [2]}', saveMock);

      model.save();

      expect(saveMock).toBeCalledWith({a: 1, b: [2]});
    });

    it('should create next id property', function() {
      var model1 = new Model('{}', noop);
      var model2 = new Model('{"1": {}}', noop);
      var model3 = new Model('{"8": {}, "2": {}}', noop);
      var model4 = new Model('{}', noop);

      model4.add([{}, {}, {}, {}]);

      expect(model1.nextId).toBe(0);
      expect(model2.nextId).toBe(2);
      expect(model3.nextId).toBe(9);
      expect(model4.nextId).toBe(4);
    });

  });

  describe('get method', function() {

    beforeEach(function() {
      this.model = new Model('{}', noop);
    });

    it('should return entry by its id', function() {
      var id = this.model.add({});
      var insertedEntry = this.model.get(id);

      expect(id).toEqual(insertedEntry.id);
    });

  });

  describe('add method', function() {

    beforeEach(function() {
      this.model = new Model('{}', noop);
    });

    it('should add single entry', function() {
      var entry1 = {a: 1};
      var entry2 = {a: 2};

      this.model.add(entry1);
      this.model.add(entry2);

      expect(Object.keys(this.model.find()).length).toBe(2);
      expect(this.model.data[0]).toEqual(entry1);
      expect(this.model.data[1]).toEqual(entry2);
    });

    it('should return an id of the single added entry', function() {
      var id0 = this.model.add({a: 1});
      var id1 = this.model.add({a: 2});

      expect(id0).toBe(0);
      expect(id1).toBe(1);
    });

    it('should add multiple entries at once', function() {
      var entries1 = [{a: 1}];
      var entries2 = [{a: 2}, {a: 3}];

      this.model.add(entries1);
      this.model.add(entries2);

      expect(Object.keys(this.model.find()).length).toBe(3);
      expect(this.model.data[0]).toEqual(entries1[0]);
      expect(this.model.data[1]).toEqual(entries2[0]);
      expect(this.model.data[2]).toEqual(entries2[1]);
    });

    it('should return ids of the multiple added entries', function() {
      var ids0 = this.model.add([{a: 1}]);
      var ids1 = this.model.add([{a: 2}, {a: 3}]);

      expect(ids0).toEqual([0]);
      expect(ids1).toEqual([1, 2]);
    });

  });

  describe('update method', function() {

    beforeEach(function() {
      this.model = new Model('{"0": {}, "1": {"bar": 1}}', noop);
    });

    it('should update by id', function() {
      this.model.update(0, {foo: 'bar'});
      this.model.update(1, {bar: 'baz'});

      expect(this.model.get(0)).toEqual({id: 0, foo: 'bar'});
      expect(this.model.get(1)).toEqual({id: 1, bar: 'baz'});
    });

    it('should update an object', function() {
      this.model.update({id: 0, foo: 'bar'});
      this.model.update({id: 1, bar: 'baz'});

      expect(this.model.get(0)).toEqual({id: 0, foo: 'bar'});
      expect(this.model.get(1)).toEqual({id: 1, bar: 'baz'});
    });

    it('should throw an error if id is not specified', function() {
      expect(() => this.model.update({a: 1})).toThrow('id is not specified');
      expect(() => this.model.update(null, {a: 1})).toThrow('id is not specified');
    });

  });

  describe('remove method', function() {

    beforeEach(function() {
      this.model = new Model('{"0": {}, "1": {"bar": 1}, "2": {}, "3": {}}', noop);
    });

    it('should remove entity by its id', function() {
      this.model.remove(0);
      this.model.remove(1);

      expect(this.model.get(0)).toBe(void 0);
      expect(this.model.get(1)).toBe(void 0);
      expect(Object.keys(this.model.find()).length).toBe(2);
    });

    it('should return an id of the removed entity', function() {
      var id1 = this.model.remove(1);
      var id2 = this.model.remove(2);

      expect(id1).toBe(1);
      expect(id2).toBe(2);
    });

    it('should remove multiple entities at once', function() {
      this.model.remove([0, 1]);
      this.model.remove([3]);

      expect(this.model.get(0)).toBe(void 0);
      expect(this.model.get(1)).toBe(void 0);
      expect(this.model.get(3)).toBe(void 0);
      expect(Object.keys(this.model.find()).length).toBe(1);
    });

    it('should return ids of the multiple removed entries', function() {
      var ids1 = this.model.remove([0, 1]);
      var ids2 = this.model.remove([3]);

      expect(ids1).toEqual([0, 1]);
      expect(ids2).toEqual([3]);
    });

  });

  describe('clear method', function() {

    beforeEach(function() {
      this.model1 = new Model('{}', noop);
      this.model2 = new Model('{"0": {}, "1": {"bar": 1}}', noop);
      this.model3 = new Model('{"6": {}}', noop);
    });

    it('should clear all entities', function() {
      this.model1.clear();
      this.model2.clear();
      this.model3.clear();
      this.model3.add({});
      this.model3.clear();

      expect(Object.keys(this.model1.data).length).toBe(0);
      expect(Object.keys(this.model2.data).length).toBe(0);
      expect(Object.keys(this.model3.data).length).toBe(0);
    });

    it('should return ids of the cleared entities', function() {
      expect(this.model1.clear()).toEqual([]);
      expect(this.model2.clear()).toEqual([0, 1]);
      expect(this.model3.clear()).toEqual([6]);
    });

  });

  describe('find method', function() {

    beforeEach(function() {
      this.model1 = new Model('{}', noop);
      this.model2 = new Model('{"0": {}, "1": {"bar": 1}}', noop);
      this.model3 = new Model('{"6": {"id": 6, "foo": "bar"}, "9": {"prop": "value"}}', noop);
    });

    it('should return all entries if criteria is not specified', function() {
      expect(this.model1.find()).toEqual([]);
      expect(this.model2.find()).toEqual([{}, {bar: 1}]);
      expect(this.model3.find()).toEqual([{id: 6, foo: 'bar'}, {prop: 'value'}]);
    });

    it('should return matched entries', function() {
      expect(this.model1.find({a: 1})).toEqual([]);
      expect(this.model2.find({a: 1})).toEqual([]);
      expect(this.model3.find({a: 1})).toEqual([]);

      expect(this.model2.find({bar: 1})).toEqual([{bar: 1}]);
      expect(this.model3.find({id: 6})).toEqual([{id: 6, foo: 'bar'}]);
      expect(this.model3.find({foo: 'bar'})).toEqual([{id: 6, foo: 'bar'}]);
      expect(this.model3.find({prop: 'value'})).toEqual([{prop: 'value'}]);
    });

  });

});
