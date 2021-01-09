/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 */
define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'audioRecordingInteraction/creator/widget/states/states',
    'css!audioRecordingInteraction/creator/css/audioRecordingInteraction'
], function(Widget, states){
    'use strict';

    var AudioRecordingInteractionWidget = Widget.clone();

    AudioRecordingInteractionWidget.initCreator = function(){
        var $interaction;

        this.registerStates(states);

        Widget.initCreator.call(this);

        $interaction = this.$container.find('.audioRecordingInteraction');
        if ($interaction.length) {
            $interaction.addClass('tao-qti-creator-context');
        }
    };

    return AudioRecordingInteractionWidget;
});