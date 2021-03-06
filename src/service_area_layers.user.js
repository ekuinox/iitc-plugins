// ==UserScript==
// @id             iitc-plugin-service-area-maps
// @name           IITC plugin: Service Area Maps
// @category       Layer
// @version        0.0.4.20190909.010000
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/ekuinox/iitc-plugins/master/src/service_area_layers.meta.js
// @downloadURL    https://raw.githubusercontent.com/ekuinox/iitc-plugins/master/src/service_area_layers.user.js
// @description    [bvq-2019-09-09-010000] au, DoCoMo, SoftBankのサービスエリアマップをレイヤへ追加します．
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @author         bvq
// ==/UserScript==


function wrapper(plugin_info)
{
	// ensure plugin framework is there, even if iitc is not yet loaded
	if(typeof window.plugin !== 'function') window.plugin = function() {};

	//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
	//(leaving them in place might break the 'About IITC' page or break update checks)
	plugin_info.buildName = 'bvq';
	plugin_info.dateTimeVersion = '20171011.010000';
	plugin_info.pluginId = 'basemap-service-area';
	//END PLUGIN AUTHORS NOTE

	// PLUGIN START ////////////////////////////////////////////////////////
	window.plugin.mapServiceArea = function() {};

	window.plugin.mapServiceArea.setup = function() {
		/*
		** 日本の大手キャリア三社
		** もっとスッキリ書きたいけどまあいいや
		*/
		var maps = {
			"au": {
				styles: [
					{ name: "3G", l: "0", t: "B" },
					{ name: "4G LTE", l: "1", t: "A" },
					{ name: "WiMAX 2+", l: "2", t: "B" }
				],
				opt: {
					maxNativeZoom: 14, // auの限界は14?
					maxZoom: 21,
					opacity: 0.1
				},
				add: (style, opt) => {
					window.addLayerGroup(
						'au service area map [' + style.name + ']',
						(new L.TileLayer('https://www13.info-mapping.com/au/map/services/tile.asp?l=' + style.l + '&t=' + style.t + '&x={x}&y={y}&z={z}', opt)),
						true
					);
				}
			},
			"DoCoMo": {
				styles: [
					{ name: "FOMA, 2017/06/25時点", type: "1011" },
					{ name: "LTE, 2017/06/25時点", type: "1014" }
				],
				opt: {
					maxNativeZoom: 14,
					maxZoom: 21,
					opacity: 0.1
				},
				add: (style, opt) => {
					window.addLayerGroup(
						'DoCoMo service area map [' + style.name + ']',
						(new L.TileLayer('https://servicearea.nttdocomo.co.jp/map/' + style.type + '/0000000000000000/{z}/{x}/{z}_{x}_{y}.gif', opt)),
						true
    				);
				}
			},
			"SoftBank": {
				styles: [
					{ name : "hybrid", date: "20190726000", type: "ServiceAreaMap_Hybrid4GLTE_ACT" }
				],
				opt: {
					maxNativeZoom: 13, // ソフトバンクしょぼい
					maxZoom: 21,
					opacity: 0.1
				},
				add: (style, opt) => {
					window.addLayerGroup(
						'SoftBank service area map [' + style.name + ']',
            			(new L.TileLayer('https://tiles.areamap.mb.softbank.jp/' + style.type + '/' + style.date + '/{z}/{y}/{x}.png', opt)),
            			true
    				);
				}
			},
		};
		$.each(maps, (key, map) => {
			$.each(map.styles, (i, style) => {
				map.add(style, map.opt);
			});
		});
	};
	var setup = window.plugin.mapServiceArea.setup;

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
