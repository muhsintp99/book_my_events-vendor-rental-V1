import{r as i,i as j,j as e}from"./index-CudumdJl.js";const xe="AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78",E=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:5000":"https://api.bookmyevent.ae",fe=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dp-root {
    min-height: 100vh;
    background: #f7f8fc;
    font-family: 'DM Sans', sans-serif;
    padding: 36px 32px;
    position: relative;
  }

  .dp-card {
    max-width: 100%;
    width: 100%;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .dp-header { margin-bottom: 36px; }

  .dp-header-label {
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #E91E63;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .dp-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.15;
  }

  .dp-header-title span { color: #E91E63; }

  .dp-panel {
    background: #ffffff;
    border: 1px solid #eef0f6;
    border-radius: 18px;
    padding: 36px 40px;
    margin-bottom: 28px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    width: 100%;
  }

  .dp-section-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #aab0c4;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .dp-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 20px;
  }

  .dp-field label {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8890a4;
    font-weight: 600;
  }

  .dp-field input {
    background: #f7f8fc;
    border: 1.5px solid #eef0f6;
    border-radius: 10px;
    padding: 13px 16px;
    color: #1a1a2e;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .dp-field input:focus {
    border-color: #E91E63;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(233,30,99,0.08);
  }

  .dp-field input::placeholder { color: #c8ccda; }

  /* ── MAP ── */
  .dp-map-wrapper {
    border-radius: 14px;
    overflow: hidden;
    border: 1.5px solid #eef0f6;
    margin-bottom: 24px;
    background: #fff;
  }

  .dp-map-search-bar {
    padding: 16px 20px 14px;
    border-bottom: 1px solid #eef0f6;
    background: #fff;
  }

  .dp-map-search-label {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8890a4;
    font-weight: 600;
    display: block;
    margin-bottom: 8px;
  }

  .dp-map-search-bar input {
    width: 100%;
    background: #f7f8fc;
    border: 1.5px solid #eef0f6;
    border-radius: 10px;
    padding: 11px 16px;
    color: #1a1a2e;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .dp-map-search-bar input:focus {
    border-color: #E91E63;
    box-shadow: 0 0 0 3px rgba(233,30,99,0.08);
  }

  .dp-map-search-bar input::placeholder { color: #c8ccda; }

  .dp-map-area { position: relative; }

  .dp-map-canvas {
    width: 100%;
    height: 460px;
    display: block;
  }

  .dp-map-loading {
    width: 100%;
    height: 460px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    gap: 14px;
  }

  .dp-map-loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #eef0f6;
    border-top-color: #E91E63;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .dp-map-loading-text {
    font-size: 14px;
    font-weight: 600;
    color: #8890a4;
  }

  /* ── Radius section BELOW the map ── */
  .dp-radius-section {
    border-top: 1px solid #eef0f6;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%);
    padding: 16px 24px 18px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 16px;
  }

  .dp-radius-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .dp-slider-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #2563EB, #3b82f6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(37,99,235,0.3);
    flex-shrink: 0;
  }

  .dp-slider-icon svg {
    width: 18px;
    height: 18px;
    color: #fff;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .dp-radius-label {
    font-size: 13px;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
  }

  .dp-radius-sub {
    font-size: 11px;
    color: #aab0c4;
    margin-top: 2px;
  }

  .dp-radius-right { margin-left: auto; flex-shrink: 0; }

  .dp-slider-value-pill {
    background: linear-gradient(135deg, #2563EB, #3b82f6);
    color: #fff;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    box-shadow: 0 3px 10px rgba(37,99,235,0.35);
    white-space: nowrap;
  }

  .dp-radius-track-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .dp-slider-tick-min,
  .dp-slider-tick-max {
    font-size: 11px;
    font-weight: 700;
    color: #aab0c4;
    flex-shrink: 0;
    min-width: 36px;
  }

  .dp-slider-tick-max { text-align: right; }

  .dp-map-slider-input {
    -webkit-appearance: none;
    appearance: none;
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(to right, #2563EB var(--val, 0%), #e2e8f0 var(--val, 0%));
    outline: none;
    cursor: pointer;
  }

  .dp-map-slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fff;
    border: 2.5px solid #2563EB;
    box-shadow: 0 2px 10px rgba(37,99,235,0.35);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.1s;
  }

  .dp-map-slider-input::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 7px rgba(37,99,235,0.12), 0 2px 12px rgba(37,99,235,0.35);
    transform: scale(1.1);
  }

  .dp-map-slider-input:active::-webkit-slider-thumb {
    transform: scale(1.15);
  }

  .dp-pincode-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(37,99,235,0.08);
    color: #2563EB;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    border: 1px solid rgba(37,99,235,0.18);
  }

  /* Map info tip */
  .dp-map-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #8890a4;
    padding: 10px 20px;
    background: rgba(233,30,99,0.025);
    border-top: 1px solid #eef0f6;
  }

  .dp-map-tip svg { flex-shrink: 0; color: #E91E63; }

  /* Coordinates row */
  .dp-coords-row {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: 14px;
    padding: 18px 20px;
    background: #fafbff;
    border-top: 1px solid #eef0f6;
  }

  .dp-coord-field label {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8890a4;
    font-weight: 600;
    display: block;
    margin-bottom: 6px;
  }

  .dp-coord-field input {
    width: 100%;
    background: #ffffff;
    border: 1.5px solid #eef0f6;
    border-radius: 10px;
    padding: 10px 14px;
    color: #1a1a2e;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    outline: none;
  }

  .dp-coord-field input:disabled { opacity: 0.65; cursor: not-allowed; }

  .dp-coord-field input.editable:focus {
    border-color: #E91E63;
    box-shadow: 0 0 0 3px rgba(233,30,99,0.08);
  }

  /* ── Tag input for Zone/District ── */
  .dp-tag-input-box {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    background: #f7f8fc;
    border: 1.5px solid #eef0f6;
    border-radius: 10px;
    padding: 8px 12px;
    min-height: 46px;
    cursor: text;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .dp-tag-input-box:focus-within {
    border-color: #E91E63;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(233,30,99,0.08);
  }

  .dp-zone-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #fff;
    border: 1px solid #eef0f6;
    border-radius: 6px;
    padding: 3px 8px 3px 10px;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .dp-tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: #aab0c4;
    font-size: 16px;
    line-height: 1;
    padding: 0 1px;
    transition: color 0.15s;
  }

  .dp-tag-remove:hover { color: #E91E63; }

  .dp-tag-inner-input {
    border: none;
    outline: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a1a2e;
    flex: 1;
    min-width: 120px;
  }

  .dp-tag-inner-input::placeholder { color: #c8ccda; }

  /* ── Select button row under map ── */
  .dp-map-select-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #fafbff;
    border-top: 1px solid #eef0f6;
    gap: 12px;
  }

  .dp-map-tip-inline {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #8890a4;
  }

  .dp-map-tip-inline svg { color: #E91E63; flex-shrink: 0; }

  .dp-btn-select {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #1a1a2e;
    color: #fff;
    border: none;
    padding: 9px 22px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .dp-btn-select:hover {
    background: #E91E63;
    box-shadow: 0 4px 14px rgba(233,30,99,0.3);
    transform: translateY(-1px);
  }

  /* ── Shipping price + Save row ── */
  .dp-bottom-row {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    margin-top: 20px;
  }

  .dp-field-price { flex: 1; margin-bottom: 0; }

  .dp-bottom-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    padding-bottom: 1px;
  }

  /* ── Table search ── */
  .dp-table-search-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f7f8fc;
    border: 1.5px solid #eef0f6;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 20px;
    transition: border-color 0.2s;
  }

  .dp-table-search-wrap:focus-within {
    border-color: #E91E63;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(233,30,99,0.08);
  }

  .dp-table-search-wrap svg { color: #aab0c4; flex-shrink: 0; }

  .dp-table-search {
    border: none;
    outline: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a1a2e;
    width: 100%;
  }

  .dp-table-search::placeholder { color: #c8ccda; }

  /* ── Table columns ── */
  .dp-td-sl { color: #c0c6d4 !important; font-weight: 600 !important; font-size: 12px !important; }
  .dp-td-zone { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* ── Action buttons ── */
  .dp-action-btns { display: flex; gap: 6px; align-items: center; }

  .dp-action-edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1.5px solid #eef0f6;
    background: #f7f8fc;
    color: #8890a4;
    cursor: pointer;
    transition: all 0.18s;
  }

  .dp-action-edit:hover {
    border-color: #2563EB;
    background: rgba(37,99,235,0.06);
    color: #2563EB;
  }

  .dp-action-delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1.5px solid #eef0f6;
    background: #f7f8fc;
    color: #aab0c4;
    cursor: pointer;
    transition: all 0.18s;
  }

  .dp-action-delete:hover {
    border-color: #EF4444;
    background: rgba(239,68,68,0.06);
    color: #EF4444;
  }

  /* remove old dp-actions since replaced by dp-bottom-actions */
  .dp-actions { display: none; }

  .dp-btn-ghost {
    background: transparent;
    border: 1.5px solid #eef0f6;
    color: #aab0c4;
    padding: 12px 26px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dp-btn-ghost:hover {
    border-color: #d0d4e0;
    color: #666c80;
    background: #f7f8fc;
  }

  .dp-btn-save {
    background: #E91E63;
    border: none;
    color: #fff;
    padding: 12px 34px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(233,30,99,0.25);
  }

  .dp-btn-save:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(233,30,99,0.35);
    background: #d81558;
  }

  .dp-btn-save:active { transform: translateY(0); }

  /* Divider */
  .dp-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(233,30,99,0.15), transparent);
    margin: 0 0 28px 0;
  }

  /* Table */
  .dp-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .dp-table-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .dp-count-badge {
    background: rgba(233,30,99,0.08);
    border: 1px solid rgba(233,30,99,0.15);
    color: #E91E63;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .dp-table { width: 100%; border-collapse: collapse; }
  .dp-table thead tr { border-bottom: 2px solid #f0f2f8; }

  .dp-table thead th {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #aab0c4;
    font-weight: 600;
    padding: 0 0 14px 0;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }

  .dp-table tbody tr { border-bottom: 1px solid #f5f6fa; transition: background 0.15s; }
  .dp-table tbody tr:hover { background: #fdf5f8; }
  .dp-table tbody tr:last-child { border-bottom: none; }

  .dp-table tbody td {
    padding: 16px 0;
    font-size: 14px;
    color: #555c72;
    vertical-align: middle;
  }

  .dp-table tbody td:first-child { color: #c0c6d4; font-size: 12px; font-weight: 500; }

  .dp-mode-name { font-weight: 600; color: #1a1a2e; }

  .dp-distance-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f7f8fc;
    border: 1px solid #eef0f6;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    color: #8890a4;
  }

  .dp-coverage-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 12px;
    border: 1.5px solid #eef0f6;
    background: #f7f8fc;
    color: #8890a4;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dp-coverage-chip.active {
    border-color: #E91E63;
    background: rgba(233,30,99,0.04);
    color: #E91E63;
    box-shadow: 0 4px 12px rgba(233,30,99,0.1);
  }

  .dp-status-active {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: rgba(16,185,129,0.08);
    color: #059669;
    border: 1px solid rgba(16,185,129,0.18);
  }

  .dp-empty {
    text-align: center;
    padding: 40px 0;
    color: #c0c6d4;
    font-size: 14px;
    font-style: italic;
  }

  /* Toast */
  .dp-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: #E91E63;
    color: #fff;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 28px rgba(233,30,99,0.3);
    z-index: 100;
    animation: slideUp 0.3s ease, fadeOut 0.3s ease 2s forwards;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeOut {
    to { opacity: 0; transform: translateY(-8px); }
  }

  @media (max-width: 700px) {
    .dp-root { padding: 20px 16px; }
    .dp-panel { padding: 22px 20px; }
    .dp-header-title { font-size: 28px; }
    .dp-coords-row { grid-template-columns: 1fr 1fr; }
    .dp-coords-row .dp-coord-field:last-child { grid-column: 1 / -1; }
  }
`,me=()=>{const[N,S]=i.useState("Standard package delivery"),[J,Q]=i.useState(""),[z,v]=i.useState([]),[T,C]=i.useState(""),[f,M]=i.useState(26),[U,R]=i.useState(!1),[m,q]=i.useState(""),[X,I]=i.useState(""),[ge,_]=i.useState(!1),[L,ee]=i.useState("radius_based"),[y,O]=i.useState(null),[n,te]=i.useState(null),[ae,ie]=i.useState([]),[D,$]=i.useState(!1),[ue,F]=i.useState(!0),P=i.useRef(null),g=i.useRef(null),c=i.useRef(null),Z=i.useRef(null),[b,re]=i.useState(null),[k,A]=i.useState(!1),[d,w]=i.useState({latitude:"",longitude:"",address:""});i.useEffect(()=>{B(),se()},[]);const se=()=>{var r;if((r=window.google)!=null&&r.maps){A(!0);return}const t=document.getElementById("dp-gmaps-script");if(t){t.addEventListener("load",()=>A(!0));return}const a=document.createElement("script");a.id="dp-gmaps-script",a.src=`https://maps.googleapis.com/maps/api/js?key=${xe}&libraries=places`,a.async=!0,a.defer=!0,a.onload=()=>A(!0),document.head.appendChild(a)},B=async()=>{var t,a,r;try{const l=localStorage.getItem("user"),s=l?JSON.parse(l):null,o=(s==null?void 0:s._id)||(s==null?void 0:s.id);if(!o){F(!1);return}const u=localStorage.getItem("token"),x=(t=(await j.get(`${E}/api/vendorprofiles/find/${o}`,{headers:{Authorization:`Bearer ${u}`}})).data)==null?void 0:t.data;if(x){te(x);const ce=(((a=x.deliveryProfile)==null?void 0:a.deliveryConfigurations)||[]).map((p,h)=>{var V;return{id:h+1,mode:p.mode,distance:`${p.radius||0} km`,zone:((V=p.selectedPincodes)==null?void 0:V.length)>0?p.selectedPincodes.join(", "):"Registered Area",status:p.status?"Active":"Inactive",shippingPrice:p.shippingPrice,_originalIndex:h,_rawConfig:p}});if(ie(ce),x.latitude&&x.longitude){const p=((r=x.storeAddress)==null?void 0:r.fullAddress)||"";w(h=>({...h,latitude:x.latitude,longitude:x.longitude,address:p})),p&&v(h=>h.includes(p)?h:[...h,p])}}}catch(l){console.error("Error fetching profile:",l)}finally{F(!1)}};i.useEffect(()=>{const a=setTimeout(async()=>{var r,l;if(/^\d{6}$/.test(m))try{const o=(l=(r=(await j.get(`${E}/api/pincodes?search=${m}`)).data)==null?void 0:r.data)==null?void 0:l[0];if(o){const u=o.state||o.city||o.district_name||"";I(u)}}catch{}else I("")},400);return()=>clearTimeout(a)},[m]);const W=i.useCallback(()=>{if(!window.google||!P.current)return;const t=d.latitude&&d.longitude?{lat:parseFloat(d.latitude),lng:parseFloat(d.longitude)}:{lat:11.2588,lng:75.7804},a=new window.google.maps.Map(P.current,{zoom:11,center:t,mapTypeControl:!1,streetViewControl:!1,fullscreenControl:!1});a.addListener("click",r=>{const l=r.latLng.lat(),s=r.latLng.lng();w(o=>({...o,latitude:l.toString(),longitude:s.toString()})),g.current&&g.current.setMap(null),g.current=new window.google.maps.Marker({position:{lat:l,lng:s},map:a,animation:window.google.maps.Animation.DROP}),new window.google.maps.Geocoder().geocode({location:{lat:l,lng:s}},(o,u)=>{if(u==="OK"&&o[0]){const K=o[0].formatted_address;w(x=>({...x,address:K}))}})}),c.current=new window.google.maps.Circle({strokeColor:"#2563EB",strokeOpacity:.85,strokeWeight:2,fillColor:"#2563EB",fillOpacity:.13,map:a,center:t,radius:f*1e3}),re(a)},[d.latitude,d.longitude,f]);i.useEffect(()=>{k&&W()},[k,W]);const Y=t=>{if(!c.current||!t)return;const a=c.current.getBounds();a&&(t.fitBounds(a,{top:60,right:60,bottom:60,left:60}),window.google.maps.event.addListenerOnce(t,"idle",()=>{t.getZoom()<7&&t.setZoom(7)}))};i.useEffect(()=>{if(!b||!c.current||!d.latitude||!d.longitude)return;const t=parseFloat(d.latitude),a=parseFloat(d.longitude),r={lat:t,lng:a};c.current.setCenter(r),c.current.setRadius(f*1e3),g.current?g.current.setPosition(r):g.current=new window.google.maps.Marker({position:r,map:b,animation:window.google.maps.Animation.DROP}),Y(b)},[d.latitude,d.longitude,b]),i.useEffect(()=>{c.current&&(c.current.setRadius(f*1e3),b&&d.latitude&&d.longitude&&Y(b))},[f]);const oe=async()=>{var l;if(!N||!n)return;$(!0);const t={mode:N,coverageType:L,radius:L==="radius_based"?f:0,selectedPincodes:z,shippingPrice:parseFloat(T)||0,status:!0},a=((l=n.deliveryProfile)==null?void 0:l.deliveryConfigurations)||[];let r=[];y!==null?r=a.map((s,o)=>o===y?t:s):r=[...a,t];try{const s=localStorage.getItem("token");(await j.put(`${E}/api/vendorprofiles/${n._id}`,{deliveryProfile:{deliveryConfigurations:r}},{headers:{Authorization:`Bearer ${s}`}})).data.success&&(R(!0),setTimeout(()=>R(!1),2400),B(),G())}catch(s){console.error("Error saving profile:",s)}finally{$(!1)}},ne=async t=>{var s;if(!n)return;const a=t-1,l=(((s=n.deliveryProfile)==null?void 0:s.deliveryConfigurations)||[]).filter((o,u)=>u!==a);try{const o=localStorage.getItem("token");(await j.put(`${E}/api/vendorprofiles/${n._id}`,{deliveryProfile:{deliveryConfigurations:l}},{headers:{Authorization:`Bearer ${o}`}})).data.success&&B()}catch(o){console.error("Error deleting mode:",o)}},G=()=>{var a,r;O(null),S("Standard package delivery");const t=((a=n==null?void 0:n.storeAddress)==null?void 0:a.fullAddress)||"";v(t?[t]:[]),Q(""),C(""),M(26),_(!1),ee("radius_based"),w({latitude:(n==null?void 0:n.latitude)||"",longitude:(n==null?void 0:n.longitude)||"",address:((r=n==null?void 0:n.storeAddress)==null?void 0:r.fullAddress)||""}),g.current&&(g.current.setMap(null),g.current=null),c.current&&c.current.setRadius(26*1e3),Z.current&&(Z.current.value="")},de=t=>v(z.filter(a=>a!==t)),le=()=>{d.address&&_(!0)},H=ae.filter(t=>{const a=m.toLowerCase(),r=X.toLowerCase(),l=t.mode.toLowerCase().includes(a)||t.zone.toLowerCase().includes(a)||t.distance.toLowerCase().includes(a),s=r&&t.zone.toLowerCase().includes(r);return l||s}),pe=(f-1)/99*100;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:fe}),e.jsxs("div",{className:"dp-root",children:[e.jsxs("div",{className:"dp-card",children:[e.jsxs("div",{className:"dp-header",children:[e.jsx("p",{className:"dp-header-label",children:"Logistics Management"}),e.jsxs("h1",{className:"dp-header-title",children:["Delivery ",e.jsx("span",{children:"Zones"})]})]}),e.jsxs("div",{className:"dp-panel",children:[e.jsx("p",{className:"dp-section-label",children:"Add Delivery Modes"}),e.jsxs("div",{className:"dp-field",children:[e.jsx("label",{children:"Title"}),e.jsx("input",{placeholder:"e.g. Express Delivery",value:N,onChange:t=>S(t.target.value)})]}),e.jsxs("div",{className:"dp-field",children:[e.jsx("label",{children:"Zone / District"}),e.jsxs("div",{className:"dp-tag-input-box",children:[z.map(t=>e.jsxs("span",{className:"dp-zone-tag",children:[t,e.jsx("button",{className:"dp-tag-remove",onClick:()=>de(t),children:"×"})]},t)),e.jsx("input",{className:"dp-tag-inner-input",placeholder:"",value:J,readOnly:!0,style:{cursor:"default"}})]})]}),e.jsxs("div",{className:"dp-field",style:{display:"none"},children:[e.jsx("label",{children:"Coverage Type"}),e.jsx("div",{style:{display:"flex",gap:"10px",marginTop:"5px"},children:e.jsxs("div",{className:"dp-coverage-chip active",children:[e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{width:"14px"},children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),"Radius Based"]})})]}),e.jsxs("div",{className:"dp-map-wrapper",children:[e.jsx("div",{className:"dp-map-area",children:k?e.jsx("div",{ref:P,className:"dp-map-canvas"}):e.jsxs("div",{className:"dp-map-loading",children:[e.jsx("div",{className:"dp-map-loading-spinner"}),e.jsx("span",{className:"dp-map-loading-text",children:"Initializing Map Engine..."})]})}),k&&L==="radius_based"&&e.jsxs("div",{className:"dp-radius-section",children:[e.jsxs("div",{className:"dp-radius-left",children:[e.jsx("div",{className:"dp-slider-icon",children:e.jsxs("svg",{viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 2a10 10 0 0 1 10 10"}),e.jsx("path",{d:"M12 2a10 10 0 0 0-10 10"}),e.jsx("path",{d:"M12 22a10 10 0 0 0 10-10"}),e.jsx("path",{d:"M12 22a10 10 0 0 1-10-10"})]})}),e.jsxs("div",{children:[e.jsx("div",{className:"dp-radius-label",children:"Delivery Radius"}),e.jsx("div",{className:"dp-radius-sub",children:"Drag to adjust coverage area"})]})]}),e.jsx("div",{className:"dp-radius-right",children:e.jsxs("span",{className:"dp-slider-value-pill",children:[f," km"]})}),e.jsxs("div",{className:"dp-radius-track-row",children:[e.jsx("span",{className:"dp-slider-tick-min",children:"1 km"}),e.jsx("input",{type:"range",className:"dp-map-slider-input",min:1,max:100,value:f,style:{"--val":`${pe}%`},onChange:t=>M(Number(t.target.value))}),e.jsx("span",{className:"dp-slider-tick-max",children:"100 km"})]})]}),e.jsxs("div",{className:"dp-map-select-row",children:[e.jsxs("div",{className:"dp-map-tip-inline",children:[e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),"Click on the map to pin your pickup/delivery location"]}),e.jsxs("button",{className:"dp-btn-select",onClick:le,children:[e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]}),"Select"]})]}),e.jsxs("div",{className:"dp-coords-row",children:[e.jsxs("div",{className:"dp-coord-field",children:[e.jsx("label",{children:"Latitude"}),e.jsx("input",{value:d.latitude,placeholder:"0.0000",disabled:!0,readOnly:!0})]}),e.jsxs("div",{className:"dp-coord-field",children:[e.jsx("label",{children:"Longitude"}),e.jsx("input",{value:d.longitude,placeholder:"0.0000",disabled:!0,readOnly:!0})]}),e.jsxs("div",{className:"dp-coord-field",children:[e.jsx("label",{children:"Final Pickup Address"}),e.jsx("input",{className:"editable",value:d.address,onChange:t=>w(a=>({...a,address:t.target.value})),placeholder:"Pin on map or type address..."})]})]})]}),e.jsxs("div",{className:"dp-bottom-row",children:[e.jsxs("div",{className:"dp-field dp-field-price",children:[e.jsx("label",{children:"Shipping Price"}),e.jsx("input",{type:"number",placeholder:"0.00",value:T,onChange:t=>C(t.target.value)})]}),e.jsxs("div",{className:"dp-bottom-actions",children:[e.jsx("button",{className:"dp-btn-ghost",onClick:G,disabled:D,children:y!==null?"Cancel Edit":"Reset"}),e.jsx("button",{className:"dp-btn-save",onClick:oe,disabled:D,children:D?"Saving...":y!==null?"Update Mode":"Save"})]})]})]}),e.jsxs("div",{className:"dp-panel",children:[e.jsx("h2",{className:"dp-table-title",style:{marginBottom:16},children:"All Delivery Modes"}),e.jsxs("div",{className:"dp-table-search-wrap",children:[e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.3-4.3"})]}),e.jsx("input",{className:"dp-table-search",placeholder:"Search Area...",value:m,onChange:t=>q(t.target.value)})]}),e.jsxs("table",{className:"dp-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Sl No"}),e.jsx("th",{children:"Mode"}),e.jsx("th",{children:"Distance (km)"}),e.jsx("th",{children:"Zone / District"}),e.jsx("th",{children:"Price"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Action"})]})}),e.jsx("tbody",{children:H.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,className:"dp-empty",children:"No delivery modes found."})}):H.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{className:"dp-td-sl",children:a+1<10?`0${a+1}`:a+1}),e.jsx("td",{children:e.jsx("span",{className:"dp-mode-name",children:t.mode})}),e.jsx("td",{children:e.jsxs("span",{className:"dp-distance-pill",children:[e.jsx("svg",{width:"9",height:"9",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:e.jsx("path",{d:"M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"})}),t.distance]})}),e.jsx("td",{className:"dp-td-zone",children:t.zone}),e.jsx("td",{children:e.jsxs("span",{className:"dp-price-pill",style:{display:"inline-flex",alignItems:"center",background:"#fdf2f8",border:"1px solid #fce7f3",padding:"4px 12px",borderRadius:"20px",fontSize:"13px",fontWeight:"700",color:"#db2777"},children:["₹ ",parseFloat(t.shippingPrice||0).toFixed(2)]})}),e.jsx("td",{children:e.jsx("span",{className:"dp-status-active",children:t.status})}),e.jsx("td",{children:e.jsxs("div",{className:"dp-action-btns",children:[e.jsx("button",{className:"dp-action-edit",title:"Edit",onClick:()=>{S(t.mode),C(t.shippingPrice),M(t._rawConfig.radius||26),v(t._rawConfig.selectedPincodes||[]),O(t._originalIndex),window.scrollTo({top:0,behavior:"smooth"})},children:e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),e.jsx("button",{className:"dp-action-delete",title:"Delete",onClick:()=>ne(t.id),children:e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"3,6 5,6 21,6"}),e.jsx("path",{d:"M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"}),e.jsx("path",{d:"M10,11v6"}),e.jsx("path",{d:"M14,11v6"}),e.jsx("path",{d:"M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6"})]})})]})})]},t.id))})]})]})]}),U&&e.jsx("div",{className:"dp-toast",children:"✓ Delivery mode saved successfully"})]})]})};export{me as default};
