if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>i(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/V3DzP35KoqDaLBdk13xpL/_buildManifest.js",revision:"b1aff68adee6e3af48f75469e4b89d0e"},{url:"/_next/static/V3DzP35KoqDaLBdk13xpL/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/153-5be04ce60e1588ff.js",revision:"5be04ce60e1588ff"},{url:"/_next/static/chunks/19-250c2741241ae99f.js",revision:"250c2741241ae99f"},{url:"/_next/static/chunks/324-45f0bdd56de5065e.js",revision:"45f0bdd56de5065e"},{url:"/_next/static/chunks/380-1d9e362009f60662.js",revision:"1d9e362009f60662"},{url:"/_next/static/chunks/480-49c0b6a1ee1750d5.js",revision:"49c0b6a1ee1750d5"},{url:"/_next/static/chunks/613-a1e213cb9ab05d2a.js",revision:"a1e213cb9ab05d2a"},{url:"/_next/static/chunks/622-25c70dbe336c2550.js",revision:"25c70dbe336c2550"},{url:"/_next/static/chunks/648-8b5d85e4e7a25124.js",revision:"8b5d85e4e7a25124"},{url:"/_next/static/chunks/7-374dbed0b0c009f0.js",revision:"374dbed0b0c009f0"},{url:"/_next/static/chunks/72-21d0555814482f0f.js",revision:"21d0555814482f0f"},{url:"/_next/static/chunks/957-3293b2bb1c255ff7.js",revision:"3293b2bb1c255ff7"},{url:"/_next/static/chunks/framework-3b5a00d5d7e8d93b.js",revision:"3b5a00d5d7e8d93b"},{url:"/_next/static/chunks/main-d7779a06a1d2bfba.js",revision:"d7779a06a1d2bfba"},{url:"/_next/static/chunks/pages/_app-a3e270f444d08219.js",revision:"a3e270f444d08219"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/armyBookSelection-08a728317ef6433a.js",revision:"08a728317ef6433a"},{url:"/_next/static/chunks/pages/codex-f66109ceb713eae4.js",revision:"f66109ceb713eae4"},{url:"/_next/static/chunks/pages/gameSystem-0f596dc96c88d125.js",revision:"0f596dc96c88d125"},{url:"/_next/static/chunks/pages/index-16e4efa1f68d0e73.js",revision:"16e4efa1f68d0e73"},{url:"/_next/static/chunks/pages/list-898eef9b2beaeedb.js",revision:"898eef9b2beaeedb"},{url:"/_next/static/chunks/pages/listConfiguration-3f337970b264878d.js",revision:"3f337970b264878d"},{url:"/_next/static/chunks/pages/load-fe6c011b7cb56320.js",revision:"fe6c011b7cb56320"},{url:"/_next/static/chunks/pages/rules-21f0a9fd27ac8d28.js",revision:"21f0a9fd27ac8d28"},{url:"/_next/static/chunks/pages/share-525fce38d7a8c640.js",revision:"525fce38d7a8c640"},{url:"/_next/static/chunks/pages/view-7fb6f1b3cdacc3dd.js",revision:"7fb6f1b3cdacc3dd"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-91e4d7af6dfda032.js",revision:"91e4d7af6dfda032"},{url:"/_next/static/css/0f9550a9e2258ad8.css",revision:"0f9550a9e2258ad8"},{url:"/_next/static/css/2ec9693eba1865cf.css",revision:"2ec9693eba1865cf"},{url:"/_next/static/css/92550047988a7fad.css",revision:"92550047988a7fad"},{url:"/_next/static/css/c8840fd97c04f543.css",revision:"c8840fd97c04f543"},{url:"/_next/static/media/AF_logo.a6fe785e.svg",revision:"a6fe785e"},{url:"/_next/static/media/ajax-loader.0b80f665.gif",revision:"0b80f665"},{url:"/_next/static/media/beta_label.33432bd5.png",revision:"33432bd5"},{url:"/_next/static/media/index_bg.118e365e.jpg",revision:"118e365e"},{url:"/_next/static/media/slick.25572f22.eot",revision:"25572f22"},{url:"/_next/static/media/slick.653a4cbb.woff",revision:"653a4cbb"},{url:"/_next/static/media/slick.6aa1ee46.ttf",revision:"6aa1ee46"},{url:"/_next/static/media/slick.f895cfdf.svg",revision:"f895cfdf"},{url:"/favicon.ico",revision:"a053567b98c246269d1ad65c4773fd28"},{url:"/icons/icon-128x128.png",revision:"b6c9b1e729a205cd7fe4cfe56bdbadfb"},{url:"/icons/icon-144x144.png",revision:"bd2666b79d6e4e55208d233aaf34bc43"},{url:"/icons/icon-152x152.png",revision:"e80402d63d707d8035b2013f735f7fce"},{url:"/icons/icon-16x16.png",revision:"3326911ba01c414b61230395570ce1a0"},{url:"/icons/icon-192x192.png",revision:"3d109c3e728351ab25c51690075275b4"},{url:"/icons/icon-32x32.png",revision:"25c2196162fad7a1b9642a793ffa5612"},{url:"/icons/icon-384x384.png",revision:"203e9eba73fd44c206faba73193b27e1"},{url:"/icons/icon-512x512.png",revision:"be0d6aa511adbc1b9bc909fae01e0e96"},{url:"/icons/icon-72x72.png",revision:"5b823baae4cd19ba194ba3234e64402b"},{url:"/icons/icon-96x96.png",revision:"7fabaf839e43f2353a8f060148257ad3"},{url:"/img/AF_logo.svg",revision:"b6dbeec4e4d36dc2f94f60a575e79112"},{url:"/img/aof_cover.jpg",revision:"349b166996ffcb41b4438dd5ced46412"},{url:"/img/aofr_cover.jpg",revision:"fad8b97972437826b13187ae2a49abca"},{url:"/img/aofs_cover.jpg",revision:"3ca0d7222b44703a5370a01f4751f789"},{url:"/img/army_bg.png",revision:"ec784dffd4162500bf832458495b5e81"},{url:"/img/beta_label.png",revision:"c9e0122a5200dbc04f5df33b819fa5e8"},{url:"/img/default_army.png",revision:"62ae97026fc9650a343832be9d6f34f1"},{url:"/img/favicon.png",revision:"25c2196162fad7a1b9642a793ffa5612"},{url:"/img/gf_cover.jpg",revision:"78224200b1a6dd346a9b402f2887bf88"},{url:"/img/gff_cover.jpg",revision:"2e5c038ead046fa99ff674220b7ae2f3"},{url:"/img/index_bg.jpg",revision:"39dc16e3b62b8904c9a4c0ad829b0d38"},{url:"/img/logo_full.png",revision:"2ae93dbe525ee1b36387e258c78aaee5"},{url:"/manifest.json",revision:"9cbb5e8f47a48deafb6568629b383542"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
