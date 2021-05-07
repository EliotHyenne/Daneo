'use strict';

class Model {

  /**
   * @constructor
   * @param data {string}
   * @param save {function}
   */
  constructor(data, save) {
    try {
      this.data = JSON.parse(data) || {};
    }
    catch (e) {
      throw new Error('Invalid data');
    }

    this.save = () => save(this.data);
    this.nextId = Math.max.apply(Math, Object.keys(this.data).concat([-1])) + 1;
  }

  /**
   * @param id {number}
   * @returns {Object|undefined} Found entry.
   */
  get(id) {
    return this.data[id];
  }

  /**
   * @param entry {Object|Array<Object>}
   * @returns {number|Array<number>} Added entry id.
   */
  add(entry) {
    var isArray = Array.isArray(entry);
    var entries = isArray ? entry : [entry];
    var ids = entries.map((entry) => {
      var id = entry.id = this.nextId;
      this.data[id] = entry;
      this.nextId += 1;
      return id;
    });

    return isArray ? ids : ids[0];
  }

  /**
   * @param id {number|Object}
   * @param [data] {Object}
   * @returns {number} Updated entry id.
   */
  update(id, data) {
    if (data === void 0) {
      data = id;
      id = data.id;
    }

    if (id == null) {
      throw new Error('id is not specified');
    }

    data.id = id;
    this.data[id] = data;

    return id;
  }

  /**
   * @param id {number|Array<number>}
   * @returns {number|Array<number>} Updated entry id.
   */
  remove(id) {
    var isArray = Array.isArray(id);
    var ids = isArray ? id : [id];
    var data = this.data;

    ids.forEach(function(id) {
      delete data[id];
    });

    return isArray ? ids : id;
  }

  /**
   * @returns {Array<number>} List of ids.
   */
  clear() {
    var ids = Object.keys(this.data).map(Number);
    this.data = {};

    return ids;
  }

  /**
   * @param [criteria] {Object}
   * @returns {Array<Object>}
   */
  find(criteria) {
    var data = this.data;
    var keys = Object.keys(data);

    if (criteria) {
      var result = [];

      keys.forEach(function(key) {
        var entry = data[key];
        for (var prop in criteria) {
          if (criteria.hasOwnProperty(prop)) {
            if (entry[prop] === criteria[prop]) {
              result.push(entry);
              break;
            }
          }
        }
      });

      return result;
    }

    return keys.map(key => data[key]);
  }

}

module.exports = Model;
