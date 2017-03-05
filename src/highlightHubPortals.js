// ==UserScript==
// @id             iitc-plugin-highlight-hub-portals
// @name           IITC plugin: Highlight Hub
// @category       Highlighter
// @version        0.1.02.20161124.002800
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/lm9/iitc-plugins/master/src/highlightHubPortals.js
// @downloadURL    https://raw.githubusercontent.com/lm9/iitc-plugins/master/src/highlightHubPortals.js
// @description    [yxr-2016-11-24-002800] highlight hub portals.
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
function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'yxr';
    plugin_info.dateTimeVersion = '2016/11/24';
    plugin_info.pluginId = 'portal-highlighter-Hub';
    //END PLUGIN AUTHORS NOTE



    // PLUGIN START ////////////////////////////////////////////////////////


    // use own namespace for plugin
    window.plugin.portalHighlighterHub = function() {};

    window.plugin.portalHighlighterHub.colorLevel = function(data) {
        var opacity = 1;
        var color;

        var portalGuid = data.portal.options.guid;
        var resCount = data.portal.options.data.resCount;
        var portalTeam = data.portal.options.data.team;
        var fieldsGuids = getPortalFields(portalGuid);
        var linksGuids = getPortalLinks(portalGuid);
        var playerTeam = PLAYER.team == "RESISTANCE" ? "R" : "E";
        var actionPoints = 0;
        
        actionPoints = portalApGainMaths(resCount, linksGuids.in.length + linksGuids.out.length, fieldsGuids.length).enemyAp;
        if(actionPoints){
            color = actionPoints > 10000 ? actionPoints > 20000 ? 'darkred' : 'red' : null;
        }
        if (color && playerTeam != portalTeam) {
            data.portal.setStyle({fillColor: color, fillOpacity: opacity});
        }
    };

    var setup =  function() {
        window.addPortalHighlighter('highlightHubPortals', window.plugin.portalHighlighterHub.colorLevel);
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