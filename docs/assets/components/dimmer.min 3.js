!function(x,e,F,T){"use strict";e=void 0!==e&&e.Math==Math?e:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),x.fn.dimmer=function(p){var b,v=x(this),h=(new Date).getTime(),y=[],C=p,w="string"==typeof C,S=[].slice.call(arguments,1);return v.each(function(){var a,i,s,r=x.isPlainObject(p)?x.extend(!0,{},x.fn.dimmer.settings,p):x.extend({},x.fn.dimmer.settings),n=r.selector,e=r.namespace,t=r.className,m=r.error,o="."+e,d="module-"+e,c=v.selector||"",l="ontouchstart"in F.documentElement?"touchstart":"click",u=x(this),f=this,g=u.data(d);(s={preinitialize:function(){a=s.is.dimmer()?(i=u.parent(),u):(i=u,s.has.dimmer()?r.dimmerName?i.find(n.dimmer).filter("."+r.dimmerName):i.find(n.dimmer):s.create())},initialize:function(){s.debug("Initializing dimmer",r),s.bind.events(),s.set.dimmable(),s.instantiate()},instantiate:function(){s.verbose("Storing instance of module",s),g=s,u.data(d,g)},destroy:function(){s.verbose("Destroying previous module",a),s.unbind.events(),s.remove.variation(),i.off(o)},bind:{events:function(){"hover"==r.on?i.on("mouseenter"+o,s.show).on("mouseleave"+o,s.hide):"click"==r.on&&i.on(l+o,s.toggle),s.is.page()&&(s.debug("Setting as a page dimmer",i),s.set.pageDimmer()),s.is.closable()&&(s.verbose("Adding dimmer close event",a),i.on(l+o,n.dimmer,s.event.click))}},unbind:{events:function(){u.removeData(d),i.off(o)}},event:{click:function(e){s.verbose("Determining if event occured on dimmer",e),(0===a.find(e.target).length||x(e.target).is(n.content))&&(s.hide(),e.stopImmediatePropagation())}},addContent:function(e){var i=x(e);s.debug("Add content to dimmer",i),i.parent()[0]!==a[0]&&i.detach().appendTo(a)},create:function(){var e=x(r.template.dimmer());return r.dimmerName&&(s.debug("Creating named dimmer",r.dimmerName),e.addClass(r.dimmerName)),e.appendTo(i),e},show:function(e){e=x.isFunction(e)?e:function(){},s.debug("Showing dimmer",a,r),s.set.variation(),s.is.dimmed()&&!s.is.animating()||!s.is.enabled()?s.debug("Dimmer is already shown or disabled"):(s.animate.show(e),r.onShow.call(f),r.onChange.call(f))},hide:function(e){e=x.isFunction(e)?e:function(){},s.is.dimmed()||s.is.animating()?(s.debug("Hiding dimmer",a),s.animate.hide(e),r.onHide.call(f),r.onChange.call(f)):s.debug("Dimmer is not visible")},toggle:function(){s.verbose("Toggling dimmer visibility",a),s.is.dimmed()?s.hide():s.show()},animate:{show:function(e){e=x.isFunction(e)?e:function(){},r.useCSS&&x.fn.transition!==T&&a.transition("is supported")?(r.useFlex?(s.debug("Using flex dimmer"),s.remove.legacy()):(s.debug("Using legacy non-flex dimmer"),s.set.legacy()),"auto"!==r.opacity&&s.set.opacity(),a.transition({displayType:r.useFlex?"flex":"block",animation:r.transition+" in",queue:!1,duration:s.get.duration(),useFailSafe:!0,onStart:function(){s.set.dimmed()},onComplete:function(){s.set.active(),e()}})):(s.verbose("Showing dimmer animation with javascript"),s.set.dimmed(),"auto"==r.opacity&&(r.opacity=.8),a.stop().css({opacity:0,width:"100%",height:"100%"}).fadeTo(s.get.duration(),r.opacity,function(){a.removeAttr("style"),s.set.active(),e()}))},hide:function(e){e=x.isFunction(e)?e:function(){},r.useCSS&&x.fn.transition!==T&&a.transition("is supported")?(s.verbose("Hiding dimmer with css"),a.transition({displayType:r.useFlex?"flex":"block",animation:r.transition+" out",queue:!1,duration:s.get.duration(),useFailSafe:!0,onStart:function(){s.remove.dimmed()},onComplete:function(){s.remove.variation(),s.remove.active(),e()}})):(s.verbose("Hiding dimmer with javascript"),s.remove.dimmed(),a.stop().fadeOut(s.get.duration(),function(){s.remove.active(),a.removeAttr("style"),e()}))}},get:{dimmer:function(){return a},duration:function(){return"object"==typeof r.duration?s.is.active()?r.duration.hide:r.duration.show:r.duration}},has:{dimmer:function(){return r.dimmerName?0<u.find(n.dimmer).filter("."+r.dimmerName).length:0<u.find(n.dimmer).length}},is:{active:function(){return a.hasClass(t.active)},animating:function(){return a.is(":animated")||a.hasClass(t.animating)},closable:function(){return"auto"==r.closable?"hover"!=r.on:r.closable},dimmer:function(){return u.hasClass(t.dimmer)},dimmable:function(){return u.hasClass(t.dimmable)},dimmed:function(){return i.hasClass(t.dimmed)},disabled:function(){return i.hasClass(t.disabled)},enabled:function(){return!s.is.disabled()},page:function(){return i.is("body")},pageDimmer:function(){return a.hasClass(t.pageDimmer)}},can:{show:function(){return!a.hasClass(t.disabled)}},set:{opacity:function(e){var i=a.css("background-color"),n=i.split(","),t=n&&3==n.length,o=n&&4==n.length;e=0===r.opacity?0:r.opacity||e,i=t||o?(n[3]=e+")",n.join(",")):"rgba(0, 0, 0, "+e+")",s.debug("Setting opacity to",e),a.css("background-color",i)},legacy:function(){a.addClass(t.legacy)},active:function(){a.addClass(t.active)},dimmable:function(){i.addClass(t.dimmable)},dimmed:function(){i.addClass(t.dimmed)},pageDimmer:function(){a.addClass(t.pageDimmer)},disabled:function(){a.addClass(t.disabled)},variation:function(e){(e=e||r.variation)&&a.addClass(e)}},remove:{active:function(){a.removeClass(t.active)},legacy:function(){a.removeClass(t.legacy)},dimmed:function(){i.removeClass(t.dimmed)},disabled:function(){a.removeClass(t.disabled)},variation:function(e){(e=e||r.variation)&&a.removeClass(e)}},setting:function(e,i){if(s.debug("Changing setting",e,i),x.isPlainObject(e))x.extend(!0,r,e);else{if(i===T)return r[e];x.isPlainObject(r[e])?x.extend(!0,r[e],i):r[e]=i}},internal:function(e,i){if(x.isPlainObject(e))x.extend(!0,s,e);else{if(i===T)return s[e];s[e]=i}},debug:function(){!r.silent&&r.debug&&(r.performance?s.performance.log(arguments):(s.debug=Function.prototype.bind.call(console.info,console,r.name+":"),s.debug.apply(console,arguments)))},verbose:function(){!r.silent&&r.verbose&&r.debug&&(r.performance?s.performance.log(arguments):(s.verbose=Function.prototype.bind.call(console.info,console,r.name+":"),s.verbose.apply(console,arguments)))},error:function(){r.silent||(s.error=Function.prototype.bind.call(console.error,console,r.name+":"),s.error.apply(console,arguments))},performance:{log:function(e){var i,n;r.performance&&(n=(i=(new Date).getTime())-(h||i),h=i,y.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:f,"Execution Time":n})),clearTimeout(s.performance.timer),s.performance.timer=setTimeout(s.performance.display,500)},display:function(){var e=r.name+":",n=0;h=!1,clearTimeout(s.performance.timer),x.each(y,function(e,i){n+=i["Execution Time"]}),e+=" "+n+"ms",c&&(e+=" '"+c+"'"),1<v.length&&(e+=" ("+v.length+")"),(console.group!==T||console.table!==T)&&0<y.length&&(console.groupCollapsed(e),console.table?console.table(y):x.each(y,function(e,i){console.log(i.Name+": "+i["Execution Time"]+"ms")}),console.groupEnd()),y=[]}},invoke:function(t,e,i){var o,a,n,r=g;return e=e||S,i=f||i,"string"==typeof t&&r!==T&&(t=t.split(/[\. ]/),o=t.length-1,x.each(t,function(e,i){var n=e!=o?i+t[e+1].charAt(0).toUpperCase()+t[e+1].slice(1):t;if(x.isPlainObject(r[n])&&e!=o)r=r[n];else{if(r[n]!==T)return a=r[n],!1;if(!x.isPlainObject(r[i])||e==o)return r[i]!==T?a=r[i]:s.error(m.method,t),!1;r=r[i]}})),x.isFunction(a)?n=a.apply(i,e):a!==T&&(n=a),x.isArray(b)?b.push(n):b!==T?b=[b,n]:n!==T&&(b=n),a}}).preinitialize(),w?(g===T&&s.initialize(),s.invoke(C)):(g!==T&&g.invoke("destroy"),s.initialize())}),b!==T?b:this},x.fn.dimmer.settings={name:"Dimmer",namespace:"dimmer",silent:!1,debug:!1,verbose:!1,performance:!0,useFlex:!0,dimmerName:!1,variation:!1,closable:"auto",useCSS:!0,transition:"fade",on:!1,opacity:"auto",duration:{show:500,hide:500},onChange:function(){},onShow:function(){},onHide:function(){},error:{method:"The method you called is not defined."},className:{active:"active",animating:"animating",dimmable:"dimmable",dimmed:"dimmed",dimmer:"dimmer",disabled:"disabled",hide:"hide",legacy:"legacy",pageDimmer:"page",show:"show"},selector:{dimmer:"> .ui.dimmer",content:".ui.dimmer > .content, .ui.dimmer > .content > .center"},template:{dimmer:function(){return x("<div />").attr("class","ui dimmer")}}}}(jQuery,window,document);