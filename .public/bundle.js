/*!💜I love you monad.*/
var S_ITER$0="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",S_MARK$0="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;function GET_ITER$0(e){if(e){if(Array.isArray(e))return 0;var t;if(S_MARK$0&&S_MARK$0(e),"object"==typeof e&&"function"==typeof(t=e[S_ITER$0]))return S_MARK$0&&S_MARK$0(void 0),t.call(e);if(S_MARK$0&&S_MARK$0(void 0),e+""=="[object Generator]")return e}throw new Error(e+" is not iterable")}var this$0=this,$=document.querySelector.bind(document),$$=document.querySelectorAll.bind(document),NProgress=window.NProgress,createThumbs=window.createThumbs,debounce=window.debounce,fetch=window.fetch,getL=window.getL,getSize=window.getSize,loadImage=window.loadImage;function detectIEEdge(){var e=window.navigator.userAgent,t=e.indexOf("MSIE ");if(t>0)return parseInt(e.substring(t+5,e.indexOf(".",t)),10);if(e.indexOf("Trident/")>0){var o=e.indexOf("rv:");return parseInt(e.substring(o+3,e.indexOf(".",o)),10)}var n=e.indexOf("Edge/");return n>0&&parseInt(e.substring(n+5,e.indexOf(".",n)),10)}createThumbs=function(e){var t,o,n,r,i="";for(o=(n=0===(t=GET_ITER$0(e)))?e.length:void 0;n?t<o:!(o=t.next()).done;){r=n?e[t++]:o.value;var a=Object.keys(e).indexOf(r);0!==a&&(i+=r.url+"\t"+r.width+"w"+(a!==e?",\n":""))}return t=o=n=void 0,i};var waitForElement=function(e){return new Promise((function(t,o){var n=document.querySelector(e);if(n)t(n);else{var r=new MutationObserver((function(o){o.forEach((function(o){var n,i,a,s,l=Array.from(o.addedNodes);for(i=(a=0===(n=GET_ITER$0(l)))?l.length:void 0;a?n<i:!(i=n.next()).done;)if((s=a?l[n++]:i.value).matches&&s.matches(e))return r.disconnect(),void t(s);n=i=a=void 0}))}));r.observe(document.documentElement,{childList:!0,subtree:!0})}}))};if(getSize=function(){var e,t,o,n,r;for(t=(o=0===(e=GET_ITER$0(n=$$("size-indicators>size-indicator"))))?n.length:void 0;o?e<t:!(t=e.next()).done;)if(r=o?n[e++]:t.value,"flex"===getComputedStyle(r).display)return r.classList[0].split("-")[1].replace("flex","xs");e=t=o=n=void 0},loadImage=function(e){return new Promise((function(t){var o=new Image;o.onload=function(){return t(o)},o.src=e}))},detectIEEdge()){var LLegacy=((navigator.language||navigator.userLanguage).indexOf("-")?(navigator.language||navigator.userLanguage).split("-")[0]:navigator.language||navigator.userLanguage).toLowerCase()||"en",host=void 0;host=-1===location.host.indexOf("glitch.me")?location.protocol+"//"+LLegacy+"."+location.hostname:location.protocol+"//"+location.hostname,location.replace(host+"/outdated-browser.html")}debounce=function(e,t,o){var n;return function(){var r=this$0,i=r.arguments,a=o&&!n;clearTimeout(n),n=setTimeout((function(){n=null,o||e.apply(r,i)}),t),a&&e.apply(r,i)}},getL=function(){var e=navigator.language||navigator.userLanguage;return e.includes("-")&&(e=e.split("-")[0]),e.toLowerCase()||"en"},NProgress.configure({showSpinner:!1});var ofetch=window.fetch;fetch=function(e,t){return(void 0===t||t.silent||$("#nprogress"))&&NProgress.start(),ofetch(e,t).then((function(e){return(void 0===t||t.silent||$("#nprogress"))&&NProgress.done(),e}))};var autocomplete=window.autocomplete,alert=window.alert,done=(createThumbs=window.createThumbs,debounce=window.debounce,window.done),HOST=(fetch=window.fetch,getL=window.getL,getSize=window.getSize,window.HOST),REGION=window.REGION,load=window.load,moment=window.moment,T=window.T,afterglow=(waitForElement=window.waitForElement,$=document.querySelector.bind(document),$$=document.querySelectorAll.bind(document),window.afterglow),vjs=window.vjs,poster=window.poster,Player=window.Player;Player={open:function(){$("#view-inner").append(T.PLAYER).removeClass("wait"),$("#filters")[0].style.setProperty("display","none","important"),$("#results")[0].style.setProperty("display","none","important")},close:function(){$(".growing").classList.remove("growing"),$(".grow").classList.remove("grow"),$("#filters")[0].style.setProperty("display",""),$("#results")[0].style.setProperty("display","")},play:function(e){Player.open(),afterglow.initVideoElements(),fetch(HOST+"/api/"+REGION+"/video/"+e).then((function(e){return e.text()})).then((function(e){var t=JSON.parse(e);waitForElement(".vjs-poster").then((function(e){e.outerHTML=$("#fake-poster").innerHTML.replace("{{preview-set}}",createThumbs(t.videoThumbnails))})),console.log(t)}))}},document.addEventListener("click",(function(e){if(e.target===$(".card[data-video]")){var t=$(e.currentTarget);$("#view-inner").classList.add("wait"),$("#results").classList.add("grow"),t.classList.add("growing"),setTimeout((function(){$("enlarger").innerHTML=t.innerHTML,Player.play(t.data("video")),$("#results").removeClass("grow"),t.removeClass("grow")}),799)}}));$=document.querySelector.bind(document),$$=document.querySelectorAll.bind(document),autocomplete=window.autocomplete,alert=window.alert,createThumbs=window.createThumbs,debounce=window.debounce,done=window.done,fetch=window.fetch,getL=window.getL,getSize=window.getSize,HOST=window.HOST,REGION=window.REGION,load=window.load;var lazyload=window.lazyload,numeral=(moment=window.moment,window.numeral),setupSearch=(T=window.T,waitForElement=window.waitForElement,window.setupSearch),SEARCH=window.SEARCH;setupSearch=function(){var e="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",t="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;$("#view-inner").innerHTML=T.RESULTS,SEARCH=function(o){var n=document.getElementById("results");if("true"!==n.getAttribute("search-active")){var r=+n.getAttribute("page")||0;switch(0===r?($("#view-inner").innerHTML=T.RESULTS,(n=document.getElementById("results")).setAttribute("state","search-fresh"),r=1):n.getAttribute("q")===o?(n.setAttribute("state","search-continue"),r+=1):($("#view-inner").innerHTML=T.RESULTS,(n=document.getElementById("results")).setAttribute("state","search-new"),r=1),n.setAttribute("search-active",!0),n.setAttribute("page",r),n.getAttribute("state")){case"search-fresh":console.log("Loading fresh results for query:",{q:o,"":"..."});break;case"search-new":console.log("Loading results for new query:",{q:o,"":"..."});break;case"search-continue":console.log("Loading continued results for query:",{q:o,page:r,"":"..."})}"search-continue"!==n.getAttribute("state")&&n.addEventListener("scroll",(function(e){var t=n;"true"!==n.getAttribute("search-active")&&t.scrollTop+t.clientHeight>=t.scrollHeight-t.scrollHeight/10&&SEARCH(t.getAttribute("q"))})),n.setAttribute("q",o),fetch(HOST+"/api/"+REGION+"/search/"+o+"/"+r).then((function(e){return e.text()})).then((function(o){var n,r,i,a=JSON.parse(o);for(r=(i=0===(n=function(o){if(o){if(Array.isArray(o))return 0;var n;if(t&&t(o),"object"==typeof o&&"function"==typeof(n=o[e]))return t&&t(void 0),n.call(o);if(t&&t(void 0),o+""=="[object Generator]")return o}throw new Error(o+" is not iterable")}(a)))?a.length:void 0;i?n<r:!(r=n.next()).done;)!function(e){var t,o=createThumbs(e.videoThumbnails),n=T.RESULT.replace("{{title}}",e.title).replace("{{preview-set}}",o.slice(0,-1)).replace("{{preview-desc}}",e.description).replace("{{duration}}",moment.duration(1e3*e.lengthSeconds).humanize()).replace("{{duration-detailed}}",(t=moment.utc(moment.duration(e.lengthSeconds,"seconds").asMilliseconds()).format("HH:mm:ss"),t.startsWith("00:")&&(t=t.slice(3)),t.startsWith("0")&&(t=t.slice(1)),t)).replace("{{video}}",e.videoId).replace("{{author}}",e.author).replace("{{authorid}}",e.authorId).replace("{{views}}",numeral(e.viewCount||0).format("0.a"));$("#results-inner").insertAdjacentHTML("afterend",n),lazyload($$("figure>img"))}(i?a[n++]:r.value);n=r=i=void 0,document.getElementById("results").setAttribute("search-active",!1)}))}};var o=document.getElementById("search-input");getL(),autocomplete({input:o,showOnFocus:!0,minLength:1,className:"live-search backdrop-blur",debounceWaitMs:299,fetch:function(o,n){var r=o.toLowerCase();r&&fetch(HOST+"/api/"+REGION+"/complete/"+r).then((function(e){return e.text()})).then((function(r){var i=JSON.parse(r);if(200===i.code){var a=[],s=[];a=[o].concat(function(o,n){if(o){if(Array.isArray(o))return n?o.slice():o;var r,i;if(t&&t(o),"object"==typeof o&&"function"==typeof(n=o[e])?(r=n.call(o),i=[]):o+""=="[object Generator]"&&(r=o,i=[]),t&&t(void 0),i){for(;!0!==(n=r.next()).done;)i.push(n.value);return i}}throw new Error(o+" is not iterable")}(i.data.filter((function(e){return e.length})))),(a=Object.values(Object.fromEntries(a.map((function(e){return[e.toLowerCase(),e]}))))).forEach((function(e){s.push({label:e,value:e})})),n(s)}else 404===i.code&&n([{label:o,value:o.toLowerCase()}])}))},onSelect:function(e){SEARCH(e.label)}});$("#search-input").addEventListener("focus",(function(){"xs"===getSize()&&($("#search")[0].style.setProperty("margin-left",0,"important"),$("#dynamic-logo")[0].style.setProperty("display","none","important"),$("#search").classList.add("col-11"),$("#search-btn").classList.add("d-none"),$("#search-input").classList.add("rounded"))})),$("#search-input").addEventListener("blur",(function(){"xs"===getSize()&&($("#search")[0].style.setProperty("margin-left",""),$("#dynamic-logo")[0].style.setProperty("display",""),$("#search").classList.remove("col-11"),$("#search-btn").classList.remove("d-none"),$("#search-input").classList.remove("rounded"))}))};debounce=window.debounce;var initBg=window.initBg,define=($=document.querySelector.bind(document),$$=document.querySelectorAll.bind(document),window.define),SimplexNoise=window.SimplexNoise;!function(){var e=.5*(Math.sqrt(3)-1),t=(3-Math.sqrt(3))/6,o=1/6,n=(Math.sqrt(5)-1)/4,r=(5-Math.sqrt(5))/20;function i(e){e||(e=Math.random),this.p=a(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var t=0;t<512;t++)this.perm[t]=this.p[255&t],this.permMod12[t]=this.perm[t]%12}function a(e){var t,o=new Uint8Array(256);for(t=0;t<256;t++)o[t]=t;for(t=0;t<255;t++){var n=t+~~(e()*(256-t)),r=o[t];o[t]=o[n],o[n]=r}return o}i.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(o,n){var r,i,a=this.permMod12,s=this.perm,l=this.grad3,c=0,d=0,u=0,f=(o+n)*e,w=Math.floor(o+f),h=Math.floor(n+f),m=(w+h)*t,g=o-(w-m),p=n-(h-m);g>p?(r=1,i=0):(r=0,i=1);var v=g-r+t,y=p-i+t,b=g-1+2*t,S=p-1+2*t,$=255&w,E=255&h,T=.5-g*g-p*p;if(T>=0){var L=3*a[$+s[E]];c=(T*=T)*T*(l[L]*g+l[L+1]*p)}var A=.5-v*v-y*y;if(A>=0){var O=3*a[$+r+s[E+i]];d=(A*=A)*A*(l[O]*v+l[O+1]*y)}var M=.5-b*b-S*S;if(M>=0){var I=3*a[$+1+s[E+1]];u=(M*=M)*M*(l[I]*b+l[I+1]*S)}return 70*(c+d+u)},noise3D:function(e,t,n){var r,i,a,s,l,c,d,u,f,w,h=this.permMod12,m=this.perm,g=this.grad3,p=(e+t+n)*(1/3),v=Math.floor(e+p),y=Math.floor(t+p),b=Math.floor(n+p),S=(v+y+b)*o,$=e-(v-S),E=t-(y-S),T=n-(b-S);$>=E?E>=T?(l=1,c=0,d=0,u=1,f=1,w=0):$>=T?(l=1,c=0,d=0,u=1,f=0,w=1):(l=0,c=0,d=1,u=1,f=0,w=1):E<T?(l=0,c=0,d=1,u=0,f=1,w=1):$<T?(l=0,c=1,d=0,u=0,f=1,w=1):(l=0,c=1,d=0,u=1,f=1,w=0);var L=$-l+o,A=E-c+o,O=T-d+o,M=$-u+2*o,I=E-f+2*o,R=T-w+2*o,x=$-1+.5,H=E-1+.5,P=T-1+.5,_=255&v,N=255&y,G=255&b,C=.6-$*$-E*E-T*T;if(C<0)r=0;else{var q=3*h[_+m[N+m[G]]];r=(C*=C)*C*(g[q]*$+g[q+1]*E+g[q+2]*T)}var z=.6-L*L-A*A-O*O;if(z<0)i=0;else{var j=3*h[_+l+m[N+c+m[G+d]]];i=(z*=z)*z*(g[j]*L+g[j+1]*A+g[j+2]*O)}var k=.6-M*M-I*I-R*R;if(k<0)a=0;else{var F=3*h[_+u+m[N+f+m[G+w]]];a=(k*=k)*k*(g[F]*M+g[F+1]*I+g[F+2]*R)}var B=.6-x*x-H*H-P*P;if(B<0)s=0;else{var U=3*h[_+1+m[N+1+m[G+1]]];s=(B*=B)*B*(g[U]*x+g[U+1]*H+g[U+2]*P)}return 32*(r+i+a+s)},noise4D:function(e,t,o,i){this.permMod12;var a,s,l,c,d,u,f,w,h,m,g,p,v,y,b,S,$,E=this.perm,T=this.grad4,L=(e+t+o+i)*n,A=Math.floor(e+L),O=Math.floor(t+L),M=Math.floor(o+L),I=Math.floor(i+L),R=(A+O+M+I)*r,x=e-(A-R),H=t-(O-R),P=o-(M-R),_=i-(I-R),N=0,G=0,C=0,q=0;x>H?N++:G++,x>P?N++:C++,x>_?N++:q++,H>P?G++:C++,H>_?G++:q++,P>_?C++:q++;var z=x-(u=N>=3?1:0)+r,j=H-(f=G>=3?1:0)+r,k=P-(w=C>=3?1:0)+r,F=_-(h=q>=3?1:0)+r,B=x-(m=N>=2?1:0)+2*r,U=H-(g=G>=2?1:0)+2*r,W=P-(p=C>=2?1:0)+2*r,D=_-(v=q>=2?1:0)+2*r,K=x-(y=N>=1?1:0)+3*r,Y=H-(b=G>=1?1:0)+3*r,J=P-(S=C>=1?1:0)+3*r,Z=_-($=q>=1?1:0)+3*r,V=x-1+4*r,Q=H-1+4*r,X=P-1+4*r,ee=_-1+4*r,te=255&A,oe=255&O,ne=255&M,re=255&I,ie=.6-x*x-H*H-P*P-_*_;if(ie<0)a=0;else{var ae=E[te+E[oe+E[ne+E[re]]]]%32*4;a=(ie*=ie)*ie*(T[ae]*x+T[ae+1]*H+T[ae+2]*P+T[ae+3]*_)}var se=.6-z*z-j*j-k*k-F*F;if(se<0)s=0;else{var le=E[te+u+E[oe+f+E[ne+w+E[re+h]]]]%32*4;s=(se*=se)*se*(T[le]*z+T[le+1]*j+T[le+2]*k+T[le+3]*F)}var ce=.6-B*B-U*U-W*W-D*D;if(ce<0)l=0;else{var de=E[te+m+E[oe+g+E[ne+p+E[re+v]]]]%32*4;l=(ce*=ce)*ce*(T[de]*B+T[de+1]*U+T[de+2]*W+T[de+3]*D)}var ue=.6-K*K-Y*Y-J*J-Z*Z;if(ue<0)c=0;else{var fe=E[te+y+E[oe+b+E[ne+S+E[re+$]]]]%32*4;c=(ue*=ue)*ue*(T[fe]*K+T[fe+1]*Y+T[fe+2]*J+T[fe+3]*Z)}var we=.6-V*V-Q*Q-X*X-ee*ee;if(we<0)d=0;else{var he=E[te+1+E[oe+1+E[ne+1+E[re+1]]]]%32*4;d=(we*=we)*we*(T[he]*V+T[he+1]*Q+T[he+2]*X+T[he+3]*ee)}return 27*(a+s+l+c+d)}},i._buildPermutationTable=a,void 0!==define&&define.amd&&define((function(){return i})),"undefined"!=typeof exports?exports.SimplexNoise=i:"undefined"!=typeof window&&(window.SimplexNoise=i),"undefined"!=typeof module&&(module.exports=i)}(),initBg=function(){var e,t,o,n,r,i,a={},s=function(){"use strict";(e={}).__proto__={a:o={}},e.a;var e,o,n=Object.defineProperty,r=Object.getOwnPropertyDescriptor,s={};function l(e,t,o){this.x=e,this.y=t,this.R=o}return n(l,"prototype",{configurable:!1,enumerable:!1,writable:!1}),s.draw=function(){t.save();var e="rgb(21, 21, "+Math.round(42*(i.noise2D(this.x/a.noiseZoom,this.y/a.noiseZoom)+1))+")";t.fillStyle=e,t.strokeStyle=e,t.translate(this.x,this.y),t.beginPath();for(var o=0;o<6;o++){var n=Math.PI/3*o+Math.PI/6,r=Math.cos(n)*this.R,s=Math.sin(n)*this.R;t.lineTo(r,s)}t.closePath(),t.stroke(),t.fill(),t.restore()},function(e,t){for(var o in t)t.hasOwnProperty(o)&&n(e,o,r(t,o))}(l.prototype,s),s=void 0,l}();function l(){o=e.width=window.innerWidth,n=e.height=window.innerHeight,t.lineCap="round",t.lineJoin="round",c()}function c(){i=new SimplexNoise,t.lineWidth=1,a.noiseZoom=400*Math.random()+200,a.size=19*Math.random()+16,function(){r=[];for(var e=a.size,t=e/Math.cos(Math.PI/6),i=2*e/Math.sqrt(3),l=o/(2*e)+1,c=n/t,d=0;d<l;d++)for(var u=0;u<c;u++){var f=new s(e*d*2+(u%2==0?e:0),(i/2+t)*u,t);r.push(f)}}(),t.fillStyle="black",t.fillRect(0,0,o,n),r.forEach((function(e){e.draw()}))}e=document.querySelector("#canvas"),t=e.getContext("2d"),window.addEventListener("resize",debounce(l,999)),e.addEventListener("click",c),l()},window.load=function(){return setTimeout((function(){$("diamond").setAttribute("style",""),$("#wrap")&&$("#wrap").setAttribute("style","display:none;"),initBg()}),999)},window.done=function(){return setTimeout((function(){$("diamond").setAttribute("style","display:none;"),$("#wrap")&&$("#wrap").setAttribute("style","")}),999)};$=document.querySelector.bind(document),$$=document.querySelectorAll.bind(document);location.hash="",console.log("%c Welcome to lapisTube 🙃","background: blue;");autocomplete=window.autocomplete,alert=window.alert,debounce=window.debounce,done=window.done,fetch=window.fetch,getL=window.getL,getSize=window.getSize,initBg=window.initBg,load=window.load,lazyload=window.lazyload,moment=window.moment,numeral=window.numeral,SEARCH=window.SEARCH,setupSearch=window.setupSearch,T=window.T,waitForElement=window.waitForElement;var API=window.API,GEO=window.GEO,lscache=(HOST=window.HOST,REGION=window.REGION,window.lscache);"gtranslate.io"!==!location.host&&!location.host.endsWith("glitch.me")&&window.self===window.top&&3===location.hostname.split(".").length&&(location.hostname.split("."),getL()[location.replace(location.protocol+"//"+location.hostname.split(".").splice(1).join("."))]),window.onresize=function(){$("body").attr("size",getSize())},HOST=location.protocol+"//"+(location.host.endsWith("glitch.me")?location.hostname:"gtranslate.io"===location.hostname?location.href.split("/edit/")[1]:getL()+"."+location.hostname),API="//"+location.hostname+"/api",document.addEventListener("click",(function(e){if(e.target===$("#toggle-left")){var t=$("#left");t.attr("expanded","false"===t.attr("expanded")?"true":"false"),setTimeout((function(){"false"===t.attr("expanded")?t.classList.add("d-none"):t.classList.remove("d-none")}),199)}})),console.log("Client starting up");var tr=HOST+"/html";if(lscache.get("cookie-accepted")){var T$0=window.T={};Promise.all([tr+"/app.html",API+"/geoip",tr+"/channel.html",tr+"/player.html",tr+"/player-inside.html",tr+"/result-item.html",tr+"/result-list.html"].map((function(e){return fetch(e).then((function(e){return e.text()}))}))).then((function(e){T$0.HOME=e[0],GEO=JSON.parse(e[1]),REGION=GEO.country_code.toLowerCase(),console.debug("Your Geo Information by Maxmind: ",GEO),console.debug("Your browser language: ",getL()),T$0.CHANNEL=e[2],T$0.PLAYER=e[3],T$0.PLAYER_INSIDE=e[4],T$0.RESULT=e[5],T$0.RESULTS=e[6],setupClient()})).catch((function(e){console.warn(e),alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!"),setTimeout((function(){location.reload(!0)}))}))}else fetch(tr+"/cookie.html").then((function(e){return e.text()})).then((function(e){$("gtranslate").outerHTML=e,done()}));var demo=function(){var e="New americana";$("#top").value=e,SEARCH(e);var t=".card[data-video=b-eYbUVZedY]";setTimeout((function(){return waitForElement(t).then((function(){$(t).click()}))}),999)};window.onhashchange=function(){var e=HOST+"/html";switch(location.hash){case"#cookie-what?":case"#what?":fetch(e+"/what.html").then((function(e){return e.text()})).then((function(e){$("[pop]").outerHTML=e,done()}))}switch(location.hash){case"#cookie":fetch(e+"/cookie.html").then((function(e){return e.text()})).then((function(e){$("[pop]").outerHTML=e,done()}))}},document.addEventListener("click",(function(e){e.target===$("#usage-accept")&&(lscache.set("cookie-accepted",!0,44640),location.reload(!0))}));var setupClient=function(){$("gtranslate").outerHTML=T.HOME,initBg(),waitForElement("#view").then((function(e){var t,o,n,r,i="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",a="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;for(moment.locale(getL()),setupSearch(),$("#yt-lang").innerText=getL(),o=(n=0===(t=function(e){if(e){if(Array.isArray(e))return 0;var t;if(a&&a(e),"object"==typeof e&&"function"==typeof(t=e[i]))return a&&a(void 0),t.call(e);if(a&&a(void 0),e+""=="[object Generator]")return e}throw new Error(e+" is not iterable")}(r=$$("#dynamic-logo .alpha-target"))))?r.length:void 0;n?t<o:!(o=t.next()).done;)(n?r[t++]:o.value).src="https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/"+GEO.country_code.toLowerCase()+".png";t=o=n=r=void 0,$("#dynamic-logo").setAttribute("title","Region: "+GEO.country),$("#yt-lang").setAttribute("title","App language: "+getL()),waitForElement("#results").then(demo),done(),console.log("Client done")}))};