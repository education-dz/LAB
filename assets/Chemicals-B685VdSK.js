import{K as kt,r as y,aD as St,o as Ct,u as zt,a as Et,q as At,g as U,ar as It,j as e,Q as Be,c as ye,d as Ve,F as Dt,S as he,m as G,aE as Mt,f as Ot,e as I,ac as Ae,T as Ie,V as Tt,A as pe,h as K,w as Qe,X as De,k as Me,l as ee,s as me,n as $t,i as ve,O as ue,aF as Oe,E as Ht,p as _t,t as Rt,v as Ye,x as Ke,at as Lt}from"./index-B6xKb0oN.js";import{l as we,L as je,a as Ne}from"./loggingService-C_PsXEIm.js";import{P as Ft}from"./pdfService-ClzxQftJ.js";import{Q as Gt}from"./QRScanner-B92NSHAP.js";import{D as Xe}from"./download-lBYmQJMa.js";import{P as Pt}from"./plus-Y4xTSda_.js";import{F as qt}from"./funnel-C6V6G0MW.js";import{S as Ut}from"./square-pen-B8Ju54Pv.js";import{T as Ze}from"./trash-2-C40SC_Kh.js";import{R as Wt}from"./rotate-ccw-CmaIjmKC.js";import{C as Bt}from"./chevron-up-60WlMR8M.js";import"./jspdf.plugin.autotable-CCdu3i8s.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],Qt=kt("wand-sparkles",Vt);function te(h,m,s){let a=s.initialDeps??[],r,l=!0;function c(){var o,x,w;let N;s.key&&((o=s.debug)!=null&&o.call(s))&&(N=Date.now());const d=h();if(!(d.length!==a.length||d.some((z,D)=>a[D]!==z)))return r;a=d;let f;if(s.key&&((x=s.debug)!=null&&x.call(s))&&(f=Date.now()),r=m(...d),s.key&&((w=s.debug)!=null&&w.call(s))){const z=Math.round((Date.now()-N)*100)/100,D=Math.round((Date.now()-f)*100)/100,M=D/16,$=(_,W)=>{for(_=String(_);_.length<W;)_=" "+_;return _};console.info(`%c⏱ ${$(D,5)} /${$(z,5)} ms`,`
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0,Math.min(120-120*M,120))}deg 100% 31%);`,s==null?void 0:s.key)}return s!=null&&s.onChange&&!(l&&s.skipInitialOnChange)&&s.onChange(r),l=!1,r}return c.updateDeps=o=>{a=o},c}function Je(h,m){if(h===void 0)throw new Error("Unexpected undefined");return h}const Yt=(h,m)=>Math.abs(h-m)<1.01,Kt=(h,m,s)=>{let a;return function(...r){h.clearTimeout(a),a=h.setTimeout(()=>m.apply(this,r),s)}},et=h=>{const{offsetWidth:m,offsetHeight:s}=h;return{width:m,height:s}},Xt=h=>h,Zt=h=>{const m=Math.max(h.startIndex-h.overscan,0),s=Math.min(h.endIndex+h.overscan,h.count-1),a=[];for(let r=m;r<=s;r++)a.push(r);return a},Jt=(h,m)=>{const s=h.scrollElement;if(!s)return;const a=h.targetWindow;if(!a)return;const r=c=>{const{width:o,height:x}=c;m({width:Math.round(o),height:Math.round(x)})};if(r(et(s)),!a.ResizeObserver)return()=>{};const l=new a.ResizeObserver(c=>{const o=()=>{const x=c[0];if(x!=null&&x.borderBoxSize){const w=x.borderBoxSize[0];if(w){r({width:w.inlineSize,height:w.blockSize});return}}r(et(s))};h.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(o):o()});return l.observe(s,{box:"border-box"}),()=>{l.unobserve(s)}},tt={passive:!0},st=typeof window>"u"?!0:"onscrollend"in window,es=(h,m)=>{const s=h.scrollElement;if(!s)return;const a=h.targetWindow;if(!a)return;let r=0;const l=h.options.useScrollendEvent&&st?()=>{}:Kt(a,()=>{m(r,!1)},h.options.isScrollingResetDelay),c=N=>()=>{const{horizontal:d,isRtl:C}=h.options;r=d?s.scrollLeft*(C&&-1||1):s.scrollTop,l(),m(r,N)},o=c(!0),x=c(!1);s.addEventListener("scroll",o,tt);const w=h.options.useScrollendEvent&&st;return w&&s.addEventListener("scrollend",x,tt),()=>{s.removeEventListener("scroll",o),w&&s.removeEventListener("scrollend",x)}},ts=(h,m,s)=>{if(m!=null&&m.borderBoxSize){const a=m.borderBoxSize[0];if(a)return Math.round(a[s.options.horizontal?"inlineSize":"blockSize"])}return h[s.options.horizontal?"offsetWidth":"offsetHeight"]},ss=(h,{adjustments:m=0,behavior:s},a)=>{var r,l;const c=h+m;(l=(r=a.scrollElement)==null?void 0:r.scrollTo)==null||l.call(r,{[a.options.horizontal?"left":"top"]:c,behavior:s})};class as{constructor(m){this.unsubs=[],this.scrollElement=null,this.targetWindow=null,this.isScrolling=!1,this.scrollState=null,this.measurementsCache=[],this.itemSizeCache=new Map,this.laneAssignments=new Map,this.pendingMeasuredCacheIndexes=[],this.prevLanes=void 0,this.lanesChangedFlag=!1,this.lanesSettling=!1,this.scrollRect=null,this.scrollOffset=null,this.scrollDirection=null,this.scrollAdjustments=0,this.elementsCache=new Map,this.now=()=>{var s,a,r;return((r=(a=(s=this.targetWindow)==null?void 0:s.performance)==null?void 0:a.now)==null?void 0:r.call(a))??Date.now()},this.observer=(()=>{let s=null;const a=()=>s||(!this.targetWindow||!this.targetWindow.ResizeObserver?null:s=new this.targetWindow.ResizeObserver(r=>{r.forEach(l=>{const c=()=>{const o=l.target,x=this.indexFromElement(o);if(!o.isConnected){this.observer.unobserve(o);return}this.shouldMeasureDuringScroll(x)&&this.resizeItem(x,this.options.measureElement(o,l,this))};this.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(c):c()})}));return{disconnect:()=>{var r;(r=a())==null||r.disconnect(),s=null},observe:r=>{var l;return(l=a())==null?void 0:l.observe(r,{box:"border-box"})},unobserve:r=>{var l;return(l=a())==null?void 0:l.unobserve(r)}}})(),this.range=null,this.setOptions=s=>{Object.entries(s).forEach(([a,r])=>{typeof r>"u"&&delete s[a]}),this.options={debug:!1,initialOffset:0,overscan:1,paddingStart:0,paddingEnd:0,scrollPaddingStart:0,scrollPaddingEnd:0,horizontal:!1,getItemKey:Xt,rangeExtractor:Zt,onChange:()=>{},measureElement:ts,initialRect:{width:0,height:0},scrollMargin:0,gap:0,indexAttribute:"data-index",initialMeasurementsCache:[],lanes:1,isScrollingResetDelay:150,enabled:!0,isRtl:!1,useScrollendEvent:!1,useAnimationFrameWithResizeObserver:!1,laneAssignmentMode:"estimate",...s}},this.notify=s=>{var a,r;(r=(a=this.options).onChange)==null||r.call(a,this,s)},this.maybeNotify=te(()=>(this.calculateRange(),[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]),s=>{this.notify(s)},{key:!1,debug:()=>this.options.debug,initialDeps:[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]}),this.cleanup=()=>{this.unsubs.filter(Boolean).forEach(s=>s()),this.unsubs=[],this.observer.disconnect(),this.rafId!=null&&this.targetWindow&&(this.targetWindow.cancelAnimationFrame(this.rafId),this.rafId=null),this.scrollState=null,this.scrollElement=null,this.targetWindow=null},this._didMount=()=>()=>{this.cleanup()},this._willUpdate=()=>{var s;const a=this.options.enabled?this.options.getScrollElement():null;if(this.scrollElement!==a){if(this.cleanup(),!a){this.maybeNotify();return}this.scrollElement=a,this.scrollElement&&"ownerDocument"in this.scrollElement?this.targetWindow=this.scrollElement.ownerDocument.defaultView:this.targetWindow=((s=this.scrollElement)==null?void 0:s.window)??null,this.elementsCache.forEach(r=>{this.observer.observe(r)}),this.unsubs.push(this.options.observeElementRect(this,r=>{this.scrollRect=r,this.maybeNotify()})),this.unsubs.push(this.options.observeElementOffset(this,(r,l)=>{this.scrollAdjustments=0,this.scrollDirection=l?this.getScrollOffset()<r?"forward":"backward":null,this.scrollOffset=r,this.isScrolling=l,this.scrollState&&this.scheduleScrollReconcile(),this.maybeNotify()})),this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})}},this.rafId=null,this.getSize=()=>this.options.enabled?(this.scrollRect=this.scrollRect??this.options.initialRect,this.scrollRect[this.options.horizontal?"width":"height"]):(this.scrollRect=null,0),this.getScrollOffset=()=>this.options.enabled?(this.scrollOffset=this.scrollOffset??(typeof this.options.initialOffset=="function"?this.options.initialOffset():this.options.initialOffset),this.scrollOffset):(this.scrollOffset=null,0),this.getFurthestMeasurement=(s,a)=>{const r=new Map,l=new Map;for(let c=a-1;c>=0;c--){const o=s[c];if(r.has(o.lane))continue;const x=l.get(o.lane);if(x==null||o.end>x.end?l.set(o.lane,o):o.end<x.end&&r.set(o.lane,!0),r.size===this.options.lanes)break}return l.size===this.options.lanes?Array.from(l.values()).sort((c,o)=>c.end===o.end?c.index-o.index:c.end-o.end)[0]:void 0},this.getMeasurementOptions=te(()=>[this.options.count,this.options.paddingStart,this.options.scrollMargin,this.options.getItemKey,this.options.enabled,this.options.lanes,this.options.laneAssignmentMode],(s,a,r,l,c,o,x)=>(this.prevLanes!==void 0&&this.prevLanes!==o&&(this.lanesChangedFlag=!0),this.prevLanes=o,this.pendingMeasuredCacheIndexes=[],{count:s,paddingStart:a,scrollMargin:r,getItemKey:l,enabled:c,lanes:o,laneAssignmentMode:x}),{key:!1}),this.getMeasurements=te(()=>[this.getMeasurementOptions(),this.itemSizeCache],({count:s,paddingStart:a,scrollMargin:r,getItemKey:l,enabled:c,lanes:o,laneAssignmentMode:x},w)=>{if(!c)return this.measurementsCache=[],this.itemSizeCache.clear(),this.laneAssignments.clear(),[];if(this.laneAssignments.size>s)for(const f of this.laneAssignments.keys())f>=s&&this.laneAssignments.delete(f);this.lanesChangedFlag&&(this.lanesChangedFlag=!1,this.lanesSettling=!0,this.measurementsCache=[],this.itemSizeCache.clear(),this.laneAssignments.clear(),this.pendingMeasuredCacheIndexes=[]),this.measurementsCache.length===0&&!this.lanesSettling&&(this.measurementsCache=this.options.initialMeasurementsCache,this.measurementsCache.forEach(f=>{this.itemSizeCache.set(f.key,f.size)}));const N=this.lanesSettling?0:this.pendingMeasuredCacheIndexes.length>0?Math.min(...this.pendingMeasuredCacheIndexes):0;this.pendingMeasuredCacheIndexes=[],this.lanesSettling&&this.measurementsCache.length===s&&(this.lanesSettling=!1);const d=this.measurementsCache.slice(0,N),C=new Array(o).fill(void 0);for(let f=0;f<N;f++){const z=d[f];z&&(C[z.lane]=f)}for(let f=N;f<s;f++){const z=l(f),D=this.laneAssignments.get(f);let M,$;const _=x==="estimate"||w.has(z);if(D!==void 0&&this.options.lanes>1){M=D;const R=C[M],ae=R!==void 0?d[R]:void 0;$=ae?ae.end+this.options.gap:a+r}else{const R=this.options.lanes===1?d[f-1]:this.getFurthestMeasurement(d,f);$=R?R.end+this.options.gap:a+r,M=R?R.lane:f%this.options.lanes,this.options.lanes>1&&_&&this.laneAssignments.set(f,M)}const W=w.get(z),P=typeof W=="number"?W:this.options.estimateSize(f),X=$+P;d[f]={index:f,start:$,size:P,end:X,key:z,lane:M},C[M]=f}return this.measurementsCache=d,d},{key:!1,debug:()=>this.options.debug}),this.calculateRange=te(()=>[this.getMeasurements(),this.getSize(),this.getScrollOffset(),this.options.lanes],(s,a,r,l)=>this.range=s.length>0&&a>0?rs({measurements:s,outerSize:a,scrollOffset:r,lanes:l}):null,{key:!1,debug:()=>this.options.debug}),this.getVirtualIndexes=te(()=>{let s=null,a=null;const r=this.calculateRange();return r&&(s=r.startIndex,a=r.endIndex),this.maybeNotify.updateDeps([this.isScrolling,s,a]),[this.options.rangeExtractor,this.options.overscan,this.options.count,s,a]},(s,a,r,l,c)=>l===null||c===null?[]:s({startIndex:l,endIndex:c,overscan:a,count:r}),{key:!1,debug:()=>this.options.debug}),this.indexFromElement=s=>{const a=this.options.indexAttribute,r=s.getAttribute(a);return r?parseInt(r,10):(console.warn(`Missing attribute name '${a}={index}' on measured element.`),-1)},this.shouldMeasureDuringScroll=s=>{var a;if(!this.scrollState||this.scrollState.behavior!=="smooth")return!0;const r=this.scrollState.index??((a=this.getVirtualItemForOffset(this.scrollState.lastTargetOffset))==null?void 0:a.index);if(r!==void 0&&this.range){const l=Math.max(this.options.overscan,Math.ceil((this.range.endIndex-this.range.startIndex)/2)),c=Math.max(0,r-l),o=Math.min(this.options.count-1,r+l);return s>=c&&s<=o}return!0},this.measureElement=s=>{if(!s){this.elementsCache.forEach((c,o)=>{c.isConnected||(this.observer.unobserve(c),this.elementsCache.delete(o))});return}const a=this.indexFromElement(s),r=this.options.getItemKey(a),l=this.elementsCache.get(r);l!==s&&(l&&this.observer.unobserve(l),this.observer.observe(s),this.elementsCache.set(r,s)),(!this.isScrolling||this.scrollState)&&this.shouldMeasureDuringScroll(a)&&this.resizeItem(a,this.options.measureElement(s,void 0,this))},this.resizeItem=(s,a)=>{var r;const l=this.measurementsCache[s];if(!l)return;const c=this.itemSizeCache.get(l.key)??l.size,o=a-c;o!==0&&(((r=this.scrollState)==null?void 0:r.behavior)!=="smooth"&&(this.shouldAdjustScrollPositionOnItemSizeChange!==void 0?this.shouldAdjustScrollPositionOnItemSizeChange(l,o,this):l.start<this.getScrollOffset()+this.scrollAdjustments)&&this._scrollToOffset(this.getScrollOffset(),{adjustments:this.scrollAdjustments+=o,behavior:void 0}),this.pendingMeasuredCacheIndexes.push(l.index),this.itemSizeCache=new Map(this.itemSizeCache.set(l.key,a)),this.notify(!1))},this.getVirtualItems=te(()=>[this.getVirtualIndexes(),this.getMeasurements()],(s,a)=>{const r=[];for(let l=0,c=s.length;l<c;l++){const o=s[l],x=a[o];r.push(x)}return r},{key:!1,debug:()=>this.options.debug}),this.getVirtualItemForOffset=s=>{const a=this.getMeasurements();if(a.length!==0)return Je(a[rt(0,a.length-1,r=>Je(a[r]).start,s)])},this.getMaxScrollOffset=()=>{if(!this.scrollElement)return 0;if("scrollHeight"in this.scrollElement)return this.options.horizontal?this.scrollElement.scrollWidth-this.scrollElement.clientWidth:this.scrollElement.scrollHeight-this.scrollElement.clientHeight;{const s=this.scrollElement.document.documentElement;return this.options.horizontal?s.scrollWidth-this.scrollElement.innerWidth:s.scrollHeight-this.scrollElement.innerHeight}},this.getOffsetForAlignment=(s,a,r=0)=>{if(!this.scrollElement)return 0;const l=this.getSize(),c=this.getScrollOffset();a==="auto"&&(a=s>=c+l?"end":"start"),a==="center"?s+=(r-l)/2:a==="end"&&(s-=l);const o=this.getMaxScrollOffset();return Math.max(Math.min(o,s),0)},this.getOffsetForIndex=(s,a="auto")=>{s=Math.max(0,Math.min(s,this.options.count-1));const r=this.getSize(),l=this.getScrollOffset(),c=this.measurementsCache[s];if(!c)return;if(a==="auto")if(c.end>=l+r-this.options.scrollPaddingEnd)a="end";else if(c.start<=l+this.options.scrollPaddingStart)a="start";else return[l,a];if(a==="end"&&s===this.options.count-1)return[this.getMaxScrollOffset(),a];const o=a==="end"?c.end+this.options.scrollPaddingEnd:c.start-this.options.scrollPaddingStart;return[this.getOffsetForAlignment(o,a,c.size),a]},this.scrollToOffset=(s,{align:a="start",behavior:r="auto"}={})=>{const l=this.getOffsetForAlignment(s,a),c=this.now();this.scrollState={index:null,align:a,behavior:r,startedAt:c,lastTargetOffset:l,stableFrames:0},this._scrollToOffset(l,{adjustments:void 0,behavior:r}),this.scheduleScrollReconcile()},this.scrollToIndex=(s,{align:a="auto",behavior:r="auto"}={})=>{s=Math.max(0,Math.min(s,this.options.count-1));const l=this.getOffsetForIndex(s,a);if(!l)return;const[c,o]=l,x=this.now();this.scrollState={index:s,align:o,behavior:r,startedAt:x,lastTargetOffset:c,stableFrames:0},this._scrollToOffset(c,{adjustments:void 0,behavior:r}),this.scheduleScrollReconcile()},this.scrollBy=(s,{behavior:a="auto"}={})=>{const r=this.getScrollOffset()+s,l=this.now();this.scrollState={index:null,align:"start",behavior:a,startedAt:l,lastTargetOffset:r,stableFrames:0},this._scrollToOffset(r,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.getTotalSize=()=>{var s;const a=this.getMeasurements();let r;if(a.length===0)r=this.options.paddingStart;else if(this.options.lanes===1)r=((s=a[a.length-1])==null?void 0:s.end)??0;else{const l=Array(this.options.lanes).fill(null);let c=a.length-1;for(;c>=0&&l.some(o=>o===null);){const o=a[c];l[o.lane]===null&&(l[o.lane]=o.end),c--}r=Math.max(...l.filter(o=>o!==null))}return Math.max(r-this.options.scrollMargin+this.options.paddingEnd,0)},this._scrollToOffset=(s,{adjustments:a,behavior:r})=>{this.options.scrollToFn(s,{behavior:r,adjustments:a},this)},this.measure=()=>{this.itemSizeCache=new Map,this.laneAssignments=new Map,this.notify(!1)},this.setOptions(m)}scheduleScrollReconcile(){if(!this.targetWindow){this.scrollState=null;return}this.rafId==null&&(this.rafId=this.targetWindow.requestAnimationFrame(()=>{this.rafId=null,this.reconcileScroll()}))}reconcileScroll(){if(!this.scrollState||!this.scrollElement)return;if(this.now()-this.scrollState.startedAt>5e3){this.scrollState=null;return}const a=this.scrollState.index!=null?this.getOffsetForIndex(this.scrollState.index,this.scrollState.align):void 0,r=a?a[0]:this.scrollState.lastTargetOffset,l=1,c=r!==this.scrollState.lastTargetOffset;if(!c&&Yt(r,this.getScrollOffset())){if(this.scrollState.stableFrames++,this.scrollState.stableFrames>=l){this.scrollState=null;return}}else this.scrollState.stableFrames=0,c&&(this.scrollState.lastTargetOffset=r,this.scrollState.behavior="auto",this._scrollToOffset(r,{adjustments:void 0,behavior:"auto"}));this.scheduleScrollReconcile()}}const rt=(h,m,s,a)=>{for(;h<=m;){const r=(h+m)/2|0,l=s(r);if(l<a)h=r+1;else if(l>a)m=r-1;else return r}return h>0?h-1:0};function rs({measurements:h,outerSize:m,scrollOffset:s,lanes:a}){const r=h.length-1,l=x=>h[x].start;if(h.length<=a)return{startIndex:0,endIndex:r};let c=rt(0,r,l,s),o=c;if(a===1)for(;o<r&&h[o].end<s+m;)o++;else if(a>1){const x=Array(a).fill(0);for(;o<r&&x.some(N=>N<s+m);){const N=h[o];x[N.lane]=N.end,o++}const w=Array(a).fill(s+m);for(;c>=0&&w.some(N=>N>=s);){const N=h[c];w[N.lane]=N.start,c--}c=Math.max(0,c-c%a),o=Math.min(r,o+(a-1-o%a))}return{startIndex:c,endIndex:o}}const at=typeof document<"u"?y.useLayoutEffect:y.useEffect;function is({useFlushSync:h=!0,...m}){const s=y.useReducer(()=>({}),{})[1],a={...m,onChange:(l,c)=>{var o;h&&c?St.flushSync(s):s(),(o=m.onChange)==null||o.call(m,l,c)}},[r]=y.useState(()=>new as(a));return r.setOptions(a),at(()=>r._didMount(),[]),at(()=>r._willUpdate()),r}function ns(h){return is({observeElementRect:Jt,observeElementOffset:es,scrollToFn:ss,...h})}function ls(h,m,s=[]){const[a,r]=y.useState([]),[l,c]=y.useState(!0),[o,x]=y.useState(null),[w,N]=[!1,C=>C()],d=y.useRef(null);return y.useEffect(()=>{c(!0);let C=!0;return d.current=Ct(h,f=>{C&&N(()=>{const z=f.docs.map(m);r(z),c(!1)})},f=>{C&&(console.error("Firestore onSnapshot error:",f),x(f),c(!1))}),()=>{C=!1,d.current&&d.current()}},s),{data:a,loading:l,error:o}}const se={GHS01:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/GHS-pictogram-explos.svg/200px-GHS-pictogram-explos.svg.png",GHS02:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/GHS-pictogram-flamme.svg/200px-GHS-pictogram-flamme.svg.png",GHS03:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/GHS-pictogram-rondflam.svg/200px-GHS-pictogram-rondflam.svg.png",GHS04:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/GHS-pictogram-bottle.svg/200px-GHS-pictogram-bottle.svg.png",GHS05:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/GHS-pictogram-acid.svg/200px-GHS-pictogram-acid.svg.png",GHS06:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/GHS-pictogram-skull.svg/200px-GHS-pictogram-skull.svg.png",GHS07:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/GHS-pictogram-exclam.svg/200px-GHS-pictogram-exclam.svg.png",GHS08:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/GHS-pictogram-silhouette.svg/200px-GHS-pictogram-silhouette.svg.png",GHS09:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/GHS-pictogram-pollut.svg/200px-GHS-pictogram-pollut.svg.png"},xe={GHS01:"متفجرات",GHS02:"قابل للاشتعال",GHS03:"مؤكسد",GHS04:"غاز تحت الضغط",GHS05:"أكال / مسبب للتآكل",GHS06:"سمية حادة (قاتل)",GHS07:"تهيج / تحسس / خطر",GHS08:"خطر صحي جسيم",GHS09:"خطر بيئي"};function vs({isNested:h=!1}){var Ge,Pe,qe,Ue,We;const{schoolId:m}=zt(),[s]=Et(),[a,r]=y.useState([]),[l,c]=y.useState(!0),[o,x]=y.useState(""),[w,N]=y.useState(s.get("filter")==="low"),[d,C]=y.useState(null),[f,z]=y.useState(!1),[D,M]=y.useState(null),$=y.useRef(null),[_,W]=y.useState(!1),[P,X]=y.useState(!1),[R,ae]=y.useState(!1),[it,fe]=y.useState(!1),[Te,$e]=y.useState({current:0,total:0}),[H,re]=y.useState([]),[v,He]=y.useState(null),[nt,ie]=y.useState(!1),[O,lt]=y.useState(null),[ot,ke]=y.useState(!1),Se=t=>{if(!t)return"غير محدد";if(!t.includes("-"))return t;const[n,i,p]=t.split("-");return!n||!i||!p?t:`${p}/${i}/${n}`},[g,E]=y.useState({nameEn:"",nameAr:"",formula:"",casNumber:"",storageTemp:"",unit:"g",quantity:0,state:"solid",hazardClass:"safe",ghs:[],shelf:"",expiryDate:"",notes:""}),{data:B,loading:_e}=ls(At(U(m,"chemicals")),t=>({id:t.id,...t.data()}),[m]);y.useEffect(()=>{if(!_e){r(B),c(!1);const t=s.get("id");if(t){let n=t;t.startsWith("APP_ID_")&&(n=t.split("_").slice(2,-1).join("_")),x(n);const i=B.find(p=>p.id===t||p.id===n);i?C(i):B.length>0&&!d&&C(B[0])}else B.length>0&&!d&&C(B[0])}},[B,_e,s]);const ct=async t=>{t.preventDefault();try{if(D){const{id:n}=D;await Me(ee(U(m,"chemicals"),n),{...g,updatedAt:me()}),await we(m,je.UPDATE,Ne.CHEMICALS,`تعديل بيانات المادة: ${g.nameAr}`,n)}else{const n=await $t(U(m,"chemicals"),{...g,createdAt:me()});await we(m,je.CREATE,Ne.CHEMICALS,`إضافة مادة جديدة: ${g.nameAr}`,n.id)}z(!1),M(null),E({nameEn:"",nameAr:"",formula:"",casNumber:"",storageTemp:"",unit:"g",quantity:0,state:"solid",hazardClass:"safe",ghs:[],shelf:"",expiryDate:"",notes:""})}catch(n){ve(n,D?ue.UPDATE:ue.CREATE,"chemicals")}},dt=async()=>{const t=g.nameEn||g.nameAr;if(!t){alert("يرجى إدخال اسم المادة أولاً (بالعربية أو الإنجليزية)");return}X(!0);try{const n=await Oe(t);if(n){let i="";if(n.expiryYears>0){const p=new Date;p.setFullYear(p.getFullYear()+n.expiryYears),i=p.toISOString().split("T")[0]}E(p=>({...p,nameEn:n.nameEn||p.nameEn,nameAr:n.nameAr||p.nameAr,formula:n.formula||p.formula,casNumber:n.casNumber||p.casNumber,storageTemp:n.storageTemp||p.storageTemp,hazardClass:n.hazardClass||p.hazardClass,ghs:n.ghs||p.ghs,expiryDate:i||p.expiryDate,notes:n.notes||p.notes}))}else alert("لم نتمكن من الحصول على معلومات دقيقة لهذه المادة. يرجى إدخالها يدوياً.")}catch(n){console.error("Smart fill error:",n),alert("حدث خطأ أثناء محاولة الحصول على المعلومات الذكية.")}finally{X(!1)}},Re=async t=>{const n=t||d;if(n){X(!0);try{const i=await Oe(n.nameEn||n.nameAr);i?(He(i),t&&C(t),ie(!0)):alert("لم نتمكن من الحصول على اقتراحات تحديث لهذه المادة.")}catch(i){console.error("Smart update request error:",i),alert("حدث خطأ أثناء طلب التحديث الذكي.")}finally{X(!1)}}},ht=async()=>{if(!(!d||!v))try{let t=d.expiryDate;if(v.expiryYears>0){const n=new Date;n.setFullYear(n.getFullYear()+v.expiryYears),t=n.toISOString().split("T")[0]}await Me(ee(U(m,"chemicals"),d.id),{nameEn:v.nameEn,nameAr:v.nameAr,formula:v.formula,casNumber:v.casNumber,storageTemp:v.storageTemp,hazardClass:v.hazardClass,ghs:v.ghs,expiryDate:t,notes:v.notes,updatedAt:me()}),ie(!1),He(null),alert("تم تحديث معلومات المادة بنجاح!")}catch(t){ve(t,ue.UPDATE,`chemicals/${d.id}`)}},pt=async()=>{if(fe(!1),!await Ht()){alert("يرجى اختيار مفتاح API الخاص بك لاستخدام ميزة التحديث الذكي.");return}ae(!0),$e({current:0,total:a.length});let n=0,i=0;for(let p=0;p<a.length;p++){const u=a[p];$e({current:p+1,total:a.length});try{const b=await Oe(u.nameEn||u.nameAr);if(b){let T=u.expiryDate;if(b.expiryYears>0){const j=new Date;j.setFullYear(j.getFullYear()+b.expiryYears),T=j.toISOString().split("T")[0]}await Me(ee(U(m,"chemicals"),u.id),{nameEn:b.nameEn||u.nameEn,nameAr:b.nameAr||u.nameAr,formula:b.formula||u.formula,casNumber:b.casNumber||u.casNumber,storageTemp:b.storageTemp||u.storageTemp,hazardClass:b.hazardClass||u.hazardClass,ghs:b.ghs||u.ghs,expiryDate:T||u.expiryDate,notes:b.notes||u.notes,updatedAt:me()}),n++}else i++}catch(b){console.error(`Error updating chemical ${u.nameEn}:`,b),i++;const T=(b==null?void 0:b.message)||String(b);if(T.includes("quota")||T.includes("RESOURCE_EXHAUSTED")){alert("تم إيقاف التحديث التلقائي بسبب تجاوز حصة الاستخدام المسموح بها (Quota Exceeded). يرجى المحاولة لاحقاً أو التحقق من حساب Gemini API الخاص بك.");break}}await new Promise(b=>setTimeout(b,5e3))}ae(!1),alert(`اكتمل التحديث الذكي!
تم تحديث: ${n} مادة بنجاح
فشل: ${i} مادة`)},mt=async(t,n)=>{try{await _t(ee(U(m,"chemicals"),t)),await we(m,je.DELETE,Ne.CHEMICALS,`حذف المادة: ${n}`,t),(d==null?void 0:d.id)===t&&C(a.find(i=>i.id!==t)||null)}catch(i){ve(i,ue.DELETE,`chemicals/${t}`)}},ut=()=>{const t=window.open("","_blank");if(!t){alert("يرجى السماح بالنوافذ المنبثقة لطباعة القائمة");return}const n=Q.filter(S=>S.ghs&&S.ghs.length>0||S.hazardClass==="danger").length,p=new Date().toLocaleDateString("ar-DZ",{day:"2-digit",month:"2-digit",year:"numeric"}),u="بوحازم عبد المجيد - عين كرشة",b="أم البواقي",T="2025/2026",j=Q.map((S,ne)=>{const Z=S.ghs&&S.ghs.length>0||S.hazardClass==="danger",le=(S.ghs||[]).map(A=>`<div class="ghs-pic"><img src="${se[A]}" alt="${A}" /></div>`).join("");return`
        <tr class="${Z?"hazardous-row":""}">
          <td class="text-center">${ne+1}</td>
          <td class="font-bold text-lg">${S.nameAr}</td>
          <td class="text-sm en-font">${S.nameEn}</td>
          <td class="mono-font">${S.formula||"—"}</td>
          <td class="text-center">${S.unit}</td>
          <td class="text-center font-bold">${S.quantity}</td>
          <td class="text-center">${S.state==="solid"?"صلب":S.state==="liquid"?"سائل":"غاز"}</td>
          <td class="text-center">${S.shelf||"—"}</td>
          <td><div class="ghs-container">${le}</div></td>
          <td class="notes-cell">${S.notes||"—"}</td>
        </tr>
      `}).join("");t.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>سجل المواد الكيميائية — ${u}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary: #006494;
              --on-primary: #ffffff;
              --primary-container: #cbe6ff;
              --secondary: #50606e;
              --surface: #fdfcff;
              --surface-variant: #dee3eb;
              --outline: #71787e;
              --error: #ba1a1a;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Cairo', sans-serif; 
              direction: rtl; 
              background: #f8f9fb; 
              color: #1a1c1e;
              padding: 20px;
            }

            #toolbar {
              position: fixed; top: 0; left: 0; right: 0; 
              z-index: 100; background: #1a1c1e; color: white;
              padding: 12px 24px; display: flex; align-items: center; gap: 15px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            #toolbar h3 { flex: 1; font-weight: 800; font-size: 16px; }
            .tb-btn { 
              padding: 10px 20px; border: none; border-radius: 20px; 
              cursor: pointer; font-weight: 700; font-size: 13px; font-family: Cairo;
              transition: all 0.2s;
            }
            .tb-print { background: #00b894; color: white; }
            .tb-close { background: #e74c3c; color: white; }

            .page-sheet {
              background: white;
              width: 297mm;
              min-height: 210mm;
              margin: 60px auto 20px;
              padding: 15mm;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              display: flex;
              flex-direction: column;
            }

            /* --- Header Layout --- */
            .official-header {
              display: grid;
              grid-template-columns: 1fr 2fr 1fr;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid var(--primary);
              align-items: start;
            }
            .oh-right { text-align: right; line-height: 1.6; font-size: 10pt; }
            .oh-center { text-align: center; line-height: 1.5; font-size: 11pt; font-weight: 800; }
            .oh-left { text-align: left; line-height: 1.6; font-size: 10pt; }
            .oh-center img { height: 50px; margin-bottom: 5px; }

            .main-title {
              text-align: center;
              font-size: 22pt;
              font-weight: 900;
              color: var(--primary);
              margin: 10px 0;
              letter-spacing: -0.5px;
              text-shadow: 1px 1px 0 rgba(0,0,0,0.05);
            }

            .registry-meta {
              display: flex;
              justify-content: center;
              gap: 30px;
              margin-bottom: 20px;
              padding: 10px;
              background: var(--primary-container);
              border-radius: 12px;
              font-weight: 700;
              color: var(--on-primary-container);
            }

            /* --- Table Design --- */
            .registry-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              font-size: 10pt;
              margin-bottom: 20px;
            }
            .registry-table th {
              background: #f0f4f8;
              color: var(--secondary);
              font-weight: 800;
              padding: 12px 8px;
              border: 1px solid #d1d5db;
              text-align: center;
              font-size: 9pt;
            }
            .registry-table td {
              padding: 10px 8px;
              border: 1px solid #e5e7eb;
              line-height: 1.4;
            }
            .registry-table tr:nth-child(even) { background: #fafbfc; }
            .hazardous-row { background-color: #fff1f2 !important; }
            .hazardous-row td:first-child { border-right: 4px solid var(--error); }

            .text-center { text-align: center; }
            .font-bold { font-weight: 800; }
            .mono-font { font-family: 'JetBrains Mono', monospace; font-size: 9pt; }
            .en-font { font-family: sans-serif; color: var(--secondary); }
            .notes-cell { font-size: 9pt; color: #444; font-style: italic; }

            .ghs-container { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; }
            .ghs-pic { 
              width: 32px; height: 32px; border: 1px solid #ddd; 
              border-radius: 4px; background: white; padding: 2px;
              display: flex; align-items: center; justify-content: center;
            }
            .ghs-pic img { width: 100%; height: 100%; object-fit: contain; }

            /* --- Footer --- */
            .registry-footer {
              margin-top: auto;
              padding-top: 30px;
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
            }
            .sign-box {
              text-align: center;
              border: 1px solid #eee;
              padding: 15px;
              border-radius: 12px;
              background: #fafafa;
            }
            .sign-box h4 { margin-bottom: 50px; font-weight: 800; text-decoration: underline; color: var(--secondary); }
            
            .inst-stamp {
              width: 40mm;
              height: 25mm;
              border: 2px dashed #ccc;
              border-radius: 12px;
              margin: 10px auto;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8pt;
              color: #999;
            }

            @media print {
              #toolbar { display: none !important; }
              body { background: white !important; padding: 0 !important; }
              .page-sheet { 
                margin: 0 !important; box-shadow: none !important; 
                width: 100% !important; padding: 10mm !important;
                border-radius: 0 !important;
              }
              @page { size: A4 landscape; margin: 0; }
              .registry-table th { background: #eee !important; -webkit-print-color-adjust: exact; }
              .hazardous-row { background-color: #fff1f1 !important; -webkit-print-color-adjust: exact; }
              .registry-meta { background: #eee !important; color: black !important; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div id="toolbar">
              <h3>📄 جرد المواد الكيميائية — سجل المخبر</h3>
              <button class="tb-btn tb-print" onclick="window.print()">🖨️ طباعة السجل</button>
              <button class="tb-btn tb-close" onclick="window.close()">✕ إغلاق</button>
          </div>

          <div class="page-sheet">
            <header class="official-header">
              <div class="oh-right">
                <div>وزارة التربية الوطنية</div>
                <div>مديرية التربية لولاية: ${b}</div>
                <div>المؤسسة: ${u}</div>
              </div>
              <div class="oh-center">
                <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
                <div class="main-title">سجل جرد المواد الكيميائية للمخبر</div>
              </div>
              <div class="oh-left">
                <div>السنة الدراسية: ${T}</div>
                <div>تاريخ الطباعة: ${p}</div>
                <div class="inst-stamp">ختم المؤسسة</div>
              </div>
            </header>

            <div class="registry-meta">
              <span>إجمالي المواد: ${Q.length}</span>
              <span style="border-right: 2px solid rgba(0,0,0,0.1); padding-right: 20px;">المواد الخطرة: ${n}</span>
            </div>

            <table class="registry-table">
              <thead>
                <tr>
                  <th width="40">رقم</th>
                  <th>الاسم العربي للمادة</th>
                  <th>Désignation (En)</th>
                  <th width="120">الصيغة</th>
                  <th width="60">الوحدة</th>
                  <th width="60">الكمية</th>
                  <th width="70">الحالة</th>
                  <th width="60">الرف</th>
                  <th width="100">GHS Pictograms</th>
                  <th>ملاحظات إضافية</th>
                </tr>
              </thead>
              <tbody>
                ${j}
              </tbody>
            </table>

            <footer class="registry-footer">
              <div class="sign-box"><h4>المخبري الرئيسي</h4></div>
              <div class="sign-box"><h4>المقتصد</h4></div>
              <div class="sign-box"><h4>مدير المؤسسة</h4></div>
              <div class="sign-box"><h4>مفتش التربية الوطنية</h4></div>
            </footer>
          </div>
        </body>
      </html>
    `),t.document.close()},xt=async()=>{const t=["#","الاسم العلمي","الاسم العربي","الصيغة","الكمية","الرف","تاريخ الصلاحية"],n=L.map((i,p)=>[p+1,i.nameEn||"",i.nameAr||"",i.formula||"",`${i.quantity} ${i.unit}`,i.shelf||"",Se(i.expiryDate)]);await Ft.generateTablePDF("تقرير جرد المواد الكيميائية",t,n,`chemicals_inventory_${new Date().toISOString().split("T")[0]}.pdf`)},ft=()=>{const t=K.json_to_sheet(L.map(i=>({"الاسم (EN)":i.nameEn,"الاسم (AR)":i.nameAr,الصيغة:i.formula,"رقم CAS":i.casNumber,الكمية:i.quantity,الوحدة:i.unit,الحالة:i.state,الخطورة:i.hazardClass,الرف:i.shelf,"تاريخ الصلاحية":i.expiryDate,ملاحظات:i.notes}))),n=K.book_new();K.book_append_sheet(n,t,"Inventory"),Qe(n,`chemical_inventory_${new Date().toISOString().split("T")[0]}.xlsx`)},gt=async t=>{var p;const n=(p=t.target.files)==null?void 0:p[0];if(!n)return;W(!0);const i=new FileReader;i.onload=async u=>{var b;try{const T=(b=u.target)==null?void 0:b.result,j=Rt(T,{type:"binary",cellDates:!0}),S=j.SheetNames[0],ne=j.Sheets[S],Z=K.sheet_to_json(ne),le=k=>{if(!k)return"";if(k instanceof Date)return k.toISOString().split("T")[0];const J=new Date(k);return isNaN(J.getTime())?String(k).trim():J.toISOString().split("T")[0]},A=(k,J)=>{const ze=Object.keys(k);for(const ce of J){const de=ze.find(q=>q.toLowerCase().trim()===ce.toLowerCase().trim());if(de)return k[de]}},oe=Ye(Ke);Z.forEach(k=>{const J=A(k,["PRODUIT CHIMIQUE","Name","nameEn","Product","Chemical"])||"Unnamed Chemical",ze=A(k,["الاسم العربي","الاسم","Arabic Name","nameAr","Arabic"])||"",ce=A(k,["الكمية","Quantity","quantity","Qty","Amount"]),de=typeof ce=="number"?ce:parseFloat(String(ce||"0").replace(/[^0-9.]/g,""));let q=String(A(k,["الحالة","State","state","Status"])||"solid").trim(),ge="solid";q==="صلب"||q.toLowerCase()==="solid"?ge="solid":q==="سائل"||q.toLowerCase()==="liquid"?ge="liquid":(q==="غاز"||q.toLowerCase()==="gas")&&(ge="gas");let be=String(A(k,["الخطورة","Hazard","hazardClass","Danger"])||"safe").trim(),Ee="safe";be==="خطر"||be.toLowerCase()==="danger"?Ee="danger":(be==="آمن"||be.toLowerCase()==="safe")&&(Ee="safe");const jt=ee(U(m,"chemicals"));oe.set(jt,{nameEn:String(J).trim(),nameAr:String(ze).trim(),formula:A(k,["الصيغة","Formula","formula"])||"",unit:A(k,["الوحدة","Unit","unit"])||"g",quantity:isNaN(de)?0:de,state:ge,hazardClass:Ee,ghs:Array.isArray(k.GHS)?k.GHS:k.GHS?String(k.GHS).split(",").map(Nt=>Nt.trim()):[],shelf:A(k,["الرف","Shelf","shelf"])||"",expiryDate:le(A(k,["الصلاحية","Expiry","تاريخ الانتهاء","expiryDate"])),notes:A(k,["ملاحظات","Notes","notes"])||"",createdAt:me()})}),await oe.commit(),alert(`تم استيراد ${Z.length} مادة بنجاح!`)}catch(T){console.error("Error importing XLS:",T),alert("حدث خطأ أثناء استيراد الملف. يرجى التأكد من صيغة الملف.")}finally{W(!1),$.current&&($.current.value="")}},i.readAsBinaryString(n)},Ce=t=>{const n=window.open("","_blank");if(!n){alert("يرجى السماح بالنوافذ المنبثقة لطباعة البطاقات");return}const i=new Date,p="2025/2026",u="بوحازم عبد المجيد - عين كرشة",b="أم البواقي",T=t.map((j,S)=>{var A,oe;const ne=j.state==="solid"?"صلب":j.state==="liquid"?"سائل":"غاز",Z=j.hazardClass==="danger"?(A=j.ghs)!=null&&A[0]?xe[j.ghs[0]]:"خطر":"آمن",le=(oe=j.ghs)!=null&&oe[0]?"☠️":"—";return`
        <div class="pcard">
          <div class="ph-container">
            <div class="ph">
              <div class="ph-r">مديرية التربية لولاية: ${b}<br>ثانوية: ${u}</div>
              <div class="ph-c">الجمهورية الجزائرية الديمقراطية الشعبية<br>وزارة التربية الوطنية</div>
              <div class="ph-l">
                <div>السنة الدراسية: ${p}</div>
                <div class="header-stamp">ختم المؤسسة</div>
              </div>
            </div>
          </div>

          <div class="pcard-badge">رقم البطاقة: ${S+1}</div>
          <h1 class="pcard-title">بطاقة مخزون مادة كيميائية</h1>
          
          <div class="ic-meta-expressive">
             <div class="ic-field main">
                <span class="l">اسم المادة (AR)</span>
                <span class="v">${j.nameAr}</span>
             </div>
             <div class="ic-field sub">
                <span class="l">NOM DU PRODUIT</span>
                <span class="v en">${j.nameEn}</span>
             </div>
          </div>

          <div class="ic-grid-info">
             <div class="ic-info-box">
                <span class="l">الصيغة</span>
                <span class="v en-bold">${j.formula||"—"}</span>
             </div>
             <div class="ic-info-box">
                <span class="l">الحالة</span>
                <span class="v">${ne}</span>
             </div>
             <div class="ic-info-box">
                <span class="l">الرف</span>
                <span class="v">${j.shelf||"—"}</span>
             </div>
             <div class="ic-info-box danger">
                <span class="l">GHS</span>
                <span class="v emoji">${le}</span>
             </div>
          </div>

          <div class="ic-safety-strip">
             <b>طبيعة الخطورة:</b> ${Z} 
             <span style="margin-right: 15px">|</span> 
             <b>وحدة القياس:</b> ${j.unit}
          </div>

          <div class="ic-table-container">
            <table class="ic-tbl">
              <thead>
                <tr>
                  <th rowspan="2" width="12%">التاريخ</th>
                  <th colspan="2">سند الطلب</th>
                  <th rowspan="2">المصدر</th>
                  <th rowspan="2" width="10%">الثمن</th>
                  <th colspan="3">الكمية</th>
                  <th rowspan="2">ملاحظات</th>
                </tr>
                <tr><th>خروج</th><th>دخول</th><th>خروج</th><th>دخول</th><th>المخزون</th></tr>
              </thead>
              <tbody>
                <tr class="initial-stock">
                  <td>${i.toLocaleDateString("en-GB")}</td>
                  <td>-</td><td>-</td>
                  <td>رصيد أول المدة</td>
                  <td>-</td>
                  <td>-</td><td>${j.quantity}</td><td>${j.quantity}</td>
                  <td>رصيد ابتدائي</td>
                </tr>
                ${Array(14).fill("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>").join("")}
                <tr class="carry-over">
                  <td colspan="5">الرصيد المنقول لظهر البطاقة</td>
                  <td></td><td></td><td class="bold">..........</td>
                  <td>ينقل ←</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pcard back">
          <div class="back-header">
             <span>تتمة حركة المخزون — ${j.nameAr}</span>
             <span class="ref">REF: ${S+1}</span>
          </div>

          <div class="ic-table-container">
            <table class="ic-tbl">
              <thead>
                <tr>
                  <th rowspan="2" width="12%">التاريخ</th>
                  <th colspan="2">سند الطلب</th>
                  <th rowspan="2">المصدر</th>
                  <th rowspan="2" width="10%">الثمن</th>
                  <th colspan="3">الكمية</th>
                  <th rowspan="2">ملاحظات</th>
                </tr>
                <tr><th>خروج</th><th>دخول</th><th>خروج</th><th>دخول</th><th>المخزون</th></tr>
              </thead>
              <tbody>
                <tr class="initial-stock">
                  <td colspan="5">المجموع المنقول من وجه البطاقة</td>
                  <td></td><td></td><td>..........</td>
                  <td>نقل ←</td>
                </tr>
                ${Array(22).fill("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>").join("")}
              </tbody>
            </table>
          </div>

          <div class="ic-safety-rules">
             <h3>⚠️ تعليمات السلامة الخاصة بالتخزين</h3>
             <div class="rules-box">
                ${j.notes||"يجب حفظ هذه المادة في ظروف ملائمة بعيداً عن الرطوبة والحرارة ووفق معايير السلامة المنصوص عليها في دليل المختبرات."}
             </div>
          </div>
        </div>
      `}).join("");n.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>بطاقة مخزون</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary: #006494;
              --on-primary: #ffffff;
              --primary-container: #cbe6ff;
              --on-primary-container: #001e30;
              --secondary: #50606e;
              --tertiary: #65587b;
              --error: #ba1a1a;
              --outline: #71787e;
              --surface: #fdfcff;
              --surface-variant: #dee3eb;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Cairo', sans-serif; 
              direction: rtl; 
              background: #f0f2f5; 
              color: #1a1c1e;
              padding: 20px;
            }

            #toolbar {
              position: fixed; top: 0; left: 0; right: 0; 
              z-index: 100; background: #1a1c1e; color: white;
              padding: 12px 24px; display: flex; align-items: center; gap: 15px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            #toolbar h3 { flex: 1; font-weight: 800; font-size: 16px; }
            .tb-btn { 
              padding: 10px 20px; border: none; border-radius: 20px; 
              cursor: pointer; font-weight: 700; font-size: 13px; font-family: Cairo;
              transition: all 0.2s;
            }
            .tb-print { background: #00b894; color: white; }
            .tb-close { background: #e74c3c; color: white; }

            #body { padding-top: 60px; max-width: 900px; margin: 0 auto; }

            .pcard {
              background: white;
              width: 148mm;
              height: 210mm;
              margin: 20px auto;
              padding: 8mm;
              border-radius: 24px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.08);
              display: flex;
              flex-direction: column;
              border: 1px solid rgba(0,0,0,0.05);
              position: relative;
              overflow: hidden;
            }

            .pcard.back { border-style: dashed; }

            .ph-container {
              background: var(--surface-variant);
              margin: -8mm -8mm 4mm -8mm;
              padding: 6mm 8mm;
              border-radius: 0 0 24px 24px;
            }
            .ph {
              display: grid; grid-template-columns: 1fr 1.5fr 1fr;
              font-size: 7.5pt; gap: 4px; align-items: start; color: var(--secondary);
            }
            .ph-r { text-align: right; line-height: 1.5; }
            .ph-c { text-align: center; font-weight: 800; line-height: 1.5; }
            .ph-l { text-align: left; line-height: 1.5; }

            .header-stamp {
              margin-top: 5px;
              width: 35mm;
              height: 20mm;
              border: 1px dashed var(--outline);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 6pt;
              color: var(--outline);
              font-weight: 400;
            }

            .pcard-badge {
              position: absolute; top: 12mm; left: 8mm;
              background: var(--primary-container); color: var(--on-primary-container);
              padding: 2px 12px; border-radius: 12px; font-size: 8pt; font-weight: 700;
            }

            .pcard-title {
              text-align: center; font-size: 14pt; font-weight: 900;
              color: var(--primary); margin: 4mm 0;
            }

            .ic-meta-expressive { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6mm; }
            .ic-field { border-radius: 12px; padding: 6px 12px; display: flex; align-items: center; justify-content: space-between; }
            .ic-field.main { background: #f0f4f9; border-right: 4px solid var(--primary); }
            .ic-field.sub { background: #fafbfc; border-right: 4px solid var(--outline); font-size: 9pt; }
            .ic-field .l { font-weight: 700; color: var(--secondary); font-size: 8.5pt; }
            .ic-field .v { font-weight: 800; font-size: 11pt; }
            .ic-field .v.en { font-family: sans-serif; font-size: 9pt; text-transform: uppercase; }

            .ic-grid-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 6mm; }
            .ic-info-box { background: #fff; border: 1px solid var(--surface-variant); border-radius: 12px; padding: 6px; text-align: center; }
            .ic-info-box .l { display: block; font-size: 7pt; font-weight: 700; color: var(--tertiary); margin-bottom: 2px; }
            .ic-info-box .v { font-weight: 800; font-size: 9.5pt; }
            .ic-info-box .v.en-bold { font-family: monospace; font-weight: 900; font-size: 10pt; }
            .ic-info-box.danger { border-color: var(--error); background: #fff8f8; }

            .ic-safety-strip { background: var(--on-primary-container); color: white; border-radius: 8px; padding: 5px 12px; font-size: 8.5pt; margin-bottom: 6mm; }

            .ic-table-container { flex: 1; margin-bottom: 4mm; }
            .ic-tbl { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
            .ic-tbl th, .ic-tbl td { border: 0.5pt solid var(--surface-variant); padding: 4px; text-align: center; }
            .ic-tbl th { background: #e8ecef; color: var(--secondary); font-weight: 800; font-size: 7pt; }
            .ic-tbl td { height: 6mm; }
            tr.initial-stock { background: #f0fdf4; font-weight: 600; }
            .bold { font-weight: 900; }

            .back-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 6mm; font-weight: 900; font-size: 11pt; color: var(--primary); }
            .rules-box { background: #fffafa; border: 1px solid #ffeded; padding: 10px; border-radius: 12px; font-size: 8.5pt; color: #444; line-height: 1.6; }

            @media print {
              #toolbar { display: none !important; }
              body { background: white !important; padding: 0 !important; }
              @page { size: A5 portrait; margin: 3mm; }
              .pcard {
                width: 100% !important; height: calc(210mm - 6mm) !important;
                margin: 0 !important; border: 1px solid #000 !important;
                border-radius: 0 !important; box-shadow: none !important;
                page-break-after: always !important; padding: 5mm !important;
              }
              .ph-container { border-radius: 0 !important; margin-bottom: 2mm !important; }
              .ic-meta-expressive .ic-field { background: white !important; border: 1px solid #eee !important; box-shadow: none !important; }
              .ic-tbl th { background: #f0f0f0 !important; border: 0.5pt solid #000 !important; print-color-adjust: exact; }
              .ic-tbl td { border: 0.5pt solid #000 !important; }
            }
          </style>
        </head>
        <body>
          <div id="toolbar">
              <h3>🎨 جرد كيميائي — ${t.length} عنصر</h3>
              <button class="tb-btn tb-print" onclick="window.print()">🖨️ بدء الطباعة</button>
              <button class="tb-btn tb-close" onclick="window.close()">✕ إغلاق المعاينة</button>
          </div>
          <div id="body">
            ${T}
          </div>
        </body>
      </html>
    `),n.document.close()},bt=t=>{const n=window.open("","_blank");n&&(n.document.write(`
      <html dir="rtl">
        <head>
          <title>بطاقة مادة - ${t.nameEn}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #2b3d22; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #2b3d22; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .label { font-weight: bold; color: #5c6146; }
            .hazard { color: #e11d48; font-weight: bold; }
            .footer { margin-top: 50px; text-align: left; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">بطاقة تعريف مادة كيميائية</div>
            <div>نظام تسيير المخابر المدرسية</div>
          </div>
          <div class="details">
            <div class="item"><span class="label">PRODUIT CHIMIQUE:</span> ${t.nameEn}</div>
            <div class="item"><span class="label">الاسم العربي:</span> ${t.nameAr}</div>
            <div class="item"><span class="label">الصيغة الكيميائية:</span> ${t.formula}</div>
            <div class="item"><span class="label">رقم CAS:</span> ${t.casNumber||"غير متوفر"}</div>
            <div class="item"><span class="label">درجة التخزين:</span> ${t.storageTemp||"غير متوفر"}</div>
            <div class="item"><span class="label">الحالة:</span> ${t.state}</div>
            <div class="item"><span class="label">الكمية الحالية:</span> ${t.quantity} ${t.unit}</div>
            <div class="item"><span class="label">الرف:</span> ${t.shelf}</div>
            <div class="item"><span class="label">الصلاحية:</span> ${t.expiryDate||"غير محدد"}</div>
            <div class="item" style="grid-column: span 2;">
              <span class="label">رموز السلامة GHS:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                ${(t.ghs||[]).map(i=>`
                  <div style="display: flex; flex-direction: column; align-items: center; border: 1px solid #ccc; padding: 5px; border-radius: 8px; width: 70px; background: #fff;">
                    <img src="${se[i]}" style="width: 40px; height: 40px;" />
                    <span style="font-size: 9px; margin-top: 4px; text-align: center; font-weight: bold;">${xe[i]||i}</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="item"><span class="label">تصنيف الخطورة:</span> <span class="${t.hazardClass==="danger"?"hazard":""}">${t.hazardClass==="danger"?"خطر":"آمن"}</span></div>
            <div class="item" style="grid-column: span 2;"><span class="label">ملاحظات:</span> ${t.notes||"لا توجد"}</div>
          </div>
          <div class="footer">طبع بتاريخ: ${new Date().toLocaleString("ar-DZ")}</div>
          <script>window.print();<\/script>
        </body>
      </html>
    `),n.document.close())},V=t=>{let n="asc";O&&O.key===t&&O.direction==="asc"&&(n="desc"),lt({key:t,direction:n})},yt=t=>{re(n=>n.includes(t)?n.filter(i=>i!==t):[...n,t])},vt=()=>{H.length===L.length?re([]):re(L.map(t=>t.id))},wt=async()=>{if(window.confirm(`هل أنت متأكد من حذف ${H.length} مادة؟`))try{const t=Ye(Ke);H.forEach(n=>{t.delete(ee(U(m,"chemicals"),n))}),await t.commit(),await we(m,je.DELETE,Ne.CHEMICALS,`حذف جماعي لـ ${H.length} مادة`),re([]),alert("تم الحذف بنجاح!")}catch(t){ve(t,ue.DELETE,"chemicals/bulk")}},L=a.filter(t=>{var p,u,b;const n=((p=t.nameEn)==null?void 0:p.toLowerCase().includes(o.toLowerCase()))||((u=t.nameAr)==null?void 0:u.toLowerCase().includes(o.toLowerCase()))||((b=t.formula)==null?void 0:b.toLowerCase().includes(o.toLowerCase())),i=!w||t.quantity<10;return n&&i}),Q=It.useMemo(()=>{const t=[...L];return O!==null&&t.sort((n,i)=>{const p=n[O.key],u=i[O.key];return p===void 0||u===void 0?0:p<u?O.direction==="asc"?-1:1:p>u?O.direction==="asc"?1:-1:0}),t},[L,O]),Y=t=>(O==null?void 0:O.key)===t?O.direction==="asc"?e.jsx(Bt,{size:14,className:"mr-1"}):e.jsx(Lt,{size:14,className:"mr-1"}):e.jsx("div",{className:"w-[14px] mr-1"}),Le=a.filter(t=>t.quantity<10).length,Fe=y.useRef(null),F=ns({count:Q.length,getScrollElement:()=>Fe.current,estimateSize:()=>72,overscan:10});return e.jsxs("div",{className:I("space-y-10 max-w-7xl mx-auto pb-20",!h&&"px-4"),children:[!h&&e.jsxs("header",{className:"flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4",children:[e.jsxs("div",{className:"text-right space-y-1",children:[e.jsx("h1",{className:"text-4xl font-black text-primary tracking-tighter",children:"المخزن الكيميائي"}),e.jsx("p",{className:"text-secondary/80 text-base font-medium",children:"إدارة وتتبع المحاليل والكواشف الكيميائية"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx("input",{type:"file",ref:$,onChange:gt,className:"hidden",accept:".xls,.xlsx"}),e.jsxs("button",{onClick:()=>ke(!0),className:"bg-surface text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(Be,{size:20}),"مسح QR"]}),e.jsxs("button",{onClick:ut,className:"bg-surface text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(ye,{size:20}),"طباعة القائمة"]}),e.jsxs("button",{onClick:()=>Ce(Q),className:"bg-surface text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(ye,{size:20,className:"text-primary"}),"طباعة بطاقات المخزون"]}),e.jsxs("button",{onClick:xt,className:"bg-surface text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(Ve,{size:20}),"تصدير PDF"]}),e.jsxs("button",{onClick:()=>{var t;return(t=$.current)==null?void 0:t.click()},disabled:_,className:"bg-surface text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm disabled:opacity-50",children:[_?e.jsx("div",{className:"w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"}):e.jsx(Dt,{size:20}),"استيراد XLS"]}),e.jsxs("button",{onClick:ft,className:"bg-surface text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(Xe,{size:20}),"تصدير الجرد"]}),e.jsxs("button",{onClick:()=>fe(!0),disabled:R||a.length===0,className:"bg-primary text-on-primary px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50",title:"تحديث ذكي لجميع المواد في القائمة",children:[R?e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"}),e.jsxs("span",{className:"text-xs",children:[Te.current,"/",Te.total]})]}):e.jsx(he,{size:20}),"تحديث ذكي للكل"]}),e.jsxs("button",{onClick:()=>z(!0),className:"bg-primary text-on-primary px-8 py-3.5 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95",children:[e.jsx(Pt,{size:20}),"إضافة مادة"]})]})]}),!h&&e.jsxs("section",{className:"grid grid-cols-1 md:grid-cols-4 gap-6",children:[e.jsxs("div",{className:"bg-surface-container-low p-7 rounded-[32px] border border-outline/5 hover:border-outline/20 transition-all group",children:[e.jsx("p",{className:"text-xs text-secondary/60 font-black uppercase tracking-widest mb-3",children:"إجمالي المواد"}),e.jsx("h3",{className:"text-4xl font-black text-primary group-hover:scale-110 transition-transform origin-right",children:a.length})]}),e.jsxs("div",{className:"bg-error-container/40 p-7 rounded-[32px] border border-error/10 hover:border-error/20 transition-all group",children:[e.jsx("p",{className:"text-xs text-on-error-container/60 font-black uppercase tracking-widest mb-3",children:"مواد خطرة"}),e.jsx("h3",{className:"text-4xl font-black text-error group-hover:scale-110 transition-transform origin-right",children:a.filter(t=>t.ghs&&t.ghs.length>0||t.hazardClass==="danger").length})]}),e.jsxs("div",{className:"bg-tertiary-fixed/40 p-7 rounded-[32px] border border-tertiary/10 hover:border-tertiary/20 transition-all group",children:[e.jsx("p",{className:"text-xs text-on-tertiary-fixed/60 font-black uppercase tracking-widest mb-3",children:"تنتهي قريباً"}),e.jsx("h3",{className:"text-4xl font-black text-tertiary group-hover:scale-110 transition-transform origin-right",children:a.filter(t=>{if(!t.expiryDate)return!1;const n=new Date(t.expiryDate),i=new Date;return i.setMonth(i.getMonth()+3),n<i&&n>new Date}).length.toString().padStart(2,"0")})]}),e.jsxs("div",{className:"bg-primary p-7 rounded-[32px] text-on-primary shadow-xl shadow-primary/20 hover:shadow-2xl transition-all group relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 right-0 w-24 h-24 bg-surface/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"}),e.jsxs("div",{className:"relative z-10",children:[e.jsx("p",{className:"text-white/60 text-xs font-black uppercase tracking-widest mb-3",children:"سعة التخزين"}),e.jsx("h3",{className:"text-4xl font-black",children:"68%"})]})]})]}),Le>0&&e.jsxs(G.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"bg-error-container/30 backdrop-blur-sm text-on-error-container p-5 rounded-[32px] flex items-center justify-between border border-error/10 shadow-lg shadow-error/5",children:[e.jsxs("div",{className:"flex items-center gap-4 text-error",children:[e.jsx("div",{className:"bg-error p-3 rounded-2xl text-white shadow-lg shadow-error/20",children:e.jsx(Mt,{size:20})}),e.jsxs("span",{className:"font-black text-base",children:["تنبيه: يوجد ",Le," مواد منخفضة المخزون!"]})]}),e.jsx("button",{onClick:()=>N(!w),className:"text-sm font-black underline underline-offset-4 text-error px-6 py-2.5 hover:bg-error/10 rounded-full transition-all active:scale-95",children:w?"عرض الكل":"عرض المواد المنخفضة"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-10",children:[e.jsx("div",{className:"lg:col-span-8 space-y-8",children:e.jsxs("div",{className:"bg-surface-container-lowest rounded-[32px] overflow-hidden border border-outline/10 shadow-sm",children:[e.jsxs("div",{className:"p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low/30 border-b border-outline/5",children:[e.jsxs("div",{className:"relative w-full md:w-80",children:[e.jsx(Ot,{className:"absolute right-4 top-1/2 -translate-y-1/2 text-outline/60",size:20}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-full pr-12 pl-6 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all",placeholder:"بحث عن مادة (اسم أو صيغة)...",value:o,onChange:t=>x(t.target.value)})]}),e.jsx("div",{className:"flex gap-3",children:e.jsx("button",{onClick:()=>N(!w),className:I("p-3 border rounded-full transition-all active:scale-90",w?"bg-primary text-on-primary border-primary shadow-lg shadow-primary/20":"bg-surface-container-low hover:bg-surface-container-high border-outline/10 text-secondary"),title:w?"عرض الكل":"تصفية المواد المنخفضة",children:e.jsx(qt,{size:22})})})]}),e.jsx("div",{ref:Fe,className:"overflow-auto scrollbar-hide relative max-h-[700px] w-full",children:e.jsxs("table",{className:"w-full text-right border-collapse table-auto relative",children:[e.jsx("thead",{className:"sticky top-0 z-20 bg-surface-container-lowest",children:e.jsxs("tr",{className:"bg-surface-container-low/50 text-secondary/60 text-[11px] font-black uppercase tracking-widest",children:[e.jsx("th",{className:"px-3 py-5 text-right w-12",children:e.jsx("div",{onClick:vt,className:I("w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all",H.length===L.length&&L.length>0?"bg-primary border-primary text-white":"border-outline/30 hover:border-primary/50"),children:H.length===L.length&&L.length>0&&e.jsx(Ae,{size:12})})}),e.jsx("th",{className:"px-3 py-5 text-right w-10",children:"#"}),e.jsx("th",{className:"px-3 py-5 text-right min-w-[140px] cursor-pointer hover:text-primary transition-colors",onClick:()=>V("nameEn"),children:e.jsxs("div",{className:"flex items-center",children:[Y("nameEn"),"المادة (EN/AR)"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-16 hidden sm:table-cell cursor-pointer hover:text-primary transition-colors",onClick:()=>V("formula"),children:e.jsxs("div",{className:"flex items-center",children:[Y("formula"),"الصيغة"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-20 cursor-pointer hover:text-primary transition-colors",onClick:()=>V("quantity"),children:e.jsxs("div",{className:"flex items-center",children:[Y("quantity"),"الكمية"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-14 hidden lg:table-cell cursor-pointer hover:text-primary transition-colors",onClick:()=>V("state"),children:e.jsxs("div",{className:"flex items-center",children:[Y("state"),"الحالة"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-18 cursor-pointer hover:text-primary transition-colors",onClick:()=>V("hazardClass"),children:e.jsxs("div",{className:"flex items-center",children:[Y("hazardClass"),"الخطورة"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-20 hidden xl:table-cell",children:"GHS"}),e.jsx("th",{className:"px-3 py-5 text-right w-14 hidden md:table-cell cursor-pointer hover:text-primary transition-colors",onClick:()=>V("shelf"),children:e.jsxs("div",{className:"flex items-center",children:[Y("shelf"),"الرف"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-24 cursor-pointer hover:text-primary transition-colors",onClick:()=>V("expiryDate"),children:e.jsxs("div",{className:"flex items-center",children:[Y("expiryDate"),"الصلاحية"]})}),e.jsx("th",{className:"px-3 py-5 text-right hidden 2xl:table-cell",children:"ملاحظات"}),e.jsx("th",{className:"px-3 py-5 text-center w-24",children:"إجراءات"})]})}),e.jsx("tbody",{className:"divide-y divide-outline/5 relative w-full",children:l?e.jsx("tr",{children:e.jsx("td",{colSpan:12,className:"px-8 py-20 text-center text-outline/60 font-bold",children:"جاري التحميل..."})}):Q.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:12,className:"px-8 py-20 text-center text-outline/60 font-bold",children:"لا توجد مواد مطابقة للبحث"})}):e.jsxs(e.Fragment,{children:[F.getVirtualItems().length>0&&F.getVirtualItems()[0].start>0&&e.jsx("tr",{children:e.jsx("td",{style:{padding:0,height:`${F.getVirtualItems()[0].start}px`},colSpan:12})}),F.getVirtualItems().map(t=>{var p;const n=t.index,i=Q[n];return e.jsxs("tr",{onClick:()=>C(i),ref:F.measureElement,"data-index":n,className:I("hover:bg-surface-container-low/40 transition-all group cursor-pointer text-base",(d==null?void 0:d.id)===i.id&&"bg-surface-container-low/60 border-r-4 border-primary"),children:[e.jsx("td",{className:"px-3 py-4",children:e.jsx("div",{onClick:u=>{u.stopPropagation(),yt(i.id)},className:I("w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all",H.includes(i.id)?"bg-primary border-primary text-white scale-110":"border-outline/30 group-hover:border-primary/50"),children:H.includes(i.id)&&e.jsx(Ae,{size:12})})}),e.jsx("td",{className:"px-3 py-4 font-bold text-secondary/60",children:n+1}),e.jsx("td",{className:"px-3 py-4",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-black text-primary break-words leading-tight",children:i.nameEn}),e.jsx("span",{className:"text-xs text-secondary/60 break-words mt-0.5",children:i.nameAr})]})}),e.jsx("td",{className:"px-3 py-4 font-mono font-bold text-secondary/80 hidden sm:table-cell text-xs",children:i.formula}),e.jsxs("td",{className:"px-3 py-4 font-black text-primary whitespace-nowrap",children:[i.quantity," ",e.jsx("span",{className:"text-[10px] text-secondary/60",children:i.unit})]}),e.jsx("td",{className:"px-3 py-4 font-bold text-secondary/80 hidden lg:table-cell text-xs",children:i.state==="solid"?"صلب":i.state==="liquid"?"سائل":"غاز"}),e.jsx("td",{className:"px-3 py-4",children:e.jsx("span",{className:I("px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm",i.hazardClass==="danger"?"bg-error-container text-on-error-container":"bg-primary-fixed/40 text-primary"),children:i.hazardClass==="danger"?"خطر":"آمن"})}),e.jsx("td",{className:"px-3 py-4 hidden xl:table-cell",children:e.jsxs("div",{className:"flex gap-1.5",children:[(p=i.ghs)==null?void 0:p.slice(0,3).map((u,b)=>e.jsxs("div",{className:"w-9 h-9 bg-surface rounded-lg flex items-center justify-center border border-outline/20 p-1 shadow-sm hover:scale-125 transition-transform z-10 relative group/ghs",title:xe[u]||u,children:[se[u]?e.jsx("img",{src:se[u],alt:u,className:"w-full h-full object-contain",referrerPolicy:"no-referrer"}):e.jsx("span",{className:"text-[8px] font-black",children:u}),e.jsx("div",{className:"absolute bottom-full mb-2 hidden group-hover/ghs:block bg-secondary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none shadow-xl",children:xe[u]||u})]},b)),i.ghs&&i.ghs.length>3&&e.jsxs("span",{className:"text-[10px] text-secondary/40 self-center font-bold",children:["+",i.ghs.length-3]})]})}),e.jsx("td",{className:"px-3 py-4 font-bold text-primary hidden md:table-cell text-xs",children:i.shelf}),e.jsx("td",{className:"px-3 py-4",children:e.jsxs("span",{className:I("font-bold whitespace-nowrap text-xs",i.expiryDate&&new Date(i.expiryDate)<new Date?"text-error flex items-center gap-1":"text-secondary/80"),children:[Se(i.expiryDate),i.expiryDate&&new Date(i.expiryDate)<new Date&&e.jsx(Ie,{size:14})]})}),e.jsx("td",{className:"px-3 py-4 text-xs text-secondary/60 hidden 2xl:table-cell min-w-[200px] leading-relaxed break-words",children:i.notes}),e.jsx("td",{className:"px-3 py-4 text-center",children:e.jsxs("div",{className:"flex gap-1 justify-center",children:[e.jsx("button",{onClick:u=>{u.stopPropagation(),Re(i)},disabled:P,className:"p-1.5 text-outline/40 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-90",title:"تحديث ذكي",children:e.jsx(he,{size:16})}),e.jsx("button",{onClick:u=>{u.stopPropagation(),M(i),E({nameEn:i.nameEn,nameAr:i.nameAr,formula:i.formula,casNumber:i.casNumber||"",storageTemp:i.storageTemp||"",unit:i.unit,quantity:i.quantity,state:i.state,hazardClass:i.hazardClass,ghs:i.ghs,shelf:i.shelf,expiryDate:i.expiryDate,notes:i.notes}),z(!0)},className:"p-1.5 text-outline/40 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-90",title:"تعديل",children:e.jsx(Ut,{size:16})}),e.jsx("button",{onClick:u=>{u.stopPropagation(),mt(i.id,i.nameAr)},className:"p-1.5 text-outline/40 hover:text-error hover:bg-error/10 transition-all rounded-full active:scale-90",title:"حذف",children:e.jsx(Ze,{size:16})})]})})]},i.id)}),F.getVirtualItems().length>0&&F.getTotalSize()-(((Pe=(Ge=F.getVirtualItems())==null?void 0:Ge.at(-1))==null?void 0:Pe.end)||0)>0&&e.jsx("tr",{children:e.jsx("td",{style:{padding:0,height:`${F.getTotalSize()-(((Ue=(qe=F.getVirtualItems())==null?void 0:qe.at(-1))==null?void 0:Ue.end)||0)}px`},colSpan:12})})]})})]})})]})}),e.jsxs("div",{className:"lg:col-span-4 space-y-8",children:[d?e.jsxs(G.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},className:"bg-surface-container-lowest rounded-[32px] p-10 relative overflow-hidden border border-outline/10 shadow-sm",children:[e.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[120px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"}),e.jsxs("div",{className:"relative z-10 space-y-8",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx("span",{className:I("text-[11px] px-4 py-1.5 rounded-[28px_28px_4px_28px] font-black uppercase tracking-widest shadow-sm",d.hazardClass==="danger"?"bg-error-container text-on-error-container":"bg-tertiary-fixed/60 text-tertiary"),children:d.hazardClass==="danger"?"مادة خطرة":"مادة آمنة"}),d.hazardClass==="danger"&&e.jsx("div",{className:"flex gap-2 text-error animate-pulse",children:e.jsx(Ie,{size:28})})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-black text-primary mb-1 tracking-tight",children:d.nameEn}),e.jsx("h3",{className:"text-xl font-bold text-secondary mb-2 tracking-tight",children:d.nameAr}),e.jsx("p",{className:"text-lg font-mono font-bold text-secondary/60",children:d.formula})]}),e.jsxs("div",{className:"space-y-5 pt-8 border-t border-outline/5",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"رقم CAS"}),e.jsx("span",{className:"font-black text-primary text-lg",children:d.casNumber||"غير متوفر"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"درجة التخزين"}),e.jsx("span",{className:"font-black text-primary text-lg",children:d.storageTemp||"غير متوفر"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"الحالة"}),e.jsx("span",{className:"font-black text-primary text-lg",children:d.state==="solid"?"صلب":d.state==="liquid"?"سائل":"غاز"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"الرف"}),e.jsx("span",{className:"font-black text-primary text-lg",children:d.shelf})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"الصلاحية"}),e.jsx("span",{className:I("font-black text-lg",d.expiryDate&&new Date(d.expiryDate)<new Date?"text-error":"text-primary"),children:Se(d.expiryDate)})]}),e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"ملاحظات"}),e.jsx("span",{className:"font-black text-primary text-sm text-left flex-1 mr-4 leading-relaxed break-words",children:d.notes||"لا توجد"})]}),d.ghs&&d.ghs.length>0&&e.jsxs("div",{className:"pt-6 border-t border-outline/5",children:[e.jsx("span",{className:"text-[11px] font-black text-secondary/40 uppercase tracking-[0.2em] block mb-4",children:"رموز السلامة GHS"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:d.ghs.map((t,n)=>e.jsxs("div",{className:"bg-surface p-3 rounded-2xl border border-outline/10 shadow-md hover:shadow-lg hover:border-primary/30 transition-all flex flex-col items-center gap-2 group/card",children:[e.jsx("div",{className:"w-16 h-16 flex items-center justify-center group-hover/card:scale-110 transition-transform",children:se[t]?e.jsx("img",{src:se[t],alt:t,className:"w-full h-full object-contain",referrerPolicy:"no-referrer"}):e.jsx("div",{className:"w-full h-full flex items-center justify-center text-xs font-black bg-surface-container-high rounded-xl",children:t})}),e.jsx("span",{className:"text-[10px] font-black text-secondary text-center leading-tight",children:xe[t]||t})]},n))})]}),e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex justify-between items-end",children:[e.jsx("span",{className:"text-sm font-black text-primary uppercase tracking-widest",children:"مستوى المخزون"}),e.jsxs("span",{className:"text-2xl font-black text-primary",children:[d.quantity," ",e.jsx("span",{className:"text-sm text-secondary/60",children:d.unit})]})]}),e.jsx("div",{className:"h-3 w-full bg-surface-container rounded-full overflow-hidden border border-outline/5 shadow-inner",children:e.jsx("div",{className:"h-full bg-primary rounded-full shadow-sm",style:{width:"70%"}})})]})]}),e.jsxs("div",{className:"flex gap-3 pt-4",children:[e.jsx("button",{onClick:()=>bt(d),className:"p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90",title:"طباعة تعريفية",children:e.jsx(ye,{size:22})}),e.jsx("button",{onClick:()=>Ce([d]),className:"p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90",title:"طباعة بطاقة المخزون",children:e.jsx(Ve,{size:22})}),e.jsx("button",{onClick:()=>Re(),disabled:P,className:"p-3 bg-primary-container hover:bg-primary/20 border border-primary/10 rounded-full text-primary transition-all active:scale-90 disabled:opacity-50",title:"تحديث ذكي للمعلومات",children:P?e.jsx("div",{className:"w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"}):e.jsx(he,{size:22})}),e.jsx("button",{className:"p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90",title:"توليد رمز QR",children:e.jsx(Be,{size:22})})]})]})]},d.id):e.jsx("div",{className:"bg-surface-container-lowest rounded-[32px] p-12 text-center text-outline/60 font-bold border border-outline/10 border-dashed",children:"اختر مادة من القائمة لعرض تفاصيلها المخبرية"}),e.jsxs("div",{className:"bg-primary-container/30 backdrop-blur-sm p-8 rounded-[32px] text-on-primary-container border border-primary/10 relative overflow-hidden group shadow-sm",children:[e.jsxs("div",{className:"relative z-10",children:[e.jsxs("h4",{className:"font-black text-lg mb-3 flex items-center gap-2 text-primary",children:[e.jsx(Tt,{size:20}),"تعليمات السلامة"]}),e.jsx("p",{className:"text-sm font-medium text-primary/80 leading-relaxed",children:(d==null?void 0:d.hazardClass)==="danger"?"يجب ارتداء القفازات والنظارات الواقية عند التعامل مع هذه المادة. يحفظ في مكان بارد وجيد التهوية بعيداً عن مصادر الحرارة.":"يرجى اتباع بروتوكولات المختبر القياسية عند التعامل مع هذه المادة لضمان سلامتك وسلامة الزملاء."})]}),e.jsx(Ie,{className:"absolute -bottom-6 -left-6 text-primary/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700"})]})]})]}),e.jsx(pe,{children:H.length>0&&e.jsxs(G.div,{initial:{y:100,opacity:0},animate:{y:0,opacity:1},exit:{y:100,opacity:0},className:"fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-secondary text-white px-8 py-5 rounded-[32px] shadow-2xl flex items-center gap-10 min-w-[500px]",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("span",{className:"text-sm font-black",children:[H.length," مادة مختارة"]}),e.jsx("span",{className:"text-[10px] text-white/60 font-bold",children:"يمكنك إجراء عمليات جماعية على هذه المواد"})]}),e.jsx("div",{className:"h-10 w-px bg-surface/10"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("button",{onClick:wt,className:"flex items-center gap-2 px-6 py-2.5 rounded-full bg-error/20 text-error-container hover:bg-error hover:text-white transition-all font-black text-sm",children:[e.jsx(Ze,{size:18}),"حذف المختار"]}),e.jsxs("button",{className:"flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface/10 hover:bg-surface/20 transition-all font-black text-sm",onClick:()=>{const t=a.filter(p=>H.includes(p.id)),n=K.json_to_sheet(t.map(p=>({Chemical:p.nameEn,Arabic:p.nameAr,Formula:p.formula,Qty:p.quantity,Unit:p.unit}))),i=K.book_new();K.book_append_sheet(i,n,"SelectedItems"),Qe(i,`selected_chemicals_${new Date().getTime()}.xlsx`)},children:[e.jsx(Xe,{size:18}),"تصدير المختار"]}),e.jsxs("button",{onClick:()=>{const t=a.filter(n=>H.includes(n.id));Ce(t)},className:"flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/20 text-primary-container hover:bg-primary hover:text-white transition-all font-black text-sm",children:[e.jsx(ye,{size:18}),"بطاقات المختار"]}),e.jsx("button",{onClick:()=>re([]),className:"p-2.5 hover:bg-surface/10 rounded-full transition-all",children:e.jsx(De,{size:20})})]})]})}),e.jsx(pe,{children:f&&e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx(G.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>z(!1),className:"absolute inset-0 bg-primary/20 backdrop-blur-xl"}),e.jsxs(G.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},className:"relative bg-surface w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-outline/10",children:[e.jsxs("div",{className:"p-8 flex justify-between items-center bg-surface-container-low border-b border-outline/5",children:[e.jsx("h3",{className:"text-2xl font-black text-primary",children:D?"تعديل بيانات المادة":"إضافة مادة كيميائية جديدة"}),e.jsx("button",{onClick:()=>{z(!1),M(null),E({nameEn:"",nameAr:"",formula:"",casNumber:"",storageTemp:"",unit:"g",quantity:0,state:"solid",hazardClass:"safe",ghs:[],shelf:"",expiryDate:"",notes:""})},className:"p-2.5 hover:bg-surface-container-high rounded-full transition-all active:scale-90",children:e.jsx(De,{size:24})})]}),e.jsxs("form",{onSubmit:ct,className:"p-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto no-scrollbar",children:[e.jsxs("div",{className:"md:col-span-2 flex items-end gap-4",children:[e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"PRODUIT CHIMIQUE"}),e.jsx("input",{required:!0,className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.nameEn||"",onChange:t=>E({...g,nameEn:t.target.value})})]}),e.jsxs("button",{type:"button",onClick:dt,disabled:P,className:"bg-primary-container text-primary px-6 py-4 rounded-2xl flex items-center gap-2 font-black hover:bg-primary/10 transition-all active:scale-95 disabled:opacity-50 h-[58px]",title:"تعبئة ذكية للمعلومات",children:[P?e.jsx("div",{className:"w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"}):e.jsx(Qt,{size:20}),e.jsx("span",{className:"hidden md:inline",children:"تعبئة ذكية"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الاسم العربي"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.nameAr||"",onChange:t=>E({...g,nameAr:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الصيغة الكيميائية"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.formula||"",onChange:t=>E({...g,formula:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"رقم CAS"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.casNumber||"",onChange:t=>E({...g,casNumber:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"درجة حرارة التخزين"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.storageTemp||"",onChange:t=>E({...g,storageTemp:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الحالة"}),e.jsxs("select",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer",value:g.state||"solid",onChange:t=>E({...g,state:t.target.value}),children:[e.jsx("option",{value:"solid",children:"صلب (Solid)"}),e.jsx("option",{value:"liquid",children:"سائل (Liquid)"}),e.jsx("option",{value:"gas",children:"غاز (Gas)"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الكمية"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("input",{type:"number",required:!0,className:"flex-1 bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.quantity||0,onChange:t=>E({...g,quantity:Number(t.target.value)})}),e.jsxs("select",{className:"bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer",value:g.unit||"g",onChange:t=>E({...g,unit:t.target.value}),children:[e.jsx("option",{value:"g",children:"g"}),e.jsx("option",{value:"kg",children:"kg"}),e.jsx("option",{value:"ml",children:"ml"}),e.jsx("option",{value:"L",children:"L"}),e.jsx("option",{value:"unit",children:"Unit"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"تصنيف الخطورة"}),e.jsxs("select",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer",value:g.hazardClass||"safe",onChange:t=>E({...g,hazardClass:t.target.value}),children:[e.jsx("option",{value:"safe",children:"آمن"}),e.jsx("option",{value:"danger",children:"خطر"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"GHS (فواصل بين الرموز)"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",placeholder:"GHS01, GHS02...",value:((We=g.ghs)==null?void 0:We.join(", "))||"",onChange:t=>E({...g,ghs:t.target.value.split(",").map(n=>n.trim()).filter(Boolean)})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الرف"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.shelf||"",onChange:t=>E({...g,shelf:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الصلاحية ⚠"}),e.jsx("input",{type:"date",className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:g.expiryDate||"",onChange:t=>E({...g,expiryDate:t.target.value})})]}),e.jsxs("div",{className:"md:col-span-2 space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"ملاحظات"}),e.jsx("textarea",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold min-h-[100px]",value:g.notes||"",onChange:t=>E({...g,notes:t.target.value})})]}),e.jsx("div",{className:"md:col-span-2 pt-6",children:e.jsx("button",{type:"submit",className:"w-full bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95",children:D?"حفظ التعديلات":"تأكيد إضافة المادة للمخزن"})})]})]})]})}),e.jsx(pe,{children:it&&e.jsxs("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-6",children:[e.jsx(G.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>fe(!1),className:"absolute inset-0 bg-black/60 backdrop-blur-sm"}),e.jsxs(G.div,{initial:{opacity:0,scale:.9,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.9,y:20},className:"relative bg-surface-container-lowest rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-outline/10 text-right",children:[e.jsx("div",{className:"w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8",children:e.jsx(he,{size:40,className:"text-primary"})}),e.jsx("h3",{className:"text-3xl font-black text-primary mb-4 tracking-tight",children:"تحديث ذكي شامل"}),e.jsxs("p",{className:"text-secondary/80 text-lg leading-relaxed mb-10",children:["هل أنت متأكد من رغبتك في تحديث معلومات ",e.jsx("span",{className:"font-black text-primary",children:a.length})," مادة ذكياً؟",e.jsx("br",{}),e.jsx("br",{}),"قد تستغرق هذه العملية بعض الوقت. سيتم تحديث البيانات تلقائياً بناءً على اقتراحات الذكاء الاصطناعي."]}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx("button",{onClick:pt,className:"flex-1 bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95",children:"بدء التحديث"}),e.jsx("button",{onClick:()=>fe(!1),className:"flex-1 bg-surface border border-outline/20 text-secondary py-5 rounded-full font-black hover:bg-surface-container-high transition-all active:scale-95",children:"إلغاء"})]})]})]})}),e.jsx(pe,{children:nt&&v&&d&&e.jsxs("div",{className:"fixed inset-0 z-[60] flex items-center justify-center p-4",children:[e.jsx(G.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>ie(!1),className:"absolute inset-0 bg-primary/20 backdrop-blur-xl"}),e.jsxs(G.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},className:"relative bg-surface w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-outline/10",children:[e.jsxs("div",{className:"p-8 flex justify-between items-center bg-surface-container-low border-b border-outline/5",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-primary/10 p-2.5 rounded-2xl text-primary",children:e.jsx(he,{size:24})}),e.jsx("h3",{className:"text-2xl font-black text-primary",children:"مراجعة التحديث الذكي"})]}),e.jsx("button",{onClick:()=>ie(!1),className:"p-2.5 hover:bg-surface-container-high rounded-full transition-all active:scale-90",children:e.jsx(De,{size:24})})]}),e.jsxs("div",{className:"p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar",children:[e.jsx("p",{className:"text-secondary/80 font-bold text-center bg-surface-container-low p-4 rounded-2xl border border-outline/5",children:"تم العثور على معلومات أكثر دقة لهذه المادة. يرجى مراجعة التغييرات المقترحة أدناه قبل الموافقة."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx("h4",{className:"text-sm font-black text-secondary/40 uppercase tracking-widest border-b border-outline/5 pb-2",children:"المعلومات الحالية"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"الاسم"}),e.jsxs("p",{className:"font-bold text-secondary",children:[d.nameEn," / ",d.nameAr]})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"الصيغة"}),e.jsx("p",{className:"font-mono font-bold text-secondary",children:d.formula})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"رقم CAS"}),e.jsx("p",{className:"font-bold text-secondary",children:d.casNumber||"غير متوفر"})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"درجة التخزين"}),e.jsx("p",{className:"font-bold text-secondary",children:d.storageTemp||"غير متوفر"})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"الخطورة"}),e.jsx("p",{className:"font-bold text-secondary",children:d.hazardClass==="danger"?"خطر":"آمن"})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"ملاحظات"}),e.jsx("p",{className:"text-xs text-secondary/60",children:d.notes||"لا توجد"})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsx("h4",{className:"text-sm font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2",children:"المعلومات المقترحة ✨"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:I("p-4 rounded-2xl border transition-all",v.nameEn!==d.nameEn||v.nameAr!==d.nameAr?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"الاسم"}),e.jsxs("p",{className:"font-bold text-primary",children:[v.nameEn," / ",v.nameAr]})]}),e.jsxs("div",{className:I("p-4 rounded-2xl border transition-all",v.formula!==d.formula?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"الصيغة"}),e.jsx("p",{className:"font-mono font-bold text-primary",children:v.formula})]}),e.jsxs("div",{className:I("p-4 rounded-2xl border transition-all",v.casNumber!==d.casNumber?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"رقم CAS"}),e.jsx("p",{className:"font-bold text-primary",children:v.casNumber})]}),e.jsxs("div",{className:I("p-4 rounded-2xl border transition-all",v.storageTemp!==d.storageTemp?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"درجة التخزين"}),e.jsx("p",{className:"font-bold text-primary",children:v.storageTemp})]}),e.jsxs("div",{className:I("p-4 rounded-2xl border transition-all",v.hazardClass!==d.hazardClass?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"الخطورة"}),e.jsx("p",{className:"font-bold text-primary",children:v.hazardClass==="danger"?"خطر":"آمن"})]}),e.jsxs("div",{className:I("p-4 rounded-2xl border transition-all",v.notes!==d.notes?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"ملاحظات"}),e.jsx("p",{className:"text-xs text-primary/80",children:v.notes})]})]})]})]})]}),e.jsxs("div",{className:"p-10 bg-surface-container-low border-t border-outline/5 flex gap-4",children:[e.jsxs("button",{onClick:ht,className:"flex-1 bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",children:[e.jsx(Ae,{size:24}),"موافقة وتحديث البيانات"]}),e.jsxs("button",{onClick:()=>ie(!1),className:"flex-1 bg-surface border border-outline/20 text-secondary py-5 rounded-full font-black hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-3",children:[e.jsx(Wt,{size:24}),"إلغاء التغييرات"]})]})]})]})}),e.jsx(pe,{children:ot&&e.jsx(Gt,{onClose:()=>ke(!1),onScan:t=>{ke(!1);let n=t;t.startsWith("APP_ID_")&&(n=t.split("_").slice(2,-1).join("_")),x(n);const i=a.find(p=>p.id===n||p.id===t);i?(C(i),M(i),z(!0)):alert("عذراً، لم يتم العثور على المادة بهذه الشيفرة.")}})})]})}export{vs as default};
