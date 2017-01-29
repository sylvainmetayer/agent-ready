"use strict";$(document).ready(function(){function loadJSONValue(e){var t={method:"GET",url:"resources/"+e+".json",dataType:"json"},a=$.ajax(t);a.done(function(t){var a=$.map(t,function(e){return e});switch(e){case"randomName":randomName=a;break;case"glyph":glyph=a;break;case"navigation":keyboard_navigation=$.map(t.navigate_between_section,function(e){return e}),allowed_keys=$.map(t.keys_allowed_for_cheat_code,function(e){return e});break;case"cheats":BAN_TIME=t.ban_time,MAX_ATTEMPT_BEFORE_BAN=t.max_attempt_before_ban,cheatImage=$.map(t.images,function(e){return e}),cheatsCodes=$.map(t.codes,function(e){return e});break;default:alert("Error, no array found in loadJSONValue function"),location.reload()}})}function init(){setXM(XM_INITIAL_VALUE),span_xm_max.html(XM_INITIAL_VALUE),inventory=[],updateItem("resonateur",0)}function updateItem(e,t){var a=getInventory(e);void 0==a?inventory.push({name:e,count:t}):a.count=parseInt(getInventory(e).count)+parseInt(t),getInventory(e).count<=0&&(getInventory(e).count=0),updateInventory()}function updateInventory(){ul_inventoryList.empty();var e=void 0;$(inventory).each(function(t,a){e=$("<li>"),e.data("name",a.name),e.html(a.name+": "+a.count),ul_inventoryList.append(e)})}function getInventory(e){return inventory.find(function(t){return t.name==e})}function showSection(e,t){void 0===t&&(t=!0),$(".section").hide(),t?$("#status").show():$("#status").hide();var a=$("#"+e);a.size()<=0?(log&&console.log("[FATAL ERROR] "+e+" section is not defined !"),alert("An error occured, please try again later."),location.reload()):(a.show(),bindKeyEvent($(a)))}function bindKeyEvent(e){void 0!=keyboard_navigation&&e.find("button").each(function(e){var t=String.fromCharCode(keyboard_navigation[e]);if($(this).data("charCode",keyboard_navigation[e]),$(this).html().indexOf(t+"-")==-1){var a=$(this).html();$(this).html(t+"-"+a)}})}function updateImage(e,t,a,n,o){var i=void 0;if("add"==e){i=$("<img>"),i.attr("src","images/"+a);var r="100px";i.css("width",r).css("height",r),i.data("name",n),$(t).append(i)}else if("update"==e||"remove"==e){if(i=$("img").filter(function(){return $(this).data("name")==n}),0==i.size())return log&&console.log("Image not found for "+e+" rule in image action !"),void alert("Oups. An image is missing. Sorry about that.");"update"==e?(i.attr("src","images/"+a),i.data("name",o)):i.remove()}}function handleSingleAction(e){var t=e.attr("name"),a=void 0,n=void 0;switch(log&&console.log("Action received : "+t),t){case"start":case"reset":init();break;case"hit":looseXM();break;case"itemUpdate":n=e.attr("item");var o=parseInt(e.attr("count"));updateItem(n,o);break;case"glyph":var i=parseInt(e.attr("level")),r=e.attr("itemWon"),s=e.attr("itemCount"),d=e.attr("time");launchGlyphGame(i,$(e),s,r,d);break;case"cssUpdate":$(e.attr("element")).css(e.attr("rule"),e.attr("value"));break;case"setAgentName":var c=e.attr("message");agentName=prompt(c),(void 0==agentName||agentName.length<=0)&&(agentName=randomName[getRandom(0,randomName.length-1)]),a=e.attr("showInto"),$(a).text(agentName);break;case"image":updateImage(e.attr("rule"),e.attr("selector"),e.attr("value"),e.attr("dataName"),e.attr("newName"));break;case"setFaction":a=e.attr("showInto");var l=e.attr("resistant");"true"==l&&$(a).html("résistance"),"false"==l&&$(a).html("illuminés");break;case"deploy":n=getInventory(e.attr("item"));var u=parseInt(e.attr("looseXMPerDeploy")),m=e.siblings("div.image"),h=e.siblings("button"),g=e.siblings(".success"),v=e.siblings(".warningStuff");if(e.parent(".section").find("span.item").each(function(){$(this).html(n.name)}),h.first().data("go",e.parent(".section").attr("id")),g.hide(),h.show(),h.last().hide(),v.hide(),0==m.children().size())updateImage("add",m,n.name+"/0.png",n.name+"_0",void 0);else if(n.count<=0)v.find(".item").html(n.name),v.show(),h.first().hide();else{var p=m.find("img").first().data("name"),f=p.split("_"),y=parseInt(f[1]);y++,n.count--,looseXM(u),updateImage("update",m,n.name+"/"+y+".png",n.name+"_"+(y-1),n.name+"_"+y),y>=MAX_RESONATORS&&(h.hide(),h.last().show(),g.show(),setXM(parseInt(getXM()+MAX_RESONATORS))),getXM()<=0&&endGame()}break;default:log&&console.log("[FATAL ERROR] "+t+" has not been defined in handleSingleAction !"),alert("Oups. Something went wrong. Sorry about that :("),location.reload()}}function shuffleArray(e){for(var t=e.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[a],e[a]=n}return e}function createPictures(e,t){var a=$.map(e,function(e){return e});a=shuffleArray(a),$.each(a,function(){var e=$("<p>");e.html(this.name+"<br/>");var a=$("<img>");a.attr("src","images/glyph/"+this.src);var n="100px";a.css("width",n).css("height",n),a.addClass("glyphPictures"),a.data("order",this.order),a.data("name",this.name),a.after(),e.append(a),t.prepend(e)})}function showSolution(e,t,a){for(var n=$("<ol>"),o=void 0,i=0;i<a;i++)o=$("<li>"),n.append(o);$("#glyphGame").prepend(n);for(var r=function(e){var a=t.filter(function(){return $(this).data("order")==e});n.children().eq(e-1).html(a.data("name"))},s=1;s<=a;s++)r(s);setTimeout(function(){n.remove()},e)}function launchGlyphGame(e,t,a,n,o){var i=t.parent(".section"),r=t.siblings("button");i.append("<div id='glyphGame'></div>"),r.hide();var s=$(glyph).filter(function(){return this.level=e}),d=getRandom(0,s.size()-1),c=s.get(d).order;createPictures(c,$("#glyphGame"));var l=$("img.glyphPictures");showSolution(o,$(l),e);var u=1;l.click(function(){var t=parseInt($(this).data("order"));t==u?(u++,$(this).css("border","solid 5px green")):(a>0&&a--,looseXM(),getXM()<=0&&endGame(),l.css("border","none"),setTimeout(function(){l.css("border","none")},300),$(this).css("border","solid 5px red"),u=1),u==e+1&&(log&&console.log("You won "+a+" "+n),l.parents("p").remove(),setXM(XM_INITIAL_VALUE),updateItem(n,a),i.find("ol").remove(),r.show())})}function handleActions(e){var t=$("#"+e).find("action");0!=t.size()&&t.each(function(e,t){handleSingleAction($(t))})}function gotoSection(e,t){void 0===t&&(t=!0),handleActions(e),setXM(getXM()),updateInventory(),log&&console.log("Display section : "+e),showSection(e,t),getXM()<=0&&"death"!=e&&endGame()}function getXM(){return parseInt(span_xm.text())}function setXM(e){span_xm.html(e)}function looseXM(e){void 0==e&&(e=1),setXM(getXM()-e)}function startGame(){gotoSection("intro",!1)}function endGame(){gotoSection("death",!1)}function resetCounterExcept(e){var t=void 0;void 0!=cheatsCodes&&(t=void 0!=e?$(cheatsCodes).filter(function(){return this.name!=e}):$(cheatsCodes),t.each(function(){this.cpt=0}))}var XM_INITIAL_VALUE=30,MAX_RESONATORS=8,buttons=$(".section button"),div_status=$("#status"),ul_inventoryList=$("#inventory"),span_xm=div_status.find(".xm .value"),span_xm_max=div_status.find(".xm .max"),inventory=[],agentName=void 0,BAN_TIME=100,MAX_ATTEMPT_BEFORE_BAN=3,colorArray=void 0,randomName=void 0,cheatImage=void 0,glyph=void 0,allowed_keys=void 0,keyboard_navigation=void 0,cheatsCodes=void 0,cheatAttemptCounter=0,numberOfCheatAttempFailed=0,log=!0,getRandom=function(e,t){return Math.floor(Math.random()*(t-e+1)+e)};buttons.click(function(){gotoSection($(this).data("go"))}),$(document).keyup(function(e){var keyCode=e.keyCode,keyPressed=e.key;if(log&&console.log("|"+keyPressed+"|",keyCode),void 0==allowed_keys||allowed_keys.indexOf(keyCode)!=-1||void 0==keyboard_navigation||keyboard_navigation.indexOf(keyCode)!=-1){$(".section:visible button:visible").each(function(){$(this).data("charCode")==keyCode&&gotoSection($(this).data("go"))});var somethingHappened=!1;void 0!=cheatsCodes&&$(cheatsCodes).each(function(){var cheatCodeName=this.name;keyCode==this.keys[this.cpt]&&(somethingHappened=!0,1==log&&console.log(cheatCodeName+" triggered"),this.cpt++,resetCounterExcept(cheatCodeName),this.cpt==this.keys.length&&(eval("("+this.success+"())"),resetCounterExcept()))}),1!=somethingHappened&&(resetCounterExcept(),void 0!=keyboard_navigation&&keyboard_navigation.indexOf(keyCode)==-1&&(1==log&&console.log("Someone is trying to cheat !"),cheatAttemptCounter++)),cheatAttemptCounter==MAX_ATTEMPT_BEFORE_BAN&&!function(){var e=cheatImage[getRandom(0,cheatImage.length-1)];cheatAttemptCounter=0;var t=$(".section:visible");t.hide(),div_status.hide(),0==numberOfCheatAttempFailed&&alert("Be careful, each time you will fail to find a cheat code, ban time will be doubled"),numberOfCheatAttempFailed++,$("body").css("background-image","url(images/cheats/"+e+")"),setTimeout(function(){$("body").css("background-image","none"),t.show(),div_status.show()},BAN_TIME*numberOfCheatAttempFailed)}()}}),loadJSONValue("cheats"),loadJSONValue("navigation"),loadJSONValue("randomName"),loadJSONValue("glyph"),startGame()});