module.exports = function(){
    'use strict';

    /* Simple Key Operations
     * insert (key, value)
     * overwrite(key, value)
     * rename(key, value)
     * copy(key, value)
     *
     *
     */
    var utils = require('./util');

    /**
     * json path functions
     *
     * equals
     *
     *
     */
    function insert(input, next){

        var logger = this.logger;

        if(!this.key){
            next(new Error('Missing Argument: Cannot insert at an unspecified context property "key"'));
        }

        if(!this.value){
            if(logger) logger.debug('Ignoring Insert: Context property "value" is unspecified');
        } else {
            if(input.hasOwnProperty(this.key) && !this.force){
                if(logger) logger.warn('Refusing Insert: Key already exists. Use force to ensure the insert.');
            } else {
                input[this.key] = this.value;
            }
        }

        next(null, input);
    }

    /**
     * Forcibly inserts a new object into the stream
     */
    function overwrite(input, next){
        this.force = true;
        insert.call(this, input, next);
    }


    function renameKey(input, next){
        input = input || {};

        if(!this.from){
            next(new Error('Missing Argument: No from property specified'));
        }

        if(!this.to){
            next(new Error('Missing Argument: No to property specified'));
        }

        if(input[this.from]){
            input[this.to] = input[this.from];
            delete input[this.from];
        }

        next(null, input);
    }

    /**
     * to
     * from
     */
    function copyKey(input, next){
        input = input || {};

        if(!this.from){
            next(new Error('Missing Argument: No "from" property specified'));
        }

        if(!this.to){
            next(new Error('Missing Argument: No "to" property specified'));
        }

        if(input[this.from]){
            input[this.to] = input[this.from];
        }

        next(null, input);
    }


    function elevate(input, next){
        input = input || {};

        if(!this.key){
            next(new Error('Missing Argument: No "map" property specified'));
        }

        next(null, utils.contains(input, this.key) ? utils.walk(input, this.key) : {});
    }

    function remapKeys(input, next){
        input = input || {};

        if(!this.map){
            next(new Error('Missing Argument: No "map" property specified'));
        }

        utils.each(this.map, function _mapping(to, from){
            if(input.hasOwnProperty(from)){
                input[to] = input[from];
                delete input[from];
            }
        });

        next(null, input);
    }

    /**
     * Shallow Extend
     * @param input
     * @param next
     */
    function extend(input, next){
        input = input || {};

        var inputOverPatch = this.inputOverPatch;
        delete this.inputOverPatch;

        if(!this.patch){
            next(new Error('Missing Argument: Cannot assign an empty object'));
        }

        if(!utils.isPlainObject(this.patch)){
            next(new Error('Illegal Argument: Patch must be an object'));
        }

        if(inputOverPatch){
            input = utils.extend({}, this.patch, input)
        } else {
            input = utils.extend({}, input, this.patch)
        }

        next(null, input);
    }

    function assign(input, next){
        this.inputOverPatch = true;
        extend.call(this, input, next, true);
    }

    function merge(input, next){
        this.inputOverPatch = false;
        extend.call(this, input, next, false);
    }

    return {
        insert    : insert,
        overwrite : overwrite,
        elevate   : elevate,
        rename    : renameKey,
        remap     : remapKeys,
        copy      : copyKey,
        assign    : assign,
        merge     : merge
    }

};