define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/states/Map',
    'taoQtiItem/qtiCreator/widgets/interactions/helpers/answerState'
], function(stateFactory, Map, answerState){
    'use strict';

    var InteractionStateMap = stateFactory.create(Map, function(){
        
        var $correctWidgets = this.widget.$container.find('[data-edit="correct"]');
        
        //check if the interaction response has a correct defined and show correct if so:
        if(answerState.isCorrectDefined(this.widget)){
            $correctWidgets.show();
        }else{
            $correctWidgets.hide();
        }
        
    }, function(){
        //plus, hide correct widget
        this.widget.$container.find('[data-edit="correct"]').hide();
    });

    return InteractionStateMap;
});
