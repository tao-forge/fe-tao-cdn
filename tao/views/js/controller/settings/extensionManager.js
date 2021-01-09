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
 * Copyright (c) 2013-2019 (original work) Open Assessment Technologies SA ;
 */

/**
 * Extension manager controller
 */
define([
    'jquery',
    'i18n',
    'util/url',
    'ui/feedback',
    'ui/modal'
], function($, __, urlUtil, feedback){
    'use strict';

    var ext_installed = [];
    var toInstall = [];
    var indexCurrentToInstall = -1;
    var percentByExt = 0;
    var installError = 0;

    function getDependencies(extension) {
        var dependencies = [];
        $('#' + extension + ' .dependencies li:not(.installed)').each(function() {
            var ext = $(this).attr('rel');
            var deps = getDependencies(ext);
            deps.push(ext);
            dependencies = dependencies.concat(deps);
        });
        return dependencies;
    }

    //Give an array with unique values
    function getUnique(orig){
        var a = [];
        var i;
        for (i = 0; i < orig.length; i++) {
            if ($.inArray(orig[i], a) < 0) a.push(orig[i]);
        }
        return a;
    }

    function progressConsole(msg) {
        $('#installProgress .console').append('<p>' + msg + '</p>');
        $('#installProgress .console').prop({scrollTop: $('#installProgress .console').prop("scrollHeight")});
    }

    function installNextExtension() {
        var ext = toInstall[indexCurrentToInstall];
        $('#installProgress p.status').text(__('Installing extension %s...').replace('%s', ext));
        progressConsole(__('Installing extension %s...').replace('%s', ext));
        $.ajax({
            type: "POST",
            url: urlUtil.route('install', 'ExtensionsManager', 'tao'),
            data: 'id='+ext,
            dataType: 'json',
            success: function success(data) {

                if (data.success) {
                    progressConsole(__('> Extension %s succesfully installed.').replace('%s', ext));

                    // state that the extension is install in remaining dependencies.
                    $('li.ext-id.ext-' + ext).addClass('installed');

                    $('tr#'+ext).slideUp('normal', function() {
                        var $tr = $('<tr></tr>').appendTo($('#extensions-manager-container tbody')).hide();
                        var $orig = $('tr#' + ext + ' td');
                        $tr.append('<td class="ext-id bordered">' + $($orig[0]).text() + '</td>');
                        $tr.append('<td class="author">' + $($orig[1]).text() + '</td>');
                        $tr.append('<td class="version">' + $($orig[2]).text() + '</td>');
                        $tr.slideDown('normal', function() {
                            $('tr#' + ext).remove();

                            // table changed, restyle.
                            styleTables();

                            // If the available extensions table is empty,
                            // just inform the user.
                            if ($('#available-extensions-container table tbody tr').length === 0){
                                noAvailableExtensions();
                            }

                            $('#installProgress .bar').animate({width:'+=' + percentByExt + '%'}, 1000, function() {
                                //Next
                                indexCurrentToInstall++;
                                hasNextExtensionToInstall();
                            });
                        });
                    });
                } else {
                    installError = 1;
                    progressConsole('Installation of ' + ext + ' failed');
                }
                feedback().info(data.message);
            }
        });

        if (installError) {
            progressConsole(__('A fatal error occured during the installation process.'));
        }
    }

    function postInstall(){
        progressConsole(__('Post install processing'));
        return $.ajax({
            type: "GET",
            url: urlUtil.route('postInstall', 'ExtensionsManager', 'tao')
        });
    }

    function hasNextExtensionToInstall() {
        if (indexCurrentToInstall >= toInstall.length) {
            toInstall = [];
            $('#installProgress .bar').animate({backgroundColor:'#bb6',width:'100%'}, 1000);

            postInstall().done(function() {

                $('#installProgress .bar').animate({backgroundColor:'#6b6'}, 1000);
                $('#installProgress p.status').text(__('Installation done.'));
                progressConsole(__('> Installation done.'));
                progressConsole(__('... reloading page.'));

                setTimeout(function(){
                    window.location.reload(true);
                }, 1000);
            });
        } else {
            installNextExtension();
        }
    }

    function styleTables(){
        // Clean all to make this function able to "restyle" after
        // data refresh.
        $('#Extensions_manager table tr').removeClass('extensionOdd')
        .removeClass('extensionEven');

        $('#Extensions_manager table tr:nth-child(even)').addClass('extensionEven');
        $('#Extensions_manager table tr:nth-child(odd)').addClass('extensionOdd');
    }

    function noAvailableExtensions(){
        var $noAvailableExtElement = $('<div/>');
        $noAvailableExtElement.attr('id', 'noExtensions')
        .addClass('ui-state-highlight')
        .text(__('No extensions available.'));

        $('#available-extensions-container').empty().append($noAvailableExtElement);
    }

    return {
        start : function start(){

            // Table styling.
            styleTables();

            $('#installProgress').hide();

            //Detect wich extension is already installed
            $('#extensions-manager-container .ext-id').each(function() {
                var ext = $(this).text();
                ext_installed.push(ext);
                $('.ext-id.ext-' + ext).addClass('installed');
            });

            $('#available-extensions-container tr input').click(function(event){
                event.stopPropagation();
            });

            $('#available-extensions-container tr input:checkbox').click(function() {
                var $installButton = $('#installButton');
                if ($(this).parent().parent().parent().find('input:checkbox:checked').length > 0){
                    $installButton.attr('disabled', false);
                }
                else{
                    $installButton.attr('disabled', true);
                }
            });

            $('#available-extensions-container #installButton').click(function(event) {
                var $modalContainer = $('#installProgress');

                event.preventDefault();

                //Prepare the list of extension to install in the order of dependency
                toInstall = [];
                $('#available-extensions-container input:checked').each(function() {
                    var ext = $(this).prop('name').split('_')[1];
                    var deps = getDependencies(ext);
                    if (deps.length) {
                        toInstall = toInstall.concat(deps);
                    }
                    toInstall.push(ext);
                });
                toInstall = getUnique(toInstall);
                if (!toInstall.length) {
                    window.alert(__('Nothing to install !'));
                    return false;
                }
                //Let's go
                percentByExt = 100 / toInstall.length;

                //Show the dialog with the result
                $('.status', $modalContainer).text(__('%s extension(s) to install.').replace('%s', toInstall.length));
                $('.bar', $modalContainer).width(0);
                $('.console', $modalContainer).empty();

                progressConsole(__('Do you wish to install the following extension(s):\n%s?').replace('%s', toInstall.join(', ')));

                $('[data-control=cancel]', $modalContainer).on('click', function(e){
                    e.preventDefault();
                    $modalContainer.modal('close');
                });
                $('[data-control=confirm]', $modalContainer).on('click', function(e){
                    e.preventDefault();
                    progressConsole(__('Preparing installation...'));
                    $('.buttons', $modalContainer).remove();
                    installError = 0;
                    indexCurrentToInstall = 0;
                    installNextExtension();
                });

                $modalContainer.modal({
                    width : 400,
                    height : 300,
                    top : 150,
                    disableEscape : true,
                    disableClosing : true
                });
            });
        }
    };
});
