module.exports = function(){
    'use strict';

    var utils = require('./util');

    function toBoolean(input, next){

        var test = utils.walk(input, this.key);

        if(utils.isString(test)){
            test = test.toLowerCase();
            if(test === 'true'){
                utils.namespace(input, this.key, true);
            } else if (test === 'false'){
                utils.namespace(input, this.key, false);
            }
        }

        next(null, input);
    }

    function toNumber(input, next){
        var test = utils.walk(input, this.key);

        if(utils.isString(test)){
            if(!isNaN(test)){
                test = test % 1 === 0 ? parseInt(test, 10) : parseFloat(test);
                utils.namespace(input, this.key, test);
            } else if (test === 'false'){

            }
        }
        next(null, input);
    }

    return {
        toBoolean: toBoolean,
        toNumber : toNumber
    }


};