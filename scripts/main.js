"use strict";$(document).ready(function(){function loadJSONValue(e){var t={method:"GET",url:"resources/"+e+".json",dataType:"json"},a=$.ajax(t);a.done(function(t){var a=$.map(t,function(e){return e});switch(e){case"randomName":randomName=a;break;case"glyph":glyph=a;break;case"navigation":keyboard_navigation=$.map(t.navigate_between_section,function(e){return e}),allowed_keys=$.map(t.keys_allowed_for_cheat_code,function(e){return e});break;case"cheats":BAN_TIME=t.ban_time,MAX_ATTEMPT_BEFORE_BAN=t.max_attempt_before_ban,cheatImage=$.map(t.images,function(e){return e}),cheatsCodes=$.map(t.codes,function(e){return e});break;default:alert("Error, no array found in loadJSONValue function"),location.reload()}})}function init(){setXM(XM_INITIAL_VALUE),span_xm_max.html(XM_INITIAL_VALUE),inventory=[],agentName=void 0,updateItem("resonateur",0)}function updateItem(e,t){var a=getInventory(e);void 0==a?inventory.push({name:e,count:t}):a.count=parseInt(getInventory(e).count)+parseInt(t),getInventory(e).count<=0&&(getInventory(e).count=0),updateInventory()}function updateInventory(){ul_inventoryList.empty();var e=void 0;$(inventory).each(function(t,a){e=$("<li>"),e.data("name",a.name),e.html(a.name+": "+a.count),ul_inventoryList.append(e)})}function getInventory(e){return inventory.find(function(t){return t.name==e})}function showSection(e,t){void 0===t&&(t=!0),$(".section").hide(),t?$("#status").show():$("#status").hide();var a=$("#"+e);a.size()<=0?(log&&console.log("[FATAL ERROR] "+e+" section is not defined !"),alert("An error occured, please try again later."),location.reload()):(a.show(),bindKeyEvent($(a)))}function bindKeyEvent(e){void 0!=keyboard_navigation&&e.find("button").each(function(e){var t=String.fromCharCode(keyboard_navigation[e]);if($(this).data("charCode",keyboard_navigation[e]),$(this).html().indexOf(t+"-")==-1){var a=$(this).html();$(this).html(t+"-"+a)}})}function updateImage(e,t,a,o,n){var r=void 0;if("add"==e){r=$("<img>"),r.attr("src","images/"+a);var i="100px";r.css("width",i).css("height",i),r.data("name",o),$(t).append(r)}else if("update"==e||"remove"==e){if(r=$("img").filter(function(){return $(this).data("name")==o}),0==r.size())return log&&console.log("Image not found for "+e+" rule in image action !"),void alert("Oups. An image is missing. Sorry about that.");"update"==e?(r.attr("src","images/"+a),r.data("name",n)):r.remove()}}function handleSingleAction(e,t){var a=e.attr("name"),o=void 0,n=void 0;log&&console.log("Action received : "+a),function(){switch(a){case"start":case"reset":init();break;case"hit":looseXM();break;case"itemUpdate":n=e.attr("item");var r=parseInt(e.attr("count"));updateItem(n,r);break;case"glyph":0==t&&(alert("Sorry, there is an error."),location.reload());var i=parseInt(e.attr("level")),s=e.attr("itemWon"),c=e.attr("itemCount"),d=e.attr("time");launchGlyphGame(i,$(e),c,s,d,t);break;case"cssUpdate":$(e.attr("element")).css(e.attr("rule"),e.attr("value"));break;case"setAgentName":if(void 0!=agentName)break;var l=e.attr("message");agentName=prompt(l),(void 0==agentName||agentName.length<=0)&&(agentName=randomName[getRandom(0,randomName.length-1)]),o=e.attr("showInto"),$(o).text(agentName);break;case"image":updateImage(e.attr("rule"),e.attr("selector"),e.attr("value"),e.attr("dataName"),e.attr("newName"));break;case"resetCSS":var u="#d3d3d3";$("html").css("color",u),$("button").css("background-color",u),$(".section button:hover").css({"background-color":"dark-grey",color:"#101010"}),$("#status").css("border-color",u),$(".section").css("border-color",u),$(".xm").css({"border-color":u,color:u});break;case"resistance":var m=e.siblings("p").last();m.css({color:"lightblue","text-align":"center"}),m.hide(),setTimeout(function(){m.show()},1e3);break;case"setFaction":o=e.attr("showInto");var h=e.attr("resistant"),g=void 0;g="true"==h?"#11ecf7":"#06cc58",$("html").css("color",g),$("button").css("background-color",g),$(".section").css("border-color",g),$("#status").css("border-color",g),$(".xm").css({"border-color":g,color:g});break;case"deploy":n=getInventory(e.attr("item"));var v=parseInt(e.attr("looseXMPerDeploy")),p=e.siblings("div.image"),f=e.siblings("button"),y=e.siblings(".success"),b=e.siblings(".warningStuff");if(e.parent(".section").find("span.item").each(function(){$(this).html(n.name)}),f.first().data("go",e.parent(".section").attr("id")),y.hide(),f.show(),f.last().hide(),b.hide(),0==p.children().size())updateImage("add",p,n.name+"/0.png",n.name+"_0",void 0),0==t&&(alert("Oops, an error. Sorry about that"),location.reload()),f.last().data("go",t);else if(n.count<=0)b.find(".item").html(n.name),b.show(),f.first().hide();else{var _=p.find("img").first().data("name"),k=_.split("_"),A=parseInt(k[1]);A++,n.count--,looseXM(v),updateImage("update",p,n.name+"/"+A+".png",n.name+"_"+(A-1),n.name+"_"+A),A>=MAX_RESONATORS&&(p.html(""),f.hide(),f.last().show(),y.show(),setXM(parseInt(getXM()+MAX_RESONATORS))),getXM()<=0&&endGame()}break;default:log&&console.log("[FATAL ERROR] "+a+" has not been defined in handleSingleAction !"),alert("Oups. Something went wrong. Sorry about that :("),location.reload()}}()}function shuffleArray(e){for(var t=e.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),o=e[t];e[t]=e[a],e[a]=o}return e}function createPictures(e,t){var a=$.map(e,function(e){return e});a=shuffleArray(a),$.each(a,function(){var e=$("<p>");e.html(this.name+"<br/>");var a=$("<img>");a.attr("src","images/glyph/"+this.src);var o="100px";a.css("width",o).css("height",o),a.addClass("glyphPictures"),a.data("order",this.order),a.data("name",this.name),a.after(),e.append(a),t.prepend(e)})}function showSolution(e,t,a){for(var o=$("<ol>"),n=void 0,r=0;r<a;r++)n=$("<li>"),o.append(n);$("#glyphGame").prepend(o);for(var i=function(e){var a=t.filter(function(){return $(this).data("order")==e});o.children().eq(e-1).html(a.data("name"))},s=1;s<=a;s++)i(s);setTimeout(function(){o.remove()},e)}function launchGlyphGame(e,t,a,o,n,r){0==r&&(alert("Oops, an error. Sorry :("),location.reload());var i=t.parent(".section"),s=t.siblings("button");i.append("<div id='glyphGame'></div>"),s.hide(),s.data("go",r),i.find("span.itemCount").html(a),i.find("span.itemWon").html(o);var c=$(glyph).filter(function(){return this.level=e}),d=getRandom(0,c.size()-1),l=c.get(d).order;createPictures(l,$("#glyphGame"));var u=$("img.glyphPictures");showSolution(n,$(u),e);var m=1;u.click(function(){var t=parseInt($(this).data("order"));t==m?(m++,$(this).css("border","solid 5px green")):(a>0&&a--,looseXM(),getXM()<=0&&gotoSection("no_more_xm",!1),u.css("border","none"),setTimeout(function(){u.css("border","none")},300),$(this).css("border","solid 5px red"),m=1),m==e+1&&(log&&console.log("You won "+a+" "+o),u.parents("p").remove(),setXM(XM_INITIAL_VALUE),updateItem(o,a),i.find("ol").remove(),s.show())})}function handleActions(e,t){var a=$("#"+e).find("action");0!=a.size()&&a.each(function(e,a){handleSingleAction($(a),t)})}function gotoSection(e,t,a){void 0===t&&(t=!0),void 0==a&&(a=!1),handleActions(e,a),setXM(getXM()),updateInventory(),log&&console.log("Display section : "+e),showSection(e,t),getXM()<=0&&"stop_game"!=e&&"no_more_xm"!=e&&endGame(),getXM()>XM_INITIAL_VALUE&&setXM(XM_INITIAL_VALUE)}function getXM(){return parseInt(span_xm.text())}function setXM(e){span_xm.html(e)}function looseXM(e){void 0==e&&(e=1),setXM(getXM()-e)}function startGame(){gotoSection("intro",!1)}function endGame(){gotoSection("stop_game",!1)}function resetCounterExcept(e){var t=void 0;void 0!=cheatsCodes&&(t=void 0!=e?$(cheatsCodes).filter(function(){return this.name!=e}):$(cheatsCodes),t.each(function(){this.cpt=0}))}var XM_INITIAL_VALUE=30,MAX_RESONATORS=8,buttons=$(".section button"),div_status=$("#status"),ul_inventoryList=$("#inventory"),span_xm=div_status.find(".xm .value"),span_xm_max=div_status.find(".xm .max"),inventory=[],agentName=void 0,BAN_TIME=100,MAX_ATTEMPT_BEFORE_BAN=3,colorArray=void 0,randomName=void 0,cheatImage=void 0,glyph=void 0,allowed_keys=void 0,keyboard_navigation=void 0,cheatsCodes=void 0,cheatAttemptCounter=0,numberOfCheatAttempFailed=0,log=!0,getRandom=function(e,t){return Math.floor(Math.random()*(t-e+1)+e)};buttons.click(function(){gotoSection($(this).data("go"),void 0,$(this).data("next"))}),$(document).keyup(function(e){var keyCode=e.keyCode,keyPressed=e.key;if(log&&console.log("|"+keyPressed+"|",keyCode),void 0==allowed_keys||allowed_keys.indexOf(keyCode)!=-1||void 0==keyboard_navigation||keyboard_navigation.indexOf(keyCode)!=-1){$(".section:visible button:visible").each(function(){$(this).data("charCode")==keyCode&&gotoSection($(this).data("go"),void 0,$(this).data("next"))});var somethingHappened=!1;void 0!=cheatsCodes&&$(cheatsCodes).each(function(){var cheatCodeName=this.name;keyCode==this.keys[this.cpt]&&(somethingHappened=!0,1==log&&console.log(cheatCodeName+" triggered"),this.cpt++,resetCounterExcept(cheatCodeName),this.cpt==this.keys.length&&(eval("("+this.success+"())"),resetCounterExcept()))}),1!=somethingHappened&&(resetCounterExcept(),void 0!=keyboard_navigation&&keyboard_navigation.indexOf(keyCode)==-1&&(1==log&&console.log("Someone is trying to cheat !"),cheatAttemptCounter++)),cheatAttemptCounter==MAX_ATTEMPT_BEFORE_BAN&&!function(){var e=cheatImage[getRandom(0,cheatImage.length-1)];cheatAttemptCounter=0;var t=$(".section:visible");t.hide(),div_status.hide(),0==numberOfCheatAttempFailed&&alert("Be careful, each time you will fail to find a cheat code, ban time will be doubled"),numberOfCheatAttempFailed++,$("html").css("background-color","transparent"),$("body").css("background-image","url(images/cheats/"+e+")"),setTimeout(function(){$("html").css("background-color","#000000"),$("body").css("background-image","none"),t.show(),div_status.show()},BAN_TIME*numberOfCheatAttempFailed)}()}}),loadJSONValue("cheats"),loadJSONValue("navigation"),loadJSONValue("randomName"),loadJSONValue("glyph"),startGame()});