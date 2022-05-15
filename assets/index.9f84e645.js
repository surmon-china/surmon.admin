import{aL as U,bj as B,aM as D,aX as F,r as i,b2 as $,R as a,h as _,aU as V}from"./vendor.609c329c.js";import{U as u,s as J,m as K,t as P,a as G}from"./index.3c2c693f.js";import{U as He,g as Re,s as ze}from"./index.3c2c693f.js";import{W as A,a as X,e as H,K as q,b as R}from"./monaco-editor.d5927415.js";import{w as z,d as Q,j as w,ay as Y,aO as Z,P as p,_ as ee,aP as te,aQ as ae,h as ne,y as le}from"./antd.f5e34156.js";import"./basic.a369d14d.js";const v=U({fullscreen:!1});B(()=>v.fullscreen,e=>{e?document.body.classList.add("fullscreen"):document.body.classList.remove("fullscreen")});const se=e=>{v.fullscreen=e},oe={state:D(v),setFullscreen:se};self.MonacoEnvironment={getWorker(e,g){return g==="json"?new A:new X}};const re="_universalEditor_1eh0e_5",ie="_formStatus_1eh0e_5",ce="_fullScreen_1eh0e_13",de="_container_1eh0e_25",ue="_toolbar_1eh0e_28",me="_logo_1eh0e_37",fe="_language_1eh0e_40",ge="_editor_1eh0e_50",he="_placeholder_1eh0e_54",Ee="_preview_1eh0e_63",_e="_markdown_1eh0e_72";var o={universalEditor:re,formStatus:ie,fullScreen:ce,container:de,toolbar:ue,logo:me,language:fe,editor:ge,placeholder:he,preview:Ee,markdown:_e};const we=new Map([[u.Markdown,"md"],[u.JSON,"json"]]),ve=48,f=24,be=34,Se=40,Oe=e=>{var x;const g=e.placeholder||"\u8BF7\u8F93\u5165\u5185\u5BB9...",h=e.value||"",b=e.eid||window.location.pathname,c=F(()=>oe),E=i.exports.useRef(null),l=i.exports.useRef(),[m,I]=i.exports.useState(!1),[d,T]=i.exports.useState(e.defaultLanguage||u.Markdown),S=()=>{const t=P(Date.now()),n=we.get(d),s=`${b}-${t}.${n}`;G(h,s)},y=()=>{var s,r;const t=m?.5:1,n=(s=l.current)==null?void 0:s.getLayoutInfo();(r=l.current)==null||r.layout({width:c.state.fullscreen?window.innerWidth*t:E.current.clientWidth*t,height:n.height})},C=i.exports.useCallback(()=>{var s,r,M;if(!l.current)return!1;const t=l.current.getLayoutInfo();let n=0;if(c.state.fullscreen)n=window.innerHeight-ve;else{const L=((s=e.maxRows)!=null?s:Se)*f,O=((r=e.minRows)!=null?r:be)*f,k=l.current.getContentHeight(),j=(M=l.current.getModel())==null?void 0:M.getLineCount();if(k)if(k>L)n=L;else{const N=j*f;N<O?n=O:n=N}}t.height!==n&&l.current.layout({width:t.width,height:n})},[c.state.fullscreen,e.maxRows,e.minRows]),W=()=>{const t=H.create(E.current,{value:h,language:d,theme:"vs-dark",tabSize:2,fontSize:14,lineHeight:f,smoothScrolling:!0,readOnly:Boolean(e.disbaled),minimap:{enabled:!e.disabledMinimap},folding:!0,contextmenu:!1,roundedSelection:!1,scrollBeyondLastLine:!1,wordBasedSuggestions:!0,acceptSuggestionOnEnter:"on",scrollbar:{alwaysConsumeMouseWheel:!1}});return t.addCommand(q.CtrlCmd|R.KeyS,S),t.addCommand(R.Escape,()=>c.setFullscreen(!1)),t};return $(()=>c.state.fullscreen,()=>C()),i.exports.useEffect(()=>{y()},[y,m]),i.exports.useEffect(()=>{var n;const t=(n=l.current)==null?void 0:n.getModel();t&&d&&H.setModelLanguage(t,d)},[d]),i.exports.useEffect(()=>{var t;(t=l.current)==null||t.updateOptions({readOnly:e.disbaled})},[e.disbaled]),i.exports.useEffect(()=>{var t,n;e.value!==((t=l.current)==null?void 0:t.getValue())&&((n=l.current)==null||n.setValue(e.value||""))},[e.value]),i.exports.useEffect(()=>{l.current=W();const t=l.current.onDidContentSizeChange(C),n=l.current.onDidChangeModelContent(()=>{var r;const s=l.current.getValue();e.disabledCacheDraft||J(b,s),s!==e.value&&((r=e.onChange)==null||r.call(e,s))});return()=>{var s,r;t.dispose(),n.dispose(),(r=(s=l.current)==null?void 0:s.dispose)==null||r.call(s)}},[]),a.createElement("div",{style:e.style,className:_(o.universalEditor,e.formStatus&&o.formStatus,c.state.fullscreen&&o.fullScreen)},!e.disabledToolbar&&a.createElement("div",{className:o.toolbar},a.createElement(z,{className:o.left},a.createElement(Q.Text,{type:"secondary",strong:!0,className:o.logo},"UEditor"),a.createElement(w,{size:"small",disabled:e.disbaled,icon:a.createElement(Y,null),onClick:S})),a.createElement(z,{className:o.right},(x=e.renderToolbarExtra)==null?void 0:x.call(e,d),d===u.Markdown&&a.createElement(w,{size:"small",disabled:e.disbaled,icon:m?a.createElement(Z,null):a.createElement(p,null),onClick:()=>I(!m)}),a.createElement(ee,{size:"small",value:d,onChange:T,disabled:e.disbaled,className:o.language,options:[{label:"Markdown",value:u.Markdown},{label:"JSON",value:u.JSON}]}),a.createElement(w,{size:"small",disabled:e.disbaled,icon:c.state.fullscreen?a.createElement(te,null):a.createElement(ae,null),onClick:()=>c.setFullscreen(!c.state.fullscreen)}))),a.createElement(ne,{spinning:Boolean(e.loading),indicator:a.createElement(le,{style:{fontSize:24},spin:!0})},a.createElement("div",{className:o.container},a.createElement("div",{id:"container",ref:E,className:_(o.editor,!e.value&&o.placeholder),placeholder:g}),a.createElement(V,{in:m,timeout:200,unmountOnExit:!0,classNames:"fade-fast"},a.createElement("div",{className:_(o.preview)},a.createElement("div",{className:o.markdown,dangerouslySetInnerHTML:{__html:K(h)}}))))))};export{He as UEditorLanguage,Oe as UniversalEditor,Re as getUEditorCache,ze as setUEditorCache};
