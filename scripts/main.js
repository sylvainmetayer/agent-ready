"use strict";$(document).ready(function(){var XM_INITIAL_VALUE=30,MAX_RESONATORS=8,buttons=$(".section button"),div_status=$("#status"),ul_inventoryList=$("#inventory"),span_xm=div_status.find(".xm .value"),span_xm_max=div_status.find(".xm .max"),inventory=[],agentName=void 0,BAN_TIME=100,MAX_ATTEMPT_BEFORE_BAN=3,colorArray=void 0,randomName=void 0,cheatImage=void 0,glyph=void 0,allowed_keys=void 0,keyboard_navigation=void 0,cheatsCodes=void 0,cheatAttemptCounter=0,numberOfCheatAttempFailed=0,log=!0;function loadJSONValue(a){var e={method:"GET",url:"resources/"+a+".json",dataType:"json"};$.ajax(e).done(function(e){var t=$.map(e,function(e){return e});switch(a){case"randomName":randomName=t;break;case"glyph":glyph=t;break;case"navigation":keyboard_navigation=$.map(e.navigate_between_section,function(e){return e}),allowed_keys=$.map(e.keys_allowed_for_cheat_code,function(e){return e});break;case"cheats":BAN_TIME=e.ban_time,MAX_ATTEMPT_BEFORE_BAN=e.max_attempt_before_ban,cheatImage=$.map(e.images,function(e){return e}),cheatsCodes=$.map(e.codes,function(e){return e});break;default:alert("Error, no array found in loadJSONValue function"),location.reload()}})}function init(){setXM(XM_INITIAL_VALUE),span_xm_max.html(XM_INITIAL_VALUE),inventory=[],updateItem("resonateur",0)}function updateItem(e,t){var a=getInventory(e);null==a?inventory.push({name:e,count:t}):a.count=parseInt(getInventory(e).count)+parseInt(t),getInventory(e).count<=0&&(getInventory(e).count=0),updateInventory()}function updateInventory(){ul_inventoryList.empty();var a=void 0;$(inventory).each(function(e,t){(a=$("<li>")).data("name",t.name),a.html(t.name+": "+t.count),ul_inventoryList.append(a)})}function getInventory(t){return inventory.find(function(e){return e.name==t})}function showSection(e,t){void 0===t&&(t=!0),$(".section").hide(),t?$("#status").show():$("#status").hide();var a=$("#"+e);a.size()<=0?(log&&console.log("[FATAL ERROR] "+e+" section is not defined !"),alert("An error occured, please try again later."),location.reload()):(a.show(),bindKeyEvent($(a)))}function bindKeyEvent(e){null!=keyboard_navigation&&e.find("button").each(function(e){var t=String.fromCharCode(keyboard_navigation[e]);if($(this).data("charCode",keyboard_navigation[e]),-1==$(this).html().indexOf(t+"-")){var a=$(this).html();$(this).html(t+"-"+a)}})}function updateImage(e,t,a,n,o){var r=void 0;if("add"==e){(r=$("<img>")).attr("src","images/"+a);var i="100px";r.css("width",i).css("height",i),r.data("name",n),$(t).append(r)}else if("update"==e||"remove"==e){if(0==(r=$("img").filter(function(){return $(this).data("name")==n})).size())return log&&console.log("Image not found for "+e+" rule in image action !"),void alert("Oups. An image is missing. Sorry about that.");"update"==e?(r.attr("src","images/"+a),r.data("name",o)):r.remove()}}function handleSingleAction(e,t){var a=e.attr("name"),n=void 0,o=void 0;switch(log&&console.log("Action received : "+a),a){case"start":init(),agentName=void 0;break;case"reset":init();break;case"hit":looseXM();break;case"itemUpdate":o=e.attr("item");var r=parseInt(e.attr("count"));updateItem(o,r);break;case"glyph":0==t&&(alert("Sorry, there is an error."),location.reload());var i=parseInt(e.attr("level")),s=e.attr("itemWon"),c=e.attr("itemCount"),d=e.attr("time");launchGlyphGame(i,$(e),c,s,d,t);break;case"cssUpdate":$(e.attr("element")).css(e.attr("rule"),e.attr("value"));break;case"setAgentName":if(null!=agentName)break;var l=e.attr("message");(null==(agentName=prompt(l))||agentName.length<=0)&&(agentName=randomName[getRandom(0,randomName.length-1)]),n=e.attr("showInto"),$(n).text(agentName);break;case"image":updateImage(e.attr("rule"),e.attr("selector"),e.attr("value"),e.attr("dataName"),e.attr("newName"));break;case"resetCSS":var u="#d3d3d3";$("html").css("color",u),$("button").css("background-color",u),$(".section button:hover").css({"background-color":"dark-grey",color:"#101010"}),$("#status").css("border-color",u),$(".section").css("border-color",u),$(".xm").css({"border-color":u,color:u});break;case"resistance":var m=e.siblings("p").last();m.css({color:"lightblue","text-align":"center"}),m.hide(),setTimeout(function(){m.show()},1e3);break;case"setFaction":n=e.attr("showInto");var h=void 0;h="true"==e.attr("resistant")?"#11ecf7":"#06cc58",$("html").css("color",h),$("button").css("background-color",h),$(".section").css("border-color",h),$("#status").css("border-color",h),$(".xm").css({"border-color":h,color:h});break;case"deploy":o=getInventory(e.attr("item"));var g=parseInt(e.attr("looseXMPerDeploy")),p=e.siblings("div.image"),v=e.siblings("button"),f=e.siblings(".success"),b=e.siblings(".warningStuff");if(e.parent(".section").find("span.item").each(function(){$(this).html(o.name)}),v.first().data("go",e.parent(".section").attr("id")),f.hide(),v.show(),v.last().hide(),b.hide(),0==p.children().size())updateImage("add",p,o.name+"/0.png",o.name+"_0",void 0),0==t&&(alert("Oops, an error. Sorry about that"),location.reload()),v.last().data("go",t);else if(o.count<=0)b.find(".item").html(o.name),b.show(),v.first().hide();else{var y=p.find("img").first().data("name").split("_"),_=parseInt(y[1]);_++,o.count--,looseXM(g),updateImage("update",p,o.name+"/"+_+".png",o.name+"_"+(_-1),o.name+"_"+_),MAX_RESONATORS<=_&&(p.html(""),v.hide(),v.last().show(),f.show(),setXM(parseInt(getXM()+MAX_RESONATORS))),getXM()<=0&&endGame()}break;default:log&&console.log("[FATAL ERROR] "+a+" has not been defined in handleSingleAction !"),alert("Oups. Something went wrong. Sorry about that :("),location.reload()}}var getRandom=function(e,t){return Math.floor(Math.random()*(t-e+1)+e)};function shuffleArray(e){for(var t=e.length-1;0<t;t--){var a=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[a],e[a]=n}return e}function createPictures(e,a){var t=$.map(e,function(e){return e});t=shuffleArray(t),$.each(t,function(){var e=$("<p>");e.html(this.name+"<br/>");var t=$("<img>");t.attr("src","images/glyph/"+this.src);t.css("width","100px").css("height","100px"),t.addClass("glyphPictures"),t.data("order",this.order),t.data("name",this.name),t.after(),e.append(t),a.append(e)})}function showSolution(e,a,t){var n=$("<ol>"),o=void 0;n.html("Solution : ");for(var r=0;r<t;r++)o=$("<li>"),n.append(o);$("#glyphGame").prepend(n);for(var i=function(e){var t=a.filter(function(){return $(this).data("order")==e});n.children().eq(e-1).html(t.data("name"))},s=1;s<=t;s++)i(s);setTimeout(function(){n.remove()},e)}function launchGlyphGame(e,t,a,n,o,r){0==r&&(alert("Oops, an error. Sorry :("),location.reload());var i=t.parent(".section"),s=t.siblings("button");s.hide(),s.data("go",r),i.find("span.itemCount").html(a),i.find("span.itemWon").html(n);var c=$(glyph).filter(function(){return this.level=e}),d=getRandom(0,c.size()-1);createPictures(c.get(d).order,$("#glyphGame"));var l=$("img.glyphPictures");showSolution(o,$(l),e);var u=1;l.click(function(){parseInt($(this).data("order"))==u?(u++,$(this).css("border","solid 5px green")):(0<a&&a--,looseXM(),getXM()<=0&&gotoSection("no_more_xm",!1),l.css("border","none"),setTimeout(function(){l.css("border","none")},300),$(this).css("border","solid 5px red"),u=1),u==e+1&&(log&&console.log("You won "+a+" "+n),l.parents("p").remove(),setXM(XM_INITIAL_VALUE),updateItem(n,a),i.find("ol").remove(),s.show())})}function handleActions(e,a){var t=$("#"+e).find("action");0!=t.size()&&t.each(function(e,t){handleSingleAction($(t),a)})}function gotoSection(e,t,a){void 0===t&&(t=!0),null==a&&(a=!1),handleActions(e,a),setXM(getXM()),updateInventory(),log&&console.log("Display section : "+e),showSection(e,t),getXM()<=0&&"stop_game"!=e&&"no_more_xm"!=e&&endGame(),getXM()>XM_INITIAL_VALUE&&setXM(XM_INITIAL_VALUE)}function getXM(){return parseInt(span_xm.text())}function setXM(e){span_xm.html(e)}function looseXM(e){null==e&&(e=1),setXM(getXM()-e)}function startGame(){gotoSection("intro",!1)}function endGame(){gotoSection("stop_game",!1)}function resetCounterExcept(e){null!=cheatsCodes&&(null!=e?$(cheatsCodes).filter(function(){return this.name!=e}):$(cheatsCodes)).each(function(){this.cpt=0})}buttons.click(function(){gotoSection($(this).data("go"),void 0,$(this).data("next"))}),$(document).keyup(function(e){var keyCode=e.keyCode,keyPressed=e.key;if(log&&console.log("|"+keyPressed+"|",keyCode),null==allowed_keys||-1!=allowed_keys.indexOf(keyCode)||null==keyboard_navigation||-1!=keyboard_navigation.indexOf(keyCode)){$(".section:visible button:visible").each(function(){$(this).data("charCode")==keyCode&&gotoSection($(this).data("go"),void 0,$(this).data("next"))});var somethingHappened=!1;if(null!=cheatsCodes&&$(cheatsCodes).each(function(){var cheatCodeName=this.name;keyCode==this.keys[this.cpt]&&(somethingHappened=!0,1==log&&console.log(cheatCodeName+" triggered"),this.cpt++,resetCounterExcept(cheatCodeName),this.cpt==this.keys.length&&(eval("("+this.success+"())"),resetCounterExcept()))}),1!=somethingHappened&&(resetCounterExcept(),null!=keyboard_navigation&&-1==keyboard_navigation.indexOf(keyCode)&&(1==log&&console.log("Someone is trying to cheat !"),cheatAttemptCounter++)),cheatAttemptCounter==MAX_ATTEMPT_BEFORE_BAN){var randomImage=cheatImage[getRandom(0,cheatImage.length-1)];cheatAttemptCounter=0;var activeSection=$(".section:visible");activeSection.hide(),div_status.hide(),0==numberOfCheatAttempFailed&&alert("Be careful, each time you will fail to find a cheat code, ban time will be doubled"),numberOfCheatAttempFailed++,$("html").css("background-color","transparent"),$("body").css("background-image","url(images/cheats/"+randomImage+")"),setTimeout(function(){$("html").css("background-color","#000000"),$("body").css("background-image","none"),activeSection.show(),div_status.show()},BAN_TIME*numberOfCheatAttempFailed)}}}),loadJSONValue("cheats"),loadJSONValue("navigation"),loadJSONValue("randomName"),loadJSONValue("glyph"),startGame()});