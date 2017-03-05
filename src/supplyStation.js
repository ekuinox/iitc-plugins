// ==UserScript==
// @id             iitc-plugin-highlight-supply-station
// @name           IITC plugin: Supply Station
// @category       Highlighter
// @version        0.1.01.20160706.2226
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/lm9/iitc-plugins/master/src/supplyStation.js
// @downloadURL    https://raw.githubusercontent.com/lm9/iitc-plugins/master/src/supplyStation.js
// @description    [yxr-2016-07-04-223400] highlight supply station
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// ==/UserScript==


// ^o^

// !! WARNINGS !! ThIS PLUGIN AUTOMATICALY REQUESTS TO SERVER!!

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'yxr';
    plugin_info.dateTimeVersion = '2016/07/03';
    plugin_info.pluginId = 'portal-highlighter-supply-station';
    //END PLUGIN AUTHORS NOTE



    // PLUGIN START ////////////////////////////////////////////////////////


    // use own namespace for plugin
    window.plugin.portalHighlighterSupplyStation = function() {};

    window.plugin.portalHighlighterSupplyStation.colorLevel = function(data) {



        var portal_level = data.portal.options.data.level;
        var resCount = data.portal.options.data.resCount;
        var portal_guid = data.portal.options.guid;
        var portal_team = data.portal.options.data.team;
        var opacity = 1;
        var color;
        var colors =[["darkred", "darkorange"], ["red", "orange"]];
        var team = PLAYER.team == "RESISTANCE" ? "R" : "E";

        if(portal_level > 7 && resCount > 7){
            $.ajax({
                url: '/r/getPortalDetails',
                type: 'POST',
                headers: {'x-csrftoken': readCookie('csrftoken')},
                dataType: 'json',
                data: JSON.stringify({
                    guid : portal_guid,
                    v : niantic_params.CURRENT_VERSION
                }),
            }).done(function(portalData){
                var flag = portal_level == 8 ? 1 : 0;
                if(portal_level == 7){
                    var resonators = portalData.result[15];
                    var R8 = 0;
                    var upgradable = team == portalData.result[1] ? 1 : 0;
                    for(var i = 0; i < resCount; i++){
                        if(resonators[i][1] == 8){
                            R8++;
                            if(PLAYER.nickname === resonators[i][0]){
                                upgradable = 0;
                            }
                        }
                    }
                    if(upgradable == 1 && R8 == 7) flag = 1;
                }
                if(flag){
                    var mods = portalData.result[14];
                    var hs = 0;
                    var mh = 0;
                    var emptySlot = 0;

                    for(var i = 0; i < 4; i++){
                        if(mods[i] === null){
                            emptySlot++;
                        }else{
                            if(mods[i][1] == "Heat Sink"){
                                if(mods[i][2] == "VERY_RARE" || mods[i][2] == "RARE"){
                                    hs++;
                                }
                            }else if(mods[i][1] == "Multi-hack"){
                                if(mods[i][2] == "VERY_RARE" || mods[i][2] == "RARE"){
                                    mh++;
                                }
                            }
                        }
                    }
                    if(mh >= 1 && hs >= 1){
                        color = 'red';
                    }else if(team == portal_team){
                        if((hs === 0 && mh > 0 && emptySlot >= 1) || (mh === 0 && hs > 0 && emptySlot >= 1)){
                            color = 'orange';
                        }else if(emptySlot >= 2){
                            color = 'orange';
                        }
                    }
                    if(color){
                        data.portal.setStyle({fillColor: color, fillOpacity: opacity});
                    }
                }
            });
        }
    };

    var setup =  function() {
        window.addPortalHighlighter('Supply Station', window.plugin.portalHighlighterSupplyStation.colorLevel);
    };

    // PLUGIN END //////////////////////////////////////////////////////////


    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);