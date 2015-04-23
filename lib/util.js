var utils = exports;

var _          = require('lodash')
    , nodeutil = require('util')
    , JSON2    = require('JSON2')
    ;

_.str = require('underscore.string');

// Extend with node util methods
_.extend(utils, nodeutil);

// Extend util with underscore methods
_.extend(utils, _);

//test if a variable has value
utils.hasValue = function(test) {
    return (test !== undefined && test !== null);
};

utils.isJSON = function(someString) {
    try {
        JSON.parse(someString);
    } catch(e) {
        return false;
    }
    return true;
};

utils.toDelimitedJson = function toDelimitedJson(object, delimiter){
    delimiter = delimiter || "  ";
    return JSON2.stringify(JSON2.decycle(object), null, delimiter);
};

utils.toFlatJson = function toFlatJson(object){
    return JSON2.stringify(JSON2.decycle(object), null, "");
};

utils.callbackOrEmpty = function optionalCallback(cb) {
    return (cb) ? cb : function(err){};
};

utils.callbackOrDefault = function optionalCallback(cb, f) {
    if(!f) { f =  function(err){} }
    return (cb) ? cb : f;
};

utils.includes = utils.contains;

/**
 * Walk an object
 * @param obj
 * @param path
 * @param options
 * @returns {boolean}
 */
utils.contains = function(obj, path, options){
    var test = exports.walk(obj, path, options);
    return (test !== undefined);
};

/**
 * Walk an object
 * @param obj
 * @param path
 * @param options
 * @returns {*}
 */
utils.walk = function(obj, path, options){
    if (!obj)  return undefined;
    if (!path) return undefined;

    options = options || {};
    options.separator = options.separator || ':';

    var keys = path.split(options.separator);

    var key;
    var lastInstance = obj;
    var len = keys.length;

    for (var i = 0; i < len; i++) {
        key = keys[i];
        if (obj) {
            obj = (lastInstance = obj)[key];
        }
    }
    return obj;
};

utils.namespace = function(ns, ns_string, val, options ) {

    if (!ns)        return undefined;
    if (!ns_string) return undefined;

    if(!exports.isPlainObject(ns)){
        throw ('Illegal Argument: namespace must be a string');
    }

    if(!exports.isString(ns_string)){
        throw ('Illegal Argument: namespace extension must be a string');
    }

    val     = val || {};
    options = options || {};

    options.separator = options.separator || ':';

    var parts = ns_string.split(options.separator),
        parent = ns,
        pl, i;

    //strip root conflict
    if(options.root){
        if (parts[0] == options.root) {
            parts = parts.slice(1);
        }
    }

    pl = parts.length;
    for (i = 0; i < pl; i++) {
        if (typeof parent[parts[i]] == 'undefined') {
            parent[parts[i]] = (i === pl -1) ? val : {};
        }
        parent = parent[parts[i]];
    }
    return ns;
};