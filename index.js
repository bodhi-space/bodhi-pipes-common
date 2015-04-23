module.exports = function FilterModule(options){

    return {
        modifiers  : require('./lib/modifiers')(),
        filters    : require('./lib/filters')(),
        mappers    : require('./lib/mappers')(),
        selectors  : require('./lib/selectors')(),
        converters : require('./lib/mappers')()
    }

};

console.log(module.exports());