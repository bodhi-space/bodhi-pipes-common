module.exports = function(){
    'use strict';

    var select = require('jsonselect');
    var utils  = require('./util');

    function buildInclusions(list){
        list        = list || [];

        var results = [];

        list.forEach(function(elements, num){
            if(utils.isString(elements)){
                results.push(elements);
            }
        });


        return list.join(' ');
    }

    function buildExclusions(list){
        list        = list || [];
        var results = [];

        list.forEach(function(elements, num){
            if(utils.isString(elements)){
                results.push('-' + elements);
            }
        });

        return results.join(' ');
    }

    /**
     * Only
     *
     * options:
     *  includes: array of keys
     */
    function only(input, next){
        try{
            var expression = buildInclusions(this.key || []);
            var output     = select(input, {only: expression});
            next(null, output);
        } catch (err){
            next(err);
        }
    }

    /**
     * Except
     *
     * keep everything except
     *
     * options:
     *  excludes: array of keys
     */
    function except(input, next){
        try{
            var expression = buildInclusions(this.key || []);
            var output     = select(input, { except: expression});
            next(null, output);
        } catch (err){
            next(err);
        }
    }

    /**
     *
     * Select a single key and delete the others
     *
     * keep everything except
     *
     * @param input
     * @param next
     */
    function pick(input, next){
        var logger = this.logger;
        next(null, utils.pick(input, this.key));
    }

    /**
     *
     * Simple delete of a single key
     * keep everything except
     *
     *
     * @param input
     * @param next
     */
    function drop(input, next){

        var logger = this.logger;

        if(Array.isArray(this.key)) {
          this.key.forEach(function(value){
              if(input.hasOwnProperty(value)){
                  delete input[value];
              }
          });
        }

        else if(input.hasOwnProperty(this.key)){
            delete input[this.key];
        }

        next(null, input);
    }

    function extract(input, next){
        if(!this.key){
            next(new Error('Missing Argument: Cannot pick without a specified context property "key"'));
        }

        if(utils.isArray(this.key)){
            only.call(this, input, next)
        } else if(utils.isString(this.key)){
            pick.call(this, input, next)
        } else {
            next(new Error('Missing Argument: Cannot pick without a specified context property "key"'));
        }
    }

    function remove(input, next){

        if(!this.key){
            next(new Error('Missing Argument: Cannot pick without a specified context property "key"'));
        }

        if(utils.isArray(this.key)){
            except.call(this, input, next)
        } else if(utils.isString(this.key)){
            drop.call(this, input, next)
        } else {
            next(new Error('Illegal Argument: property "key" should be either a string or array of strings'));
        }
    }

    /**
     * Maybe this ought to be simpler?
     *
     * remove  : key: []
     */
    return {
        extract    : pick,      //keep only this key
        remove     : drop       //keep everything but this key
    }

};