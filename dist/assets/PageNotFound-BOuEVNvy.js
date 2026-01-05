import{a5 as I,a6 as S,r as u,j as o,J as T,a7 as b,K as B,a8 as R,y as G,H as d,E as P,a9 as W,u as D,B as p,T as h,L as F,g as L,a4 as x}from"./index-C-7cmo3v.js";const H=R(),Y=I("div",{name:"MuiContainer",slot:"Root",overridesResolver:(t,n)=>{const{ownerState:e}=t;return[n.root,n[`maxWidth${b(String(e.maxWidth))}`],e.fixed&&n.fixed,e.disableGutters&&n.disableGutters]}}),A=t=>S({props:t,name:"MuiContainer",defaultTheme:H}),N=(t,n)=>{const e=s=>G(n,s),{classes:i,fixed:l,disableGutters:k,maxWidth:a}=t,r={root:["root",a&&`maxWidth${b(String(a))}`,l&&"fixed",k&&"disableGutters"]};return B(r,e,i)};function E(t={}){const{createStyledComponent:n=Y,useThemeProps:e=A,componentName:i="MuiContainer"}=t,l=n(({theme:a,ownerState:r})=>({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",...!r.disableGutters&&{paddingLeft:a.spacing(2),paddingRight:a.spacing(2),[a.breakpoints.up("sm")]:{paddingLeft:a.spacing(3),paddingRight:a.spacing(3)}}}),({theme:a,ownerState:r})=>r.fixed&&Object.keys(a.breakpoints.values).reduce((s,m)=>{const g=m,c=a.breakpoints.values[g];return c!==0&&(s[a.breakpoints.up(g)]={maxWidth:`${c}${a.breakpoints.unit}`}),s},{}),({theme:a,ownerState:r})=>({...r.maxWidth==="xs"&&{[a.breakpoints.up("xs")]:{maxWidth:Math.max(a.breakpoints.values.xs,444)}},...r.maxWidth&&r.maxWidth!=="xs"&&{[a.breakpoints.up(r.maxWidth)]:{maxWidth:`${a.breakpoints.values[r.maxWidth]}${a.breakpoints.unit}`}}}));return u.forwardRef(function(r,s){const m=e(r),{className:g,component:c="div",disableGutters:w=!1,fixed:j=!1,maxWidth:$="lg",classes:Z,...M}=m,v={...m,component:c,disableGutters:w,fixed:j,maxWidth:$},z=N(v,i);return o.jsx(l,{as:c,ownerState:v,className:T(z.root,g),ref:s,...M})})}const U=E({createStyledComponent:d("div",{name:"MuiContainer",slot:"Root",overridesResolver:(t,n)=>{const{ownerState:e}=t;return[n.root,n[`maxWidth${b(String(e.maxWidth))}`],e.fixed&&n.fixed,e.disableGutters&&n.disableGutters]}}),useThemeProps:t=>P({props:t,name:"MuiContainer"})});/**
 * @license @tabler/icons-react v3.31.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var J=W("outline","arrow-left","IconArrowLeft",[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M5 12l6 6",key:"svg-1"}],["path",{d:"M5 12l6 -6",key:"svg-2"}]]);/**
 * @license @tabler/icons-react v3.31.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var K=W("outline","home","IconHome",[["path",{d:"M5 12l-2 0l9 -9l9 9l-2 0",key:"svg-0"}],["path",{d:"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7",key:"svg-1"}],["path",{d:"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6",key:"svg-2"}]]);const O=x`
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
    }
    50% { 
      transform: translateY(-20px) rotate(180deg); 
    }
  `,X=x`
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  `,_=x`
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  `,y=x`
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  `;x`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;const q=d(p)(({theme:t})=>({background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",position:"relative",overflow:"hidden","&::before":{content:'""',position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(45deg, rgba(156, 39, 176, 0.3) 0%, rgba(63, 81, 181, 0.3) 100%)",zIndex:1}})),Q=d(p)(({size:t,top:n,left:e,delay:i})=>({position:"absolute",width:`${t}px`,height:`${t}px`,backgroundColor:"rgba(255, 255, 255, 0.6)",borderRadius:"50%",top:`${n}%`,left:`${e}%`,animation:`${O} ${3+Math.random()*2}s ease-in-out infinite`,animationDelay:`${i}s`,zIndex:1})),V=d(h)(({theme:t})=>({fontFamily:"monospace",fontWeight:"bold",background:"linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)",backgroundSize:"300% 300%",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",position:"relative",display:"inline-block",animation:`${_} 2s infinite`,textShadow:"0 0 30px rgba(255, 255, 255, 0.5)","&::before":{content:'"404"',position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"linear-gradient(45deg, #ff6b6b, #4ecdc4)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:`${y} 1.5s infinite`,transform:"translate(-2px, -2px)",zIndex:-1},"&::after":{content:'"404"',position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"linear-gradient(45deg, #45b7d1, #96ceb4)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:`${y} 1.5s infinite`,animationDelay:"0.1s",transform:"translate(2px, 2px)",zIndex:-2}})),f=d(p)(({delay:t=0})=>({animation:`${X} 0.8s ease-out forwards`,animationDelay:`${t}s`,opacity:0})),C=d(L)(({theme:t,variant:n})=>({borderRadius:"50px",padding:"12px 32px",fontSize:"1rem",fontWeight:600,textTransform:"none",position:"relative",overflow:"hidden",transition:"all 0.3s ease",...n==="primary"?{background:"linear-gradient(45deg, #667eea 0%, #764ba2 100%)",color:"white",border:"none",boxShadow:"0 4px 15px rgba(102, 126, 234, 0.4)","&:hover":{transform:"translateY(-2px)",boxShadow:"0 8px 25px rgba(102, 126, 234, 0.6)",background:"linear-gradient(45deg, #764ba2 0%, #667eea 100%)"}}:{background:"transparent",color:"white",border:"2px solid rgba(255, 255, 255, 0.8)","&:hover":{transform:"translateY(-2px)",backgroundColor:"rgba(255, 255, 255, 0.1)",borderColor:"white",boxShadow:"0 8px 25px rgba(255, 255, 255, 0.2)"}},"& .MuiButton-startIcon":{transition:"transform 0.3s ease"},"&:hover .MuiButton-startIcon":{transform:"translateX(-4px)"}})),et=()=>{D();const[t,n]=u.useState([]);return u.useEffect(()=>{const e=Array.from({length:15},(i,l)=>({id:l,size:Math.random()*4+2,top:Math.random()*100,left:Math.random()*100,delay:Math.random()*2}));n(e)},[]),o.jsxs(q,{children:[t.map(e=>o.jsx(Q,{size:e.size,top:e.top,left:e.left,delay:e.delay},e.id)),o.jsx(U,{maxWidth:"md",sx:{position:"relative",zIndex:2},children:o.jsxs(p,{sx:{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"},children:[o.jsx(f,{children:o.jsx(V,{variant:"h1",sx:{fontSize:{xs:"6rem",sm:"8rem",md:"10rem"},mb:2},children:"404"})}),o.jsx(f,{delay:.2,children:o.jsx(h,{variant:"h4",component:"h2",sx:{color:"white",mb:2,fontWeight:300,fontSize:{xs:"1.5rem",sm:"2rem",md:"2.5rem"},background:"linear-gradient(45deg, #ffffff 0%, #f0f0f0 100%)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Page Not Found"})}),o.jsx(f,{delay:.4,children:o.jsx(h,{variant:"h6",sx:{color:"rgba(255, 255, 255, 0.9)",mb:6,maxWidth:"600px",lineHeight:1.6,fontSize:{xs:"1rem",sm:"1.1rem",md:"1.25rem"},fontWeight:300},children:"The page you're looking for seems to have drifted into the digital void. Don't worry though, even the best explorers sometimes take a wrong turn."})}),o.jsx(f,{delay:.6,children:o.jsxs(p,{sx:{display:"flex",flexDirection:{xs:"column",sm:"row"},gap:2,mb:8,alignItems:"center"},children:[o.jsx(C,{variant:"primary",size:"large",startIcon:o.jsx(J,{size:20}),onClick:()=>window.history.back(),children:"Go Back"}),o.jsx(C,{variant:"secondary",size:"large",startIcon:o.jsx(K,{size:20}),component:F,to:"/dashboard",children:"Home"})]})})]})})]})};export{et as default};
