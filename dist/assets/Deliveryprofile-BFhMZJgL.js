import{r,h as k,j as e}from"./index-o1Kc6YJO.js";const fe="AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78",j=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:5000":"https://api.bookmyevent.ae",xe=`
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
`,me=()=>{const[S,N]=r.useState(""),[C,M]=r.useState(""),[c,u]=r.useState([]),[_,D]=r.useState(""),[h,L]=r.useState(26),[U,O]=r.useState(!1),[y,Q]=r.useState(""),[q,Z]=r.useState(""),[ge,X]=r.useState(!1),[P,ee]=r.useState("radius_based"),[l,te]=r.useState(null),[ae,oe]=r.useState([]),[B,F]=r.useState(!1),[T,A]=r.useState(null),[ue,W]=r.useState(!0),$=r.useRef(null),b=r.useRef(null),g=r.useRef(null),Y=r.useRef(null),[w,ie]=r.useState(null),[E,R]=r.useState(!1),[p,z]=r.useState({latitude:"",longitude:"",address:""});r.useEffect(()=>{I(),re()},[]);const re=()=>{var s;if((s=window.google)!=null&&s.maps){R(!0);return}const t=document.getElementById("dp-gmaps-script");if(t){t.addEventListener("load",()=>R(!0));return}const a=document.createElement("script");a.id="dp-gmaps-script",a.src=`https://maps.googleapis.com/maps/api/js?key=${fe}&libraries=places`,a.async=!0,a.defer=!0,a.onload=()=>R(!0),document.head.appendChild(a)},I=async()=>{var t,a,s;try{const o=localStorage.getItem("user"),i=o?JSON.parse(o):null,n=(i==null?void 0:i._id)||(i==null?void 0:i.id);if(!n){W(!1);return}const f=localStorage.getItem("token"),d=(t=(await k.get(`${j}/api/vendorprofiles/find/${n}`,{headers:{Authorization:`Bearer ${f}`}})).data)==null?void 0:t.data;if(d){te(d);const ce=(((a=d.deliveryProfile)==null?void 0:a.deliveryConfigurations)||[]).map((x,m)=>{var J;return{id:m+1,mode:x.mode,distance:`${x.radius||0} km`,zone:((J=x.selectedPincodes)==null?void 0:J.length)>0?x.selectedPincodes.join(", "):"Registered Area",status:x.status?"Active":"Inactive",shippingPrice:x.shippingPrice}});if(oe(ce),d.latitude&&d.longitude){const x=((s=d.storeAddress)==null?void 0:s.fullAddress)||"";z(m=>({...m,latitude:d.latitude,longitude:d.longitude,address:x})),x&&u(m=>m.includes(x)?m:[...m,x])}}}catch(o){console.error("Error fetching profile:",o)}finally{W(!1)}};r.useEffect(()=>{const a=setTimeout(async()=>{var s,o;if(/^\d{6}$/.test(y))try{const n=(o=(s=(await k.get(`${j}/api/pincodes?search=${y}`)).data)==null?void 0:s.data)==null?void 0:o[0];if(n){const f=n.state||n.city||n.district_name||"";Z(f)}}catch{}else Z("")},400);return()=>clearTimeout(a)},[y]);const K=r.useCallback(()=>{if(!window.google||!$.current)return;const t=p.latitude&&p.longitude?{lat:parseFloat(p.latitude),lng:parseFloat(p.longitude)}:{lat:11.2588,lng:75.7804},a=new window.google.maps.Map($.current,{zoom:11,center:t,mapTypeControl:!1,streetViewControl:!1,fullscreenControl:!1});a.addListener("click",s=>{const o=s.latLng.lat(),i=s.latLng.lng();z(n=>({...n,latitude:o.toString(),longitude:i.toString()})),b.current&&b.current.setMap(null),b.current=new window.google.maps.Marker({position:{lat:o,lng:i},map:a,animation:window.google.maps.Animation.DROP}),new window.google.maps.Geocoder().geocode({location:{lat:o,lng:i}},(n,f)=>{if(f==="OK"&&n[0]){const v=n[0].formatted_address;z(d=>({...d,address:v})),u(d=>d.includes(v)?d:[...d,v])}})}),g.current=new window.google.maps.Circle({strokeColor:"#2563EB",strokeOpacity:.85,strokeWeight:2,fillColor:"#2563EB",fillOpacity:.13,map:a,center:t,radius:h*1e3}),ie(a)},[p.latitude,p.longitude,h]);r.useEffect(()=>{E&&K()},[E,K]);const G=t=>{if(!g.current||!t)return;const a=g.current.getBounds();a&&(t.fitBounds(a,{top:60,right:60,bottom:60,left:60}),window.google.maps.event.addListenerOnce(t,"idle",()=>{t.getZoom()<7&&t.setZoom(7)}))};r.useEffect(()=>{if(!w||!g.current||!p.latitude||!p.longitude)return;const t=parseFloat(p.latitude),a=parseFloat(p.longitude),s={lat:t,lng:a};g.current.setCenter(s),g.current.setRadius(h*1e3),b.current?b.current.setPosition(s):b.current=new window.google.maps.Marker({position:s,map:w,animation:window.google.maps.Animation.DROP}),G(w)},[p.latitude,p.longitude,w]),r.useEffect(()=>{g.current&&(g.current.setRadius(h*1e3),w&&p.latitude&&p.longitude&&G(w))},[h]);const se=async()=>{var o;if(!S||!l)return;F(!0);const t={mode:S,coverageType:P,radius:P==="radius_based"?h:0,selectedPincodes:c,shippingPrice:parseFloat(_)||0,status:!0},a=((o=l.deliveryProfile)==null?void 0:o.deliveryConfigurations)||[];let s=[];T!==null?s=a.map((i,n)=>n===T?t:i):s=[...a,t];try{const i=localStorage.getItem("token");(await k.put(`${j}/api/vendorprofiles/${l._id}`,{deliveryProfile:{deliveryConfigurations:s}},{headers:{Authorization:`Bearer ${i}`}})).data.success&&(O(!0),setTimeout(()=>O(!1),2400),I(),H(),A(null))}catch(i){console.error("Error saving profile:",i)}finally{F(!1)}},ne=async t=>{var i;if(!l)return;const a=t-1,o=(((i=l.deliveryProfile)==null?void 0:i.deliveryConfigurations)||[]).filter((n,f)=>f!==a);try{const n=localStorage.getItem("token");(await k.put(`${j}/api/vendorprofiles/${l._id}`,{deliveryProfile:{deliveryConfigurations:o}},{headers:{Authorization:`Bearer ${n}`}})).data.success&&I()}catch(n){console.error("Error deleting mode:",n)}},H=()=>{var t;N(""),u([]),M(""),D(""),L(26),A(null),X(!1),ee("radius_based"),z({latitude:(l==null?void 0:l.latitude)||"",longitude:(l==null?void 0:l.longitude)||"",address:((t=l==null?void 0:l.storeAddress)==null?void 0:t.fullAddress)||""}),b.current&&(b.current.setMap(null),b.current=null),g.current&&g.current.setRadius(26*1e3),Y.current&&(Y.current.value="")},de=async t=>{var a,s;if((t.key==="Enter"||t.key===",")&&C.trim()){t.preventDefault();const o=C.trim();if(/^\d{6,}$/.test(o))try{const i=localStorage.getItem("token"),f=(s=(a=(await k.get(`${j}/api/pincodes?search=${o}`,{headers:{Authorization:`Bearer ${i}`}})).data)==null?void 0:a.data)==null?void 0:s[0];if(f){const d=`${f.state||f.city||"Unknown Zone"} (${o})`;c.includes(d)||u([...c,d])}else c.includes(o)||u([...c,o])}catch(i){console.error("Error looking up pincode:",i),c.includes(o)||u([...c,o])}else c.includes(o)||u([...c,o]);M("")}},le=t=>u(c.filter(a=>a!==t)),V=ae.filter(t=>{if(t.mode.toLowerCase()==="standard package delivery")return!1;const a=y.toLowerCase(),s=q.toLowerCase(),o=t.mode.toLowerCase().includes(a)||t.zone.toLowerCase().includes(a)||t.distance.toLowerCase().includes(a),i=s&&t.zone.toLowerCase().includes(s);return o||i}),pe=(h-1)/99*100;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:xe}),e.jsxs("div",{className:"dp-root",children:[e.jsxs("div",{className:"dp-card",children:[e.jsxs("div",{className:"dp-header",children:[e.jsx("p",{className:"dp-header-label",children:"Logistics Management"}),e.jsxs("h1",{className:"dp-header-title",children:["Delivery ",e.jsx("span",{children:"Zones"})]})]}),e.jsxs("div",{className:"dp-panel",children:[e.jsx("p",{className:"dp-section-label",children:"Add Delivery Modes"}),e.jsxs("div",{className:"dp-field",children:[e.jsx("label",{children:"Title"}),e.jsx("input",{placeholder:"e.g. Express Delivery",value:S,onChange:t=>N(t.target.value)})]}),e.jsxs("div",{className:"dp-field",children:[e.jsx("label",{children:"Zone / District"}),e.jsxs("div",{className:"dp-tag-input-box",children:[c.map(t=>e.jsxs("span",{className:"dp-zone-tag",children:[t,e.jsx("button",{className:"dp-tag-remove",onClick:()=>le(t),children:"×"})]},t)),e.jsx("input",{className:"dp-tag-inner-input",placeholder:c.length===0?"Type zone and press Enter...":"",value:C,onChange:t=>M(t.target.value),onKeyDown:de})]})]}),e.jsxs("div",{className:"dp-field",style:{display:"none"},children:[e.jsx("label",{children:"Coverage Type"}),e.jsx("div",{style:{display:"flex",gap:"10px",marginTop:"5px"},children:e.jsxs("div",{className:"dp-coverage-chip active",children:[e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{width:"14px"},children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),"Radius Based"]})})]}),e.jsxs("div",{className:"dp-map-wrapper",children:[e.jsx("div",{className:"dp-map-area",children:E?e.jsx("div",{ref:$,className:"dp-map-canvas"}):e.jsxs("div",{className:"dp-map-loading",children:[e.jsx("div",{className:"dp-map-loading-spinner"}),e.jsx("span",{className:"dp-map-loading-text",children:"Initializing Map Engine..."})]})}),E&&P==="radius_based"&&e.jsxs("div",{className:"dp-radius-section",children:[e.jsxs("div",{className:"dp-radius-left",children:[e.jsx("div",{className:"dp-slider-icon",children:e.jsxs("svg",{viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 2a10 10 0 0 1 10 10"}),e.jsx("path",{d:"M12 2a10 10 0 0 0-10 10"}),e.jsx("path",{d:"M12 22a10 10 0 0 0 10-10"}),e.jsx("path",{d:"M12 22a10 10 0 0 1-10-10"})]})}),e.jsxs("div",{children:[e.jsx("div",{className:"dp-radius-label",children:"Delivery Radius"}),e.jsx("div",{className:"dp-radius-sub",children:"Drag to adjust coverage area"})]})]}),e.jsx("div",{className:"dp-radius-right",children:e.jsxs("span",{className:"dp-slider-value-pill",children:[h," km"]})}),e.jsxs("div",{className:"dp-radius-track-row",children:[e.jsx("span",{className:"dp-slider-tick-min",children:"1 km"}),e.jsx("input",{type:"range",className:"dp-map-slider-input",min:1,max:100,value:h,style:{"--val":`${pe}%`},onChange:t=>L(Number(t.target.value))}),e.jsx("span",{className:"dp-slider-tick-max",children:"100 km"})]})]})]}),e.jsxs("div",{className:"dp-bottom-row",children:[e.jsxs("div",{className:"dp-field dp-field-price",children:[e.jsx("label",{children:"Shipping Price"}),e.jsx("input",{type:"number",placeholder:"0.00",value:_,onChange:t=>D(t.target.value)})]}),e.jsxs("div",{className:"dp-bottom-actions",children:[e.jsx("button",{className:"dp-btn-ghost",onClick:H,disabled:B,children:"Reset"}),e.jsx("button",{className:"dp-btn-save",onClick:se,disabled:B,children:B?"Saving...":T!==null?"Update":"Save"})]})]})]}),e.jsxs("div",{className:"dp-panel",children:[e.jsx("h2",{className:"dp-table-title",style:{marginBottom:16},children:"All Delivery Modes"}),e.jsxs("div",{className:"dp-table-search-wrap",children:[e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.3-4.3"})]}),e.jsx("input",{className:"dp-table-search",placeholder:"Search Modes...",value:y,onChange:t=>Q(t.target.value)})]}),e.jsxs("table",{className:"dp-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Sl No"}),e.jsx("th",{children:"Mode"}),e.jsx("th",{children:"Distance (km)"}),e.jsx("th",{children:"Zone / District"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Action"})]})}),e.jsx("tbody",{children:V.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,className:"dp-empty",children:"No delivery modes found."})}):V.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{className:"dp-td-sl",children:a+1<10?`0${a+1}`:a+1}),e.jsx("td",{children:e.jsx("span",{className:"dp-mode-name",children:t.mode})}),e.jsx("td",{children:e.jsxs("span",{className:"dp-distance-pill",children:[e.jsx("svg",{width:"9",height:"9",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:e.jsx("path",{d:"M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"})}),t.distance]})}),e.jsx("td",{className:"dp-td-zone",children:t.zone}),e.jsx("td",{children:e.jsx("span",{className:"dp-status-active",children:t.status})}),e.jsx("td",{children:e.jsxs("div",{className:"dp-action-btns",children:[e.jsx("button",{className:"dp-action-edit",title:"Edit",onClick:()=>{var i;const o=(((i=l.deliveryProfile)==null?void 0:i.deliveryConfigurations)||[])[t.id-1];o&&(N(o.mode),D(o.shippingPrice),L(o.radius||26),u(o.selectedPincodes||[]),A(t.id-1),window.scrollTo({top:0,behavior:"smooth"}))},children:e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),e.jsx("button",{className:"dp-action-delete",title:"Delete",onClick:()=>ne(t.id),children:e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"3,6 5,6 21,6"}),e.jsx("path",{d:"M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"}),e.jsx("path",{d:"M10,11v6"}),e.jsx("path",{d:"M14,11v6"}),e.jsx("path",{d:"M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6"})]})})]})})]},t.id))})]})]})]}),U&&e.jsx("div",{className:"dp-toast",children:"✓ Delivery mode saved successfully"})]})]})};export{me as default};
