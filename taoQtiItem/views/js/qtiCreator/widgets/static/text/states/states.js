define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/static/states/states',
    'taoQtiItem/qtiCreator/widgets/static/text/states/Sleep',
    'taoQtiItem/qtiCreator/widgets/static/text/states/Active'
], function(factory, states){
    return factory.createBundle(states, arguments);
});