module.exports = function(options){
    'use strict';

    var utils = require('./util');

    /**
     * JSONPath
     *
     * options
     *  expression: string
     */
    function keyTest(input, next, predicate){

        if(!this.key){
            this.logger.verbose('No key specified for if exists filter')
            next(null, input)
        }

        if(predicate(this.key, input)){
            next(null, this.$BREAKER);
        } else {
            next(null, input);
        }
    }

    function exists(input, next){
        var self = this;
        keyTest.call(self, input, next, function(k, i){
            return utils.contains(i, k);
        });
    }

    function notExists(input, next){
        var self = this;
        keyTest.call(self, input, next, function(k, i){
            return !utils.contains(i, k);
        });
    }

    function isTruthy(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual) ? true : false;
        })
    }

    function isFalsey(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual) ? false : true;
        }, false)
    }

    function isTrue(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual === true);
        }, false)
    }

    function isFalse(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual === false);
        }, false)
    }

    function isNull(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual === null);
        }, false)
    }

    function hasValue(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual != null);
        }, false)
    }

    function isUndefined(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual === undefined);
        }, false)
    }

    function isDefined(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual){
            return (actual !== undefined);
        }, false)
    }

    function isEqualTo(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return (actual === test);
        }, true)
    }

    function isNotEqualTo(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return (actual !== test);
        }, true)
    }

    function isGreaterThan(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return (actual > test);
        }, true)
    }

    function isGreaterThanEqual(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return (actual >= test);
        }, true)
    }

    function isLessThanEqual(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return (actual <= test);
        }, true)
    }

    function isLessThan(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return (actual < test);
        }, true)
    }

    function isIn(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return utils.includes(test, actual);
        }, true)
    }

    function isNotIn(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){
            return !utils.includes(test, actual);
        }, true)
    }

    function matches(input, next){
        var self = this;
        valueTest.call(self, input, next, function predicate(actual, test){

            if(!(self.expression)){
                return false;
            }

            return self.expression.exec(actual);
        }, false);
    }

    function valueTest(input, next, predicate, needsComparison){

        if(!this.key){
            this.logger.verbose('No key specified for the filter');
            return next(null, input)
        }

        if(needsComparison && !this.hasOwnProperty('value')){
            this.logger.verbose('No comparison value specified for if equals filter');
            return next(null, input)
        }

        if(predicate(utils.walk(input, this.key), this.value)){
            return next(null, this.$BREAKER);
        } else {
            return next(null, input);
        }
    }

    function valueMatches(input, next){

        if(!this.key){
            this.logger.verbose('No key specified for if equals filter')
            next(null, input)
        }

        if(!this.expression){
            this.logger.verbose('No expression value specified for if equals filter')
            next(null, input)
        }

        var val = utils.walk(input, this.key);

        if(this.expression.exec(val)){
            next(null, this.$BREAKER);
        } else {
            next(null, input);
        }
    }

    return {
        ifKeyExists                : exists,
        ifNoKey                    : notExists,
        ifEquals                   : isEqualTo,
        ifNotEquals                : isNotEqualTo,
        ifLessThan                 : isLessThan,
        ifLT                       : isLessThan,
        ifLessThanOrEqual          : isLessThanEqual,
        ifLTE                      : isLessThanEqual,
        ifGreaterThanOrEqual       : isGreaterThanEqual,
        ifGTE                      : isGreaterThanEqual,
        ifGreaterThan              : isGreaterThan,
        ifGT                       : isGreaterThan,
        ifMatches                  : valueMatches,
        ifTrue                     : isTrue,
        ifTruthy                   : isTruthy,
        ifFalse                    : isFalse,
        ifFalsey                   : isFalsey,
        ifNull                     : isNull,
        ifValued                   : hasValue,
        ifHasValue                 : hasValue,
        ifUndefined                : isUndefined,
        ifDefined                  : isDefined,
        ifIn                       : isIn,
        ifNotIn                    : isNotIn
    }

}