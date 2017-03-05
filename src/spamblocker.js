// ==UserScript==
// @id             iitc-plugin-spam-blocker
// @name           IITC plugin: Spam Blocker
// @author         lm9
// @category       COMM
// @version        0.1.1.20170304.225100
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @source         https://github.com/udnp/iitc-plugins
// @updateURL      https://raw.githubusercontent.com/lm9/iitc-plugins/master/src/spamblocker.js
// @downloadURL    https://raw.githubusercontent.com/lm9/iitc-plugins/master/src/spamblocker.js
// @description    Spam Blocker
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


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function() {};

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'lm9';
    plugin_info.dateTimeVersion = '20170304.225100';
    plugin_info.pluginId = 'spam-blocker';
    //END PLUGIN AUTHORS NOTE



    // PLUGIN START ////////////////////////////////////////////////////////
    window.plugin.spamBlocker = function() {};

    window.plugin.spamBlocker.filter = function(data){
        /* 厄介リスト */
        var blacklists = [
            "ALLFORINGRESS.ECWID.COM",
            "shop-ingress.com",
            "xmps.biz",
            "ingressfarm.com",
            "inxmp.com",
            "allforingress.ecwid.com"
        ];
        $.each(data.result, function(comm_i,comm){
            $.each(blacklists, function(url_i,url){
                /* ブラックリストのurlが含まれていたら */
                if(comm[2].plext.text.indexOf(url) !== -1){
                    delete data.processed[comm[0]];
                    return false;
                }
            });
        });
    };


    var setup = function() {
        // All, Factionに対応． Alertについてはよくわからない
        window.addHook("factionChatDataAvailable", window.plugin.spamBlocker.filter);
        window.addHook("publicChatDataAvailable", window.plugin.spamBlocker.filter);
    };

    // PLUGIN END //////////////////////////////////////////////////////////


    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
