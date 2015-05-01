module.exports = function FilterModule(options){
    return {
        modifiers  : require('./lib/modifiers')(options),
        filters    : require('./lib/filters')(options),
        mappers    : require('./lib/mappers')(options),
        selectors  : require('./lib/selectors')(options),
        converters : require('./lib/mappers')(options)
    }
};
