
var S_ITER$0="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",S_MARK$0="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;function GET_ITER$0(e){if(e){if(Array.isArray(e))return 0;var t;if(S_MARK$0&&S_MARK$0(e),"object"==typeof e&&"function"==typeof(t=e[S_ITER$0]))return S_MARK$0&&S_MARK$0(void 0),t.call(e);if(S_MARK$0&&S_MARK$0(void 0),e+""=="[object Generator]")return e}throw new Error(e+" is not iterable")}var this$0=this,$=window.$,NProgress=window.NProgress,createThumbs=window.createThumbs,debounce=window.debounce,fetch=window.fetch,getL=window.getL,getSize=window.getSize,loadImage=window.loadImage;function detectIEEdge(){var e=window.navigator.userAgent,t=e.indexOf("MSIE ");if(t>0)return parseInt(e.substring(t+5,e.indexOf(".",t)),10);if(e.indexOf("Trident/")>0){var o=e.indexOf("rv:");return parseInt(e.substring(o+3,e.indexOf(".",o)),10)}var n=e.indexOf("Edge/");return n>0&&parseInt(e.substring(n+5,e.indexOf(".",n)),10)}createThumbs=function(e){var t,o,n,r,i="";for(o=(n=0===(t=GET_ITER$0(e)))?e.length:void 0;n?t<o:!(o=t.next()).done;){r=n?e[t++]:o.value;var a=Object.keys(e).indexOf(r);0!==a&&(i+=r.url+"\t"+r.width+"w"+(a!==e?",\n":""))}return t=o=n=void 0,i};var waitForElement=function(e){return new Promise((function(t,o){var n=document.querySelector(e);if(n)t(n);else{var r=new MutationObserver((function(o){o.forEach((function(o){var n,i,a,s,l=Array.from(o.addedNodes);for(i=(a=0===(n=GET_ITER$0(l)))?l.length:void 0;a?n<i:!(i=n.next()).done;)if((s=a?l[n++]:i.value).matches&&s.matches(e))return r.disconnect(),void t(s);n=i=a=void 0}))}));r.observe(document.documentElement,{childList:!0,subtree:!0})}}))};if(getSize=function(){var e,t,o,n,r;for(t=(o=0===(e=GET_ITER$0(n=$("size-indicators").find("size-indicator"))))?n.length:void 0;o?e<t:!(t=e.next()).done;)if(r=o?n[e++]:t.value,"flex"===getComputedStyle(r).display)return r.classList[0].split("-")[1].replace("flex","xs");e=t=o=n=void 0},loadImage=function(e){return new Promise((function(t){var o=new Image;o.onload=function(){return t(o)},o.src=e}))},detectIEEdge()){var LLegacy=((navigator.language||navigator.userLanguage).indexOf("-")?(navigator.language||navigator.userLanguage).split("-")[0]:navigator.language||navigator.userLanguage).toLowerCase()||"en",host=void 0;host=-1===location.host.indexOf("glitch.me")?location.protocol+"//"+LLegacy+"."+location.hostname:location.protocol+"//"+location.hostname,location.replace(host+"/outdated-browser.html")}debounce=function(e,t,o){var n;return function(){var r=this$0,i=r.arguments,a=o&&!n;clearTimeout(n),n=setTimeout((function(){n=null,o||e.apply(r,i)}),t),a&&e.apply(r,i)}},getL=function(){var e=navigator.language||navigator.userLanguage;return e.includes("-")&&(e=e.split("-")[0]),e.toLowerCase()||"en"},NProgress.configure({showSpinner:!1});var ofetch=window.fetch;fetch=function(e,t){return(void 0===t||t.silent||$("#nprogress")[0])&&NProgress.start(),ofetch(e,t).then((function(e){return(void 0===t||t.silent||$("#nprogress")[0])&&NProgress.done(),e}))};$=window.$;var autocomplete=window.autocomplete,alert=window.alert,done=(createThumbs=window.createThumbs,debounce=window.debounce,window.done),HOST=(fetch=window.fetch,getL=window.getL,getSize=window.getSize,window.HOST),REGION=window.REGION,load=window.load,moment=window.moment,T=window.T,afterglow=(waitForElement=window.waitForElement,window.afterglow),vjs=window.vjs,poster=window.poster,Player=window.Player;Player={open:function(){$("#view-inner").append(T.PLAYER).removeClass("wait"),$("#filters")[0].style.setProperty("display","none","important"),$("#results")[0].style.setProperty("display","none","important")},close:function(){$("#player").remove(),$("#filters")[0].style.setProperty("display",""),$("#results")[0].style.setProperty("display","")},play:function(e){Player.open(),afterglow.initVideoElements(),fetch(HOST+"/api/"+REGION+"/video/"+e).then((function(e){return e.text()})).then((function(e){var t=JSON.parse(e);waitForElement(".vjs-poster").then((function(e){e.outerHTML=$("#fake-poster").html().replace("{{preview-set}}",createThumbs(t.videoThumbnails))})),console.log(t)}))}},$(document).on("click",".card[data-video]",(function(e){var t=$(e.currentTarget);$("#view-inner").addClass("wait"),$("#results").addClass("growing"),t.addClass("grow"),setTimeout((function(){$("enlarger").html(t.html()),Player.play(t.data("video")),$("#results").removeClass("growing"),t.removeClass("grow")}),799)}));$=window.$,autocomplete=window.autocomplete,alert=window.alert,createThumbs=window.createThumbs,debounce=window.debounce,done=window.done,fetch=window.fetch,getL=window.getL,getSize=window.getSize,HOST=window.HOST,REGION=window.REGION,load=window.load;var lazyload=window.lazyload,numeral=(moment=window.moment,window.numeral),setupSearch=(T=window.T,waitForElement=window.waitForElement,window.setupSearch),SEARCH=window.SEARCH;setupSearch=function(){var e="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",t="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;$("#view-inner").html(T.RESULTS),SEARCH=function(o){var n=document.getElementById("results");if("true"!==n.getAttribute("search-active")){var r=+n.getAttribute("page")||0;switch(0===r?($("#view-inner").html(T.RESULTS),(n=document.getElementById("results")).setAttribute("state","search-fresh"),r=1):n.getAttribute("q")===o?(n.setAttribute("state","search-continue"),r+=1):($("#view-inner").html(T.RESULTS),(n=document.getElementById("results")).setAttribute("state","search-new"),r=1),n.setAttribute("search-active",!0),n.setAttribute("page",r),n.getAttribute("state")){case"search-fresh":console.log("Loading fresh results for query:",{q:o,"":"..."});break;case"search-new":console.log("Loading results for new query:",{q:o,"":"..."});break;case"search-continue":console.log("Loading continued results for query:",{q:o,page:r,"":"..."})}"search-continue"!==n.getAttribute("state")&&$(n).on("scroll",(function(e){var t=n;"true"!==n.getAttribute("search-active")&&t.scrollTop+t.clientHeight>=t.scrollHeight-t.scrollHeight/10&&SEARCH(t.getAttribute("q"))})),n.setAttribute("q",o),fetch(HOST+"/api/"+REGION+"/search/"+o+"/"+r).then((function(e){return e.text()})).then((function(o){var n,r,i,a=JSON.parse(o);for(r=(i=0===(n=function(o){if(o){if(Array.isArray(o))return 0;var n;if(t&&t(o),"object"==typeof o&&"function"==typeof(n=o[e]))return t&&t(void 0),n.call(o);if(t&&t(void 0),o+""=="[object Generator]")return o}throw new Error(o+" is not iterable")}(a)))?a.length:void 0;i?n<r:!(r=n.next()).done;)!function(e){var t,o=createThumbs(e.videoThumbnails),n=T.RESULT.replace("{{title}}",e.title).replace("{{preview-set}}",o.slice(0,-1)).replace("{{preview-desc}}",e.description).replace("{{duration}}",moment.duration(1e3*e.lengthSeconds).humanize()).replace("{{duration-detailed}}",(t=moment.utc(moment.duration(e.lengthSeconds,"seconds").asMilliseconds()).format("HH:mm:ss"),t.startsWith("00:")&&(t=t.slice(3)),t.startsWith("0")&&(t=t.slice(1)),t)).replace("{{video}}",e.videoId).replace("{{author}}",e.author).replace("{{authorid}}",e.authorId).replace("{{views}}",numeral(e.viewCount||0).format("0.a"));$("#results-inner").append(n),lazyload(document.querySelectorAll("figure>img"))}(i?a[n++]:r.value);n=r=i=void 0,document.getElementById("results").setAttribute("search-active",!1)}))}};var o=document.getElementById("search-input");getL(),autocomplete({input:o,showOnFocus:!0,minLength:1,className:"live-search backdrop-blur",debounceWaitMs:299,fetch:function(o,n){var r=o.toLowerCase();r&&fetch(HOST+"/api/"+REGION+"/complete/"+r).then((function(e){return e.text()})).then((function(r){var i=JSON.parse(r);if(200===i.code){var a=[],s=[];a=[o].concat(function(o,n){if(o){if(Array.isArray(o))return n?o.slice():o;var r,i;if(t&&t(o),"object"==typeof o&&"function"==typeof(n=o[e])?(r=n.call(o),i=[]):o+""=="[object Generator]"&&(r=o,i=[]),t&&t(void 0),i){for(;!0!==(n=r.next()).done;)i.push(n.value);return i}}throw new Error(o+" is not iterable")}(i.data.filter((function(e){return e.length})))),(a=Object.values(Object.fromEntries(a.map((function(e){return[e.toLowerCase(),e]}))))).forEach((function(e){s.push({label:e,value:e})})),n(s)}else 404===i.code&&n([{label:o,value:o.toLowerCase()}])}))},onSelect:function(e){SEARCH(e.label)}});$("#search-input").on("focus",(function(){"xs"===getSize()&&($("#search")[0].style.setProperty("margin-left",0,"important"),$("#dynamic-logo")[0].style.setProperty("display","none","important"),$("#search").addClass("col-11"),$("#search-btn").addClass("d-none"),$("#search-input").addClass("rounded"))})),$("#search-input").on("blur",(function(){"xs"===getSize()&&($("#search")[0].style.setProperty("margin-left",""),$("#dynamic-logo")[0].style.setProperty("display",""),$("#search").removeClass("col-11"),$("#search-btn").removeClass("d-none"),$("#search-input").removeClass("rounded"))}))};debounce=window.debounce;var initBg=window.initBg,define=window.define,SimplexNoise=window.SimplexNoise;!function(){"use strict";var e=.5*(Math.sqrt(3)-1),t=(3-Math.sqrt(3))/6,o=1/6,n=(Math.sqrt(5)-1)/4,r=(5-Math.sqrt(5))/20;function i(e){e||(e=Math.random),this.p=a(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var t=0;t<512;t++)this.perm[t]=this.p[255&t],this.permMod12[t]=this.perm[t]%12}function a(e){var t,o=new Uint8Array(256);for(t=0;t<256;t++)o[t]=t;for(t=0;t<255;t++){var n=t+~~(e()*(256-t)),r=o[t];o[t]=o[n],o[n]=r}return o}i.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(o,n){var r,i,a=this.permMod12,s=this.perm,l=this.grad3,c=0,d=0,u=0,w=(o+n)*e,h=Math.floor(o+w),f=Math.floor(n+w),m=(h+f)*t,p=o-(h-m),g=n-(f-m);p>g?(r=1,i=0):(r=0,i=1);var v=p-r+t,y=g-i+t,b=p-1+2*t,S=g-1+2*t,E=255&h,T=255&f,$=.5-p*p-g*g;if($>=0){var A=3*a[E+s[T]];c=($*=$)*$*(l[A]*p+l[A+1]*g)}var O=.5-v*v-y*y;if(O>=0){var L=3*a[E+r+s[T+i]];d=(O*=O)*O*(l[L]*v+l[L+1]*y)}var M=.5-b*b-S*S;if(M>=0){var I=3*a[E+1+s[T+1]];u=(M*=M)*M*(l[I]*b+l[I+1]*S)}return 70*(c+d+u)},noise3D:function(e,t,n){var r,i,a,s,l,c,d,u,w,h,f=this.permMod12,m=this.perm,p=this.grad3,g=(e+t+n)*(1/3),v=Math.floor(e+g),y=Math.floor(t+g),b=Math.floor(n+g),S=(v+y+b)*o,E=e-(v-S),T=t-(y-S),$=n-(b-S);E>=T?T>=$?(l=1,c=0,d=0,u=1,w=1,h=0):E>=$?(l=1,c=0,d=0,u=1,w=0,h=1):(l=0,c=0,d=1,u=1,w=0,h=1):T<$?(l=0,c=0,d=1,u=0,w=1,h=1):E<$?(l=0,c=1,d=0,u=0,w=1,h=1):(l=0,c=1,d=0,u=1,w=1,h=0);var A=E-l+o,O=T-c+o,L=$-d+o,M=E-u+2*o,I=T-w+2*o,R=$-h+2*o,x=E-1+.5,C=T-1+.5,P=$-1+.5,H=255&v,N=255&y,_=255&b,G=.6-E*E-T*T-$*$;if(G<0)r=0;else{var z=3*f[H+m[N+m[_]]];r=(G*=G)*G*(p[z]*E+p[z+1]*T+p[z+2]*$)}var q=.6-A*A-O*O-L*L;if(q<0)i=0;else{var k=3*f[H+l+m[N+c+m[_+d]]];i=(q*=q)*q*(p[k]*A+p[k+1]*O+p[k+2]*L)}var j=.6-M*M-I*I-R*R;if(j<0)a=0;else{var F=3*f[H+u+m[N+w+m[_+h]]];a=(j*=j)*j*(p[F]*M+p[F+1]*I+p[F+2]*R)}var B=.6-x*x-C*C-P*P;if(B<0)s=0;else{var U=3*f[H+1+m[N+1+m[_+1]]];s=(B*=B)*B*(p[U]*x+p[U+1]*C+p[U+2]*P)}return 32*(r+i+a+s)},noise4D:function(e,t,o,i){this.permMod12;var a,s,l,c,d,u,w,h,f,m,p,g,v,y,b,S,E,T=this.perm,$=this.grad4,A=(e+t+o+i)*n,O=Math.floor(e+A),L=Math.floor(t+A),M=Math.floor(o+A),I=Math.floor(i+A),R=(O+L+M+I)*r,x=e-(O-R),C=t-(L-R),P=o-(M-R),H=i-(I-R),N=0,_=0,G=0,z=0;x>C?N++:_++,x>P?N++:G++,x>H?N++:z++,C>P?_++:G++,C>H?_++:z++,P>H?G++:z++;var q=x-(u=N>=3?1:0)+r,k=C-(w=_>=3?1:0)+r,j=P-(h=G>=3?1:0)+r,F=H-(f=z>=3?1:0)+r,B=x-(m=N>=2?1:0)+2*r,U=C-(p=_>=2?1:0)+2*r,W=P-(g=G>=2?1:0)+2*r,D=H-(v=z>=2?1:0)+2*r,K=x-(y=N>=1?1:0)+3*r,Y=C-(b=_>=1?1:0)+3*r,J=P-(S=G>=1?1:0)+3*r,Z=H-(E=z>=1?1:0)+3*r,V=x-1+4*r,Q=C-1+4*r,X=P-1+4*r,ee=H-1+4*r,te=255&O,oe=255&L,ne=255&M,re=255&I,ie=.6-x*x-C*C-P*P-H*H;if(ie<0)a=0;else{var ae=T[te+T[oe+T[ne+T[re]]]]%32*4;a=(ie*=ie)*ie*($[ae]*x+$[ae+1]*C+$[ae+2]*P+$[ae+3]*H)}var se=.6-q*q-k*k-j*j-F*F;if(se<0)s=0;else{var le=T[te+u+T[oe+w+T[ne+h+T[re+f]]]]%32*4;s=(se*=se)*se*($[le]*q+$[le+1]*k+$[le+2]*j+$[le+3]*F)}var ce=.6-B*B-U*U-W*W-D*D;if(ce<0)l=0;else{var de=T[te+m+T[oe+p+T[ne+g+T[re+v]]]]%32*4;l=(ce*=ce)*ce*($[de]*B+$[de+1]*U+$[de+2]*W+$[de+3]*D)}var ue=.6-K*K-Y*Y-J*J-Z*Z;if(ue<0)c=0;else{var we=T[te+y+T[oe+b+T[ne+S+T[re+E]]]]%32*4;c=(ue*=ue)*ue*($[we]*K+$[we+1]*Y+$[we+2]*J+$[we+3]*Z)}var he=.6-V*V-Q*Q-X*X-ee*ee;if(he<0)d=0;else{var fe=T[te+1+T[oe+1+T[ne+1+T[re+1]]]]%32*4;d=(he*=he)*he*($[fe]*V+$[fe+1]*Q+$[fe+2]*X+$[fe+3]*ee)}return 27*(a+s+l+c+d)}},i._buildPermutationTable=a,void 0!==define&&define.amd&&define((function(){return i})),"undefined"!=typeof exports?exports.SimplexNoise=i:"undefined"!=typeof window&&(window.SimplexNoise=i),"undefined"!=typeof module&&(module.exports=i)}(),initBg=function(){var e,t,o,n,r,i,a={},s=function(){"use strict";(e={}).__proto__={a:o={}},e.a;var e,o,n=Object.defineProperty,r=Object.getOwnPropertyDescriptor,s={};function l(e,t,o){this.x=e,this.y=t,this.R=o}return n(l,"prototype",{configurable:!1,enumerable:!1,writable:!1}),s.draw=function(){t.save();var e="rgb(21, 21, "+Math.round(42*(i.noise2D(this.x/a.noiseZoom,this.y/a.noiseZoom)+1))+")";t.fillStyle=e,t.strokeStyle=e,t.translate(this.x,this.y),t.beginPath();for(var o=0;o<6;o++){var n=Math.PI/3*o+Math.PI/6,r=Math.cos(n)*this.R,s=Math.sin(n)*this.R;t.lineTo(r,s)}t.closePath(),t.stroke(),t.fill(),t.restore()},function(e,t){for(var o in t)t.hasOwnProperty(o)&&n(e,o,r(t,o))}(l.prototype,s),s=void 0,l}();function l(){o=e.width=window.innerWidth,n=e.height=window.innerHeight,t.lineCap="round",t.lineJoin="round",c()}function c(){i=new SimplexNoise,t.lineWidth=1,a.noiseZoom=400*Math.random()+200,a.size=19*Math.random()+16,function(){r=[];for(var e=a.size,t=e/Math.cos(Math.PI/6),i=2*e/Math.sqrt(3),l=o/(2*e)+1,c=n/t,d=0;d<l;d++)for(var u=0;u<c;u++){var w=new s(e*d*2+(u%2==0?e:0),(i/2+t)*u,t);r.push(w)}}(),t.fillStyle="black",t.fillRect(0,0,o,n),r.forEach((function(e){e.draw()}))}e=document.querySelector("#canvas"),t=e.getContext("2d"),window.addEventListener("resize",debounce(l,999)),e.addEventListener("click",c),l()},window.load=function(){return setTimeout((function(){document.querySelector("diamond").setAttribute("style",""),document.querySelector("#wrap")&&document.querySelector("#wrap").setAttribute("style","display:none;"),initBg()}),999)},window.done=function(){return setTimeout((function(){document.querySelector("diamond").setAttribute("style","display:none;"),document.querySelector("#wrap")&&document.querySelector("#wrap").setAttribute("style","")}),999)},location.hash="",console.log("%c Welcome to lapisTube 🙃","background: blue;");$=window.$,autocomplete=window.autocomplete,alert=window.alert,debounce=window.debounce,done=window.done,fetch=window.fetch,getL=window.getL,getSize=window.getSize,initBg=window.initBg,load=window.load,lazyload=window.lazyload,moment=window.moment,numeral=window.numeral,SEARCH=window.SEARCH,setupSearch=window.setupSearch,T=window.T,waitForElement=window.waitForElement;var API=window.API,GEO=window.GEO,lscache=(HOST=window.HOST,REGION=window.REGION,window.lscache);"gtranslate.io"!==!location.host&&!location.host.endsWith("glitch.me")&&window.self===window.top&&3===location.hostname.split(".").length&&(location.hostname.split(".")[0],getL()[location.replace(location.protocol+"//"+location.hostname.split(".").splice(1).join("."))]),window.onresize=function(){$("body").attr("size",getSize())},HOST=location.protocol+"//"+(location.host.endsWith("glitch.me")?location.hostname:"gtranslate.io"===location.hostname?location.href.split("/edit/")[1]:getL()+"."+location.hostname),API="//"+location.hostname+"/api",$(document).on("click","#toggle-left",(function(){var e=$("#left");e.attr("expanded","false"===e.attr("expanded")?"true":"false"),setTimeout((function(){"false"===e.attr("expanded")?e.addClass("d-none"):e.removeClass("d-none")}),199)})),console.log("Client starting up");var tr=HOST+"/html";if(lscache.get("cookie-accepted")){var T$0=window.T={};Promise.all([tr+"/app.html",API+"/geoip",tr+"/channel.html",tr+"/player.html",tr+"/player-inside.html",tr+"/result-item.html",tr+"/result-list.html"].map((function(e){return fetch(e).then((function(e){return e.text()}))}))).then((function(e){T$0.HOME=e[0],GEO=JSON.parse(e[1]),REGION=GEO.country_code.toLowerCase(),console.debug("Your Geo Information by Maxmind: ",GEO),console.debug("Your browser language: ",getL()),T$0.CHANNEL=e[2],T$0.PLAYER=e[3],T$0.PLAYER_INSIDE=e[4],T$0.RESULT=e[5],T$0.RESULTS=e[6],setupClient()})).catch((function(e){console.warn(e),alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!"),setTimeout((function(){location.reload(!0)}))}))}else fetch(tr+"/cookie.html").then((function(e){return e.text()})).then((function(e){$("gtranslate")[0].outerHTML=e,done()}));var demo=function(){var e="New americana";$("#top")[0].value=e,SEARCH(e);var t=".card[data-video=b-eYbUVZedY]";setTimeout((function(){return waitForElement(t).then((function(){$(t)[0].click()}))}),999)};window.onhashchange=function(){var e=HOST+"/html";switch(location.hash){case"#cookie-what?":case"#what?":fetch(e+"/what.html").then((function(e){return e.text()})).then((function(e){$("[pop]")[0].outerHTML=e,done()}))}switch(location.hash){case"#cookie":fetch(e+"/cookie.html").then((function(e){return e.text()})).then((function(e){$("[pop]")[0].outerHTML=e,done()}))}},$(document).on("click","#usage-accept",(function(){lscache.set("cookie-accepted",!0,44640),location.reload(!0)}));var setupClient=function(){$("gtranslate")[0].outerHTML=T.HOME,initBg(),waitForElement("#view").then((function(e){moment.locale(getL()),setupSearch(),$("#yt-lang").text(getL()),$("#dynamic-logo .alpha-target")[0].src="https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/"+GEO.country_code.toLowerCase()+".png",$("#dynamic-logo")[0].setAttribute("title","Region: "+GEO.country),$("#yt-lang")[0].setAttribute("title","App language: "+getL()),waitForElement("#results").then(demo),done(),console.log("Client done")}))};