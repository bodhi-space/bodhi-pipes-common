module.exports = function(){
    'use strict';

    var utils = require('./util');
    var mapper = require('json-mapper');

    function simpleMap(input, next){

        if(!utils.isObject(input)){
            next(new Error('invalid input: expected an object but received %s', typeof input));
        }

        if(!utils.isObject(this.schema)){
            next(new Error('invalid schema representation: expected an object but received %s', typeof ctx.schema));
        }

        try{
            return next(null, mapper.makeConverter(this.schema)(input));
        } catch (err){
            next (err);
        }

    }

    //Return a simple map
    return {
        simpleMap: simpleMap
    };

};
