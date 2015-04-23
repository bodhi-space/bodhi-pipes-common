module.exports = function(){

    var revalidator = require('revalidator');
    var utils       = require('./util');

    function validate(input, next){
        var outcome;

        if(!utils.isObject(input)){
            next(new Error('invalid input: expected an object but received %s', typeof input));
        }

        this.schema = this.schema || {};

        if(!utils.isObject(this.schema)){
            next(new Error('invalid schema representation: expected an object but received %s', typeof ctx.schema));
        }

        try{
            outcome = revalidator.validate(input, {properties: schema});
        } catch (err){
            outcome = undefined;
        }

        if(!outcome || !outcome.valid){
            next(null, this.$BREAKER);
        } else {
            next(input);
        }

    }

    //validate the function
    return {
        validate: validate
    }

};