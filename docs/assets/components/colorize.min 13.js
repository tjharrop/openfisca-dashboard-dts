/*!
 * # Semantic UI 2.0.0 - Colorize
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,n,i,t){"use strict";e.fn.colorize=function(n){var i=e.isPlainObject(n)?e.extend(!0,{},e.fn.colorize.settings,n):e.extend({},e.fn.colorize.settings),o=arguments||!1;return e(this).each(function(n){var a,r,c,s,d,g,u,l,m=e(this),f=e("<canvas />")[0],h=e("<canvas />")[0],p=e("<canvas />")[0],v=new Image,w=i.colors,b=(i.paths,i.namespace),y=i.error,C=m.data("module-"+b);return l={checkPreconditions:function(){return l.debug("Checking pre-conditions"),!e.isPlainObject(w)||e.isEmptyObject(w)?(l.error(y.undefinedColors),!1):!0},async:function(e){i.async?setTimeout(e,0):e()},getMetadata:function(){l.debug("Grabbing metadata"),s=m.data("image")||i.image||t,d=m.data("name")||i.name||n,g=i.width||m.width(),u=i.height||m.height(),(0===g||0===u)&&l.error(y.undefinedSize)},initialize:function(){l.debug("Initializing with colors",w),l.checkPreconditions()&&l.async(function(){l.getMetadata(),l.canvas.create(),l.draw.image(function(){l.draw.colors(),l.canvas.merge()}),m.data("module-"+b,l)})},redraw:function(){l.debug("Redrawing image"),l.async(function(){l.canvas.clear(),l.draw.colors(),l.canvas.merge()})},change:{color:function(e,n){return l.debug("Changing color",e),w[e]===t?(l.error(y.missingColor),!1):(w[e]=n,void l.redraw())}},canvas:{create:function(){l.debug("Creating canvases"),f.width=g,f.height=u,h.width=g,h.height=u,p.width=g,p.height=u,a=f.getContext("2d"),r=h.getContext("2d"),c=p.getContext("2d"),m.append(f),a=m.children("canvas")[0].getContext("2d")},clear:function(e){l.debug("Clearing canvas"),c.fillStyle="#FFFFFF",c.fillRect(0,0,g,u)},merge:function(){return e.isFunction(a.blendOnto)?(a.putImageData(r.getImageData(0,0,g,u),0,0),void c.blendOnto(a,"multiply")):void l.error(y.missingPlugin)}},draw:{image:function(e){l.debug("Drawing image"),e=e||function(){},s?(v.src=s,v.onload=function(){r.drawImage(v,0,0),e()}):(l.error(y.noImage),e())},colors:function(){l.debug("Drawing color overlays",w),e.each(w,function(e,n){i.onDraw(c,d,e,n)})}},debug:function(e,n){i.debug&&(n!==t?console.info(i.name+": "+e,n):console.info(i.name+": "+e))},error:function(e){console.warn(i.name+": "+e)},invoke:function(n,o,a){var r;return a=a||Array.prototype.slice.call(arguments,2),"string"==typeof n&&C!==t&&(n=n.split("."),e.each(n,function(n,t){return e.isPlainObject(C[t])?(C=C[t],!0):e.isFunction(C[t])?(r=C[t],!0):(l.error(i.error.method),!1)})),e.isFunction(r)?r.apply(o,a):!1}},C!==t&&o?("invoke"==o[0]&&(o=Array.prototype.slice.call(o,1)),l.invoke(o[0],this,Array.prototype.slice.call(o,1))):void l.initialize()}),this},e.fn.colorize.settings={name:"Image Colorizer",debug:!0,namespace:"colorize",onDraw:function(e,n,i,t){},async:!0,colors:{},metadata:{image:"image",name:"name"},error:{noImage:"No tracing image specified",undefinedColors:"No default colors specified.",missingColor:"Attempted to change color that does not exist",missingPlugin:"Blend onto plug-in must be included",undefinedHeight:"The width or height of image canvas could not be automatically determined. Please specify a height."}}}(jQuery,window,document);