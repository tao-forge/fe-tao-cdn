/*
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
 * Copyright (c) 2014-2020 (original work) Open Assessment Technologies SA ;
 *
 */

define([
    'lodash',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoMediaManager/qtiCreator/widgets/states/Active',
    'tpl!taoMediaManager/qtiCreator/tpl/forms/item',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement'
], function(_, stateFactory, Active, formTpl, formElement){
    'use strict';

    const ItemStateActive = stateFactory.create(Active, function enterActiveState() {
        const _widget = this.widget;
        const item = _widget.element;
        const $form = _widget.$form;

        //build form:
        $form.html(formTpl({
            'xml:lang' : item.attr('xml:lang'),
            languagesList : item.data('languagesList')
        }));

        //init widget
        formElement.initWidget($form);

        //init data validation and binding
        formElement.setChangeCallbacks($form, item, {
            'xml:lang' : formElement.getAttributeChangeCallback()
        });

    }, _.noop);

    return ItemStateActive;
});
