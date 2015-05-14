module.exports = function FilterModule(options){
    return {
        modifiers  : require('./lib/modifiers')(options),
        filters    : require('./lib/filters')(options),
        validators : require('./lib/validators')(options),
        selectors  : require('./lib/selectors')(options),
        mappers    : require('./lib/mappers')(options),
        converters : require('./lib/converters')(options)
    }
};
