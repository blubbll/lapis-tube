
var S_ITER$0="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",S_MARK$0="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;function GET_ITER$0(e){if(e){if(Array.isArray(e))return 0;var t;if(S_MARK$0&&S_MARK$0(e),"object"==typeof e&&"function"==typeof(t=e[S_ITER$0]))return S_MARK$0&&S_MARK$0(void 0),t.call(e);if(S_MARK$0&&S_MARK$0(void 0),e+""=="[object Generator]")return e}throw new Error(e+" is not iterable")}var this$0=this,$=window.$,NProgress=window.NProgress,debounce=window.debounce,fetch=window.fetch,getL=window.getL,getSize=window.getSize,loadImage=window.loadImage;function detectIEEdge(){var e=window.navigator.userAgent,t=e.indexOf("MSIE ");if(t>0)return parseInt(e.substring(t+5,e.indexOf(".",t)),10);if(e.indexOf("Trident/")>0){var o=e.indexOf("rv:");return parseInt(e.substring(o+3,e.indexOf(".",o)),10)}var n=e.indexOf("Edge/");return n>0&&parseInt(e.substring(n+5,e.indexOf(".",n)),10)}function waitForElement(e){return new Promise((function(t,o){var n=document.querySelector(e);if(n)t(n);else{var i=new MutationObserver((function(o){o.forEach((function(o){var n,r,a,l,s=Array.from(o.addedNodes);for(r=(a=0===(n=GET_ITER$0(s)))?s.length:void 0;a?n<r:!(r=n.next()).done;)if((l=a?s[n++]:r.value).matches&&l.matches(e))return i.disconnect(),void t(l);n=r=a=void 0}))}));i.observe(document.documentElement,{childList:!0,subtree:!0})}}))}if(getSize=function(){var e,t,o,n,i;for(t=(o=0===(e=GET_ITER$0(n=$("size-indicators").find("size-indicator"))))?n.length:void 0;o?e<t:!(t=e.next()).done;)if(i=o?n[e++]:t.value,"flex"===getComputedStyle(i).display)return i.classList[0].split("-")[1].replace("flex","xs");e=t=o=n=void 0},loadImage=function(e){return new Promise((function(t){var o=new Image;o.onload=function(){return t(o)},o.src=e}))},detectIEEdge()){var LLegacy=((navigator.language||navigator.userLanguage).indexOf("-")?(navigator.language||navigator.userLanguage).split("-")[0]:navigator.language||navigator.userLanguage).toLowerCase()||"en",host=void 0;host=-1===location.host.indexOf("glitch.me")?location.protocol+"//"+LLegacy+"."+location.hostname:location.protocol+"//"+location.hostname,location.replace(host+"/outdated-browser.html")}debounce=function(e,t,o){var n;return function(){var i=this$0,r=i.arguments,a=o&&!n;clearTimeout(n),n=setTimeout((function(){n=null,o||e.apply(i,r)}),t),a&&e.apply(i,r)}},getL=function(){var e=navigator.language||navigator.userLanguage;return e.includes("-")&&(e=e.split("-")[0]),e.toLowerCase()||"en"},NProgress.configure({showSpinner:!1});var ofetch=window.fetch;fetch=function(e,t){return(void 0===t||t.silent||$("#nprogress")[0])&&NProgress.start(),ofetch(e,t).then((function(e){return(void 0===t||t.silent||$("#nprogress")[0])&&NProgress.done(),e}))};this$0=this,$=window.$;var autocomplete=window.autocomplete,alert=window.alert,done=(debounce=window.debounce,window.done),HOST=(fetch=window.fetch,getL=window.getL,getSize=window.getSize,window.HOST),REGION=window.REGION,load=window.load,moment=window.moment,T=window.T,playVid=window.playVid,openPlayer=window.openPlayer,closePlayer=window.closePlayer;playVid=function(e){openPlayer(),fetch(HOST+"/api/"+REGION+"/video/"+e).then((function(e){return e.text()})).then((function(e){var t=JSON.parse(e);console.log(t)}))},closePlayer=function(){$("#player").remove(),$("#filters")[0].style.setProperty("display",""),$("#results")[0].style.setProperty("display","")},openPlayer=function(){$("#view-inner").append(T.PLAYER),$("#filters")[0].style.setProperty("display","none","important"),$("#results")[0].style.setProperty("display","none","important")},$(document).on("click",".card[data-video]",(function(){playVid($(this$0).data("video"))}));$=window.$,autocomplete=window.autocomplete,alert=window.alert,debounce=window.debounce,done=window.done,fetch=window.fetch,getL=window.getL,getSize=window.getSize,HOST=window.HOST,REGION=window.REGION,load=window.load;var lazyload=window.lazyload,numeral=(moment=window.moment,window.numeral),setupSearch=(T=window.T,waitForElement=window.waitForElement,window.setupSearch),SEARCH=window.SEARCH;setupSearch=function(){var e="undefined"!=typeof Symbol&&Symbol&&Symbol.iterator||"@@iterator",t="undefined"!=typeof Symbol&&Symbol&&Symbol.__setObjectSetter__;$("#view-inner").html(T.RESULTS),SEARCH=function(o){var n=document.getElementById("results"),i=n?+n.getAttribute("page"):1;1===i&&$("#view-inner").html(T.RESULTS),n.setAttribute("page",i+1),$(n).on("scroll",(function(e){var t=n;if(console.log(t.scrollTop+t.clientHeight),console.log(t.scrollHeight),console.log(t.clientHeight/10),t.scrollTop+t.clientHeight>=t.scrollHeight){var o=t.getAttribute("q");console.log("Loading page "+t.getAttribute("page")+" for query "+o+"..."),SEARCH(o)}})),$("param").html('<i class="fas fa-sync fa-spin"></i>'),n.getAttribute("q")===o?n.getAttribute("page",i+1):n.setAttribute("page",1),n.setAttribute("q",o),console.log(n.getAttribute("q")),fetch(HOST+"/api/"+REGION+"/search/"+o+"?page="+i).then((function(e){return e.text()})).then((function(o){function n(o){if(o){if(Array.isArray(o))return 0;var n;if(t&&t(o),"object"==typeof o&&"function"==typeof(n=o[e]))return t&&t(void 0),n.call(o);if(t&&t(void 0),o+""=="[object Generator]")return o}throw new Error(o+" is not iterable")}var i,r,a,l=JSON.parse(o);for(r=(a=0===(i=n(l)))?l.length:void 0;a?i<r:!(r=i.next()).done;){var s,c,d,u;(function(e){var t,o="";for(u=e.videoThumbnails,s=n(u),c=(d=0===s)?u.length:void 0;d?s<c:!(c=s.next()).done;)t=d?u[s++]:c.value,0!==Object.keys(e.videoThumbnails).indexOf(t)&&(o+=t.url+"\t"+t.width+"w,\n");s=c=d=u=void 0;var i,r=T.RESULT.replace("{{title}}",e.title).replace("{{preview-set}}",o.slice(0,-1)).replace("{{preview-desc}}",e.description).replace("{{duration}}",moment.duration(1e3*e.lengthSeconds).humanize()).replace("{{duration-detailed}}",(i=moment.utc(moment.duration(e.lengthSeconds,"seconds").asMilliseconds()).format("HH:mm:ss"),i.startsWith("00:")&&(i=i.slice(3)),i.startsWith("0")&&(i=i.slice(1)),i)).replace("{{video}}",e.videoId).replace("{{author}}",e.author).replace("{{authorid}}",e.authorId).replace("{{views}}",numeral(e.viewCount||0).format("0.a"));$("#results-inner").append(r),lazyload(document.querySelectorAll("figure>img"))})(a?l[i++]:r.value)}i=r=a=void 0,waitForElement("#results-inner").then((function(e){}))}))};var o=document.getElementById("search-input");getL(),autocomplete({input:o,showOnFocus:!0,minLength:1,className:"live-search backdrop-blur",debounceWaitMs:299,fetch:function(o,n){var i=o.toLowerCase();i&&fetch(HOST+"/api/"+REGION+"/complete/"+i).then((function(e){return e.text()})).then((function(i){var r=JSON.parse(i);if(200===r.code){var a=[],l=[];a=[o].concat(function(o,n){if(o){if(Array.isArray(o))return n?o.slice():o;var i,r;if(t&&t(o),"object"==typeof o&&"function"==typeof(n=o[e])?(i=n.call(o),r=[]):o+""=="[object Generator]"&&(i=o,r=[]),t&&t(void 0),r){for(;!0!==(n=i.next()).done;)r.push(n.value);return r}}throw new Error(o+" is not iterable")}(r.data.filter((function(e){return e.length})))),(a=Object.values(Object.fromEntries(a.map((function(e){return[e.toLowerCase(),e]}))))).forEach((function(e){l.push({label:e,value:e})})),n(l)}else 404===r.code&&n([{label:o,value:o.toLowerCase()}])}))},onSelect:function(e){SEARCH(e.label)}});$("#search-input").on("focus",(function(){"xs"===getSize()&&($("#search")[0].style.setProperty("margin-left",0,"important"),$("#dynamic-logo")[0].style.setProperty("display","none","important"),$("#search").addClass("col-11"),$("#search-btn").addClass("d-none"),$("#search-input").addClass("rounded"))})),$("#search-input").on("blur",(function(){"xs"===getSize()&&($("#search")[0].style.setProperty("margin-left",""),$("#dynamic-logo")[0].style.setProperty("display",""),$("#search").removeClass("col-11"),$("#search-btn").removeClass("d-none"),$("#search-input").removeClass("rounded"))}))};debounce=window.debounce;var initBg=window.initBg,define=window.define,SimplexNoise=window.SimplexNoise;!function(){"use strict";var e=.5*(Math.sqrt(3)-1),t=(3-Math.sqrt(3))/6,o=1/6,n=(Math.sqrt(5)-1)/4,i=(5-Math.sqrt(5))/20;function r(e){e||(e=Math.random),this.p=a(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var t=0;t<512;t++)this.perm[t]=this.p[255&t],this.permMod12[t]=this.perm[t]%12}function a(e){var t,o=new Uint8Array(256);for(t=0;t<256;t++)o[t]=t;for(t=0;t<255;t++){var n=t+~~(e()*(256-t)),i=o[t];o[t]=o[n],o[n]=i}return o}r.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(o,n){var i,r,a=this.permMod12,l=this.perm,s=this.grad3,c=0,d=0,u=0,f=(o+n)*e,w=Math.floor(o+f),h=Math.floor(n+f),p=(w+h)*t,m=o-(w-p),g=n-(h-p);m>g?(i=1,r=0):(i=0,r=1);var v=m-i+t,y=g-r+t,S=m-1+2*t,b=g-1+2*t,E=255&w,$=255&h,T=.5-m*m-g*g;if(T>=0){var O=3*a[E+l[$]];c=(T*=T)*T*(s[O]*m+s[O+1]*g)}var A=.5-v*v-y*y;if(A>=0){var L=3*a[E+i+l[$+r]];d=(A*=A)*A*(s[L]*v+s[L+1]*y)}var M=.5-S*S-b*b;if(M>=0){var x=3*a[E+1+l[$+1]];u=(M*=M)*M*(s[x]*S+s[x+1]*b)}return 70*(c+d+u)},noise3D:function(e,t,n){var i,r,a,l,s,c,d,u,f,w,h=this.permMod12,p=this.perm,m=this.grad3,g=(e+t+n)*(1/3),v=Math.floor(e+g),y=Math.floor(t+g),S=Math.floor(n+g),b=(v+y+S)*o,E=e-(v-b),$=t-(y-b),T=n-(S-b);E>=$?$>=T?(s=1,c=0,d=0,u=1,f=1,w=0):E>=T?(s=1,c=0,d=0,u=1,f=0,w=1):(s=0,c=0,d=1,u=1,f=0,w=1):$<T?(s=0,c=0,d=1,u=0,f=1,w=1):E<T?(s=0,c=1,d=0,u=0,f=1,w=1):(s=0,c=1,d=0,u=1,f=1,w=0);var O=E-s+o,A=$-c+o,L=T-d+o,M=E-u+2*o,x=$-f+2*o,R=T-w+2*o,I=E-1+.5,P=$-1+.5,H=T-1+.5,C=255&v,N=255&y,_=255&S,G=.6-E*E-$*$-T*T;if(G<0)i=0;else{var z=3*h[C+p[N+p[_]]];i=(G*=G)*G*(m[z]*E+m[z+1]*$+m[z+2]*T)}var q=.6-O*O-A*A-L*L;if(q<0)r=0;else{var k=3*h[C+s+p[N+c+p[_+d]]];r=(q*=q)*q*(m[k]*O+m[k+1]*A+m[k+2]*L)}var j=.6-M*M-x*x-R*R;if(j<0)a=0;else{var F=3*h[C+u+p[N+f+p[_+w]]];a=(j*=j)*j*(m[F]*M+m[F+1]*x+m[F+2]*R)}var B=.6-I*I-P*P-H*H;if(B<0)l=0;else{var W=3*h[C+1+p[N+1+p[_+1]]];l=(B*=B)*B*(m[W]*I+m[W+1]*P+m[W+2]*H)}return 32*(i+r+a+l)},noise4D:function(e,t,o,r){this.permMod12;var a,l,s,c,d,u,f,w,h,p,m,g,v,y,S,b,E,$=this.perm,T=this.grad4,O=(e+t+o+r)*n,A=Math.floor(e+O),L=Math.floor(t+O),M=Math.floor(o+O),x=Math.floor(r+O),R=(A+L+M+x)*i,I=e-(A-R),P=t-(L-R),H=o-(M-R),C=r-(x-R),N=0,_=0,G=0,z=0;I>P?N++:_++,I>H?N++:G++,I>C?N++:z++,P>H?_++:G++,P>C?_++:z++,H>C?G++:z++;var q=I-(u=N>=3?1:0)+i,k=P-(f=_>=3?1:0)+i,j=H-(w=G>=3?1:0)+i,F=C-(h=z>=3?1:0)+i,B=I-(p=N>=2?1:0)+2*i,W=P-(m=_>=2?1:0)+2*i,K=H-(g=G>=2?1:0)+2*i,U=C-(v=z>=2?1:0)+2*i,D=I-(y=N>=1?1:0)+3*i,J=P-(S=_>=1?1:0)+3*i,Y=H-(b=G>=1?1:0)+3*i,V=C-(E=z>=1?1:0)+3*i,Z=I-1+4*i,Q=P-1+4*i,X=H-1+4*i,ee=C-1+4*i,te=255&A,oe=255&L,ne=255&M,ie=255&x,re=.6-I*I-P*P-H*H-C*C;if(re<0)a=0;else{var ae=$[te+$[oe+$[ne+$[ie]]]]%32*4;a=(re*=re)*re*(T[ae]*I+T[ae+1]*P+T[ae+2]*H+T[ae+3]*C)}var le=.6-q*q-k*k-j*j-F*F;if(le<0)l=0;else{var se=$[te+u+$[oe+f+$[ne+w+$[ie+h]]]]%32*4;l=(le*=le)*le*(T[se]*q+T[se+1]*k+T[se+2]*j+T[se+3]*F)}var ce=.6-B*B-W*W-K*K-U*U;if(ce<0)s=0;else{var de=$[te+p+$[oe+m+$[ne+g+$[ie+v]]]]%32*4;s=(ce*=ce)*ce*(T[de]*B+T[de+1]*W+T[de+2]*K+T[de+3]*U)}var ue=.6-D*D-J*J-Y*Y-V*V;if(ue<0)c=0;else{var fe=$[te+y+$[oe+S+$[ne+b+$[ie+E]]]]%32*4;c=(ue*=ue)*ue*(T[fe]*D+T[fe+1]*J+T[fe+2]*Y+T[fe+3]*V)}var we=.6-Z*Z-Q*Q-X*X-ee*ee;if(we<0)d=0;else{var he=$[te+1+$[oe+1+$[ne+1+$[ie+1]]]]%32*4;d=(we*=we)*we*(T[he]*Z+T[he+1]*Q+T[he+2]*X+T[he+3]*ee)}return 27*(a+l+s+c+d)}},r._buildPermutationTable=a,void 0!==define&&define.amd&&define((function(){return r})),"undefined"!=typeof exports?exports.SimplexNoise=r:"undefined"!=typeof window&&(window.SimplexNoise=r),"undefined"!=typeof module&&(module.exports=r)}(),initBg=function(){var e,t,o,n,i,r,a={},l=function(){"use strict";(e={}).__proto__={a:o={}},e.a;var e,o,n=Object.defineProperty,i=Object.getOwnPropertyDescriptor,l={};function s(e,t,o){this.x=e,this.y=t,this.R=o}return n(s,"prototype",{configurable:!1,enumerable:!1,writable:!1}),l.draw=function(){t.save();var e="rgb(10, 10, "+Math.round(42*(r.noise2D(this.x/a.noiseZoom,this.y/a.noiseZoom)+1))+")";t.fillStyle=e,t.strokeStyle=e,t.translate(this.x,this.y),t.beginPath();for(var o=0;o<6;o++){var n=Math.PI/3*o+Math.PI/6,i=Math.cos(n)*this.R,l=Math.sin(n)*this.R;t.lineTo(i,l)}t.closePath(),t.stroke(),t.fill(),t.restore()},function(e,t){for(var o in t)t.hasOwnProperty(o)&&n(e,o,i(t,o))}(s.prototype,l),l=void 0,s}();function s(){o=e.width=window.innerWidth,n=e.height=window.innerHeight,t.lineCap="round",t.lineJoin="round",c()}function c(){r=new SimplexNoise,t.lineWidth=1,a.noiseZoom=400*Math.random()+200,a.size=15*Math.random()+6,function(){i=[];for(var e=a.size,t=e/Math.cos(Math.PI/6),r=2*e/Math.sqrt(3),s=o/(2*e)+1,c=n/t,d=0;d<s;d++)for(var u=0;u<c;u++){var f=new l(e*d*2+(u%2==0?e:0),(r/2+t)*u,t);i.push(f)}}(),t.fillStyle="black",t.fillRect(0,0,o,n),i.forEach((function(e){e.draw()}))}e=document.querySelector("#canvas"),t=e.getContext("2d"),window.addEventListener("resize",debounce(s,999)),e.addEventListener("click",c),s()},window.load=function(){return setTimeout((function(){document.querySelector("diamond").setAttribute("style",""),document.querySelector("#wrap")&&document.querySelector("#wrap").setAttribute("style","display:none;"),initBg()}),999)},window.done=function(){return setTimeout((function(){document.querySelector("diamond").setAttribute("style","display:none;"),document.querySelector("#wrap")&&document.querySelector("#wrap").setAttribute("style","")}),999)},location.hash="",console.log("%c Welcome to lapisTube 🙃","background: blue;");$=window.$,autocomplete=window.autocomplete,alert=window.alert,debounce=window.debounce,done=window.done,fetch=window.fetch,getL=window.getL,getSize=window.getSize,initBg=window.initBg,load=window.load,lazyload=window.lazyload,moment=window.moment,numeral=window.numeral,SEARCH=window.SEARCH,setupSearch=window.setupSearch,T=window.T;var waitForElement=window.waitForElement,API=window.API,GEO=window.GEO,lscache=(HOST=window.HOST,REGION=window.REGION,window.lscache);"gtranslate.io"!==!location.host&&!location.host.endsWith("glitch.me")&&window.self===window.top&&3===location.hostname.split(".").length&&(location.hostname.split(".")[0],getL()[location.replace(location.protocol+"//"+location.hostname.split(".").splice(1).join("."))]),window.onresize=function(){$("body").attr("size",getSize())},HOST=location.protocol+"//"+(location.host.endsWith("glitch.me")?location.hostname:"gtranslate.io"===location.hostname?location.href.split("/edit/")[1]:getL()+"."+location.hostname),API="//"+location.hostname+"/api",$(document).on("click","#toggle-left",(function(){var e=$("#left");e.attr("expanded","false"===e.attr("expanded")?"true":"false"),setTimeout((function(){"false"===e.attr("expanded")?e.addClass("d-none"):e.removeClass("d-none")}),199)})),console.log("Client starting up");var tr=HOST+"/html";if(lscache.get("cookie-accepted")){var T$0=window.T={};Promise.all([tr+"/app.html",API+"/geoip",tr+"/channel.html",tr+"/player.html",tr+"/result-item.html",tr+"/result-list.html"].map((function(e){return fetch(e).then((function(e){return e.text()}))}))).then((function(e){T$0.HOME=e[0],GEO=JSON.parse(e[1]),REGION=GEO.country_code.toLowerCase(),console.debug("Your Geo Information by Maxmind: ",GEO),console.debug("Your browser language: ",getL()),T$0.CHANNEL=e[2],T$0.PLAYER=e[3],T$0.RESULT=e[4],T$0.RESULTS=e[5],setupClient()})).catch((function(e){console.warn(e),alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!"),setTimeout((function(){location.reload(!0)}))}))}else fetch(tr+"/cookie.html").then((function(e){return e.text()})).then((function(e){$("gtranslate")[0].outerHTML=e,done()}));var demo=function(){var e="New americana";$("#top")[0].value=e,SEARCH(e)};window.onhashchange=function(){var e=HOST+"/html";switch(location.hash){case"#cookie-what?":case"#what?":fetch(e+"/what.html").then((function(e){return e.text()})).then((function(e){$("[pop]")[0].outerHTML=e,done()}))}switch(location.hash){case"#cookie":fetch(e+"/cookie.html").then((function(e){return e.text()})).then((function(e){$("[pop]")[0].outerHTML=e,done()}))}},$(document).on("click","#usage-accept",(function(){lscache.set("cookie-accepted",!0,44640),location.reload(!0)}));var setupClient=function(){$("gtranslate")[0].outerHTML=T.HOME,initBg(),console.log(getL()),waitForElement("#view").then((function(e){moment.locale(getL()),setupSearch(),$("#yt-lang").text(getL()),$("#dynamic-logo .alpha-target")[0].src="https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/"+GEO.country_code.toLowerCase()+".png",$("#dynamic-logo")[0].setAttribute("title","Region: "+GEO.country),$("#yt-lang")[0].setAttribute("title","App language: "+getL()),waitForElement("#results").then(demo),done(),console.log("Client done")}))};