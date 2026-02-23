import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78';

const PINK = '#E91E63';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://api.bookmyevent.ae';

const styles = `
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
`;

const DeliveryProfile = () => {
  const [title, setTitle] = useState("Standard package delivery");
  const [zoneInput, setZoneInput] = useState("");
  const [zoneTags, setZoneTags] = useState([]);
  const [shippingPrice, setShippingPrice] = useState("");
  const [radiusKm, setRadiusKm] = useState(26);
  const [showToast, setShowToast] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [smartSearchZone, setSmartSearchZone] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);
  const [coverageType, setCoverageType] = useState("radius_based"); // 'radius_based' or 'entire_zone'

  const [editIndex, setEditIndex] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Google Maps state & refs
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const searchInputRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [pickupLocation, setPickupLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });

  // ── 1. Load Data on Mount ───────────────────────────────
  useEffect(() => {
    fetchProfile();
    loadGoogleMaps();
  }, []);

  const loadGoogleMaps = () => {
    if (window.google?.maps) { setMapsLoaded(true); return; }

    const existing = document.getElementById('dp-gmaps-script');
    if (existing) {
      existing.addEventListener('load', () => setMapsLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'dp-gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  };

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const userId = parsedUser?._id || parsedUser?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/vendorprofiles/find/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profile = res.data?.data;
      if (profile) {
        setVendorProfile(profile);
        const configs = profile.deliveryProfile?.deliveryConfigurations || [];
        // Map backend config to frontend table format
        const mappedModes = configs.map((c, idx) => ({
          id: idx + 1,
          mode: c.mode,
          distance: `${c.radius || 0} km`,
          zone: c.selectedPincodes?.length > 0 ? c.selectedPincodes.join(', ') : 'Registered Area',
          status: c.status ? 'Active' : 'Inactive',
          shippingPrice: c.shippingPrice,
          _originalIndex: idx,
          _rawConfig: c
        }));
        setDeliveryModes(mappedModes);

        if (profile.latitude && profile.longitude) {
          const initialAddr = profile.storeAddress?.fullAddress || "";
          setPickupLocation(prev => ({
            ...prev,
            latitude: profile.latitude,
            longitude: profile.longitude,
            address: initialAddr
          }));

          if (initialAddr) {
            setZoneTags(prev => {
              if (!prev.includes(initialAddr)) return [...prev, initialAddr];
              return prev;
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Smart Pincode Search in Table ──────────────────────────
  useEffect(() => {
    const lookupPincode = async () => {
      if (/^\d{6}$/.test(tableSearch)) {
        try {
          const res = await axios.get(`${API_BASE}/api/pincodes?search=${tableSearch}`);
          const data = res.data?.data?.[0];
          if (data) {
            // Find the city/state this pincode belongs to
            const zone = data.state || data.city || data.district_name || "";
            setSmartSearchZone(zone);
          }
        } catch (err) { }
      } else {
        setSmartSearchZone("");
      }
    };
    const timer = setTimeout(lookupPincode, 400);
    return () => clearTimeout(timer);
  }, [tableSearch]);

  // ── 2. Init map once SDK is ready ────────────────────────────
  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current) return;

    const defaultCenter = pickupLocation.latitude && pickupLocation.longitude
      ? { lat: parseFloat(pickupLocation.latitude), lng: parseFloat(pickupLocation.longitude) }
      : { lat: 11.2588, lng: 75.7804 }; // Kozhikode

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 11,
      center: defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Click to drop pin + reverse geocode
    newMap.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      setPickupLocation(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));

      if (markerRef.current) markerRef.current.setMap(null);
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: newMap,
        animation: window.google.maps.Animation.DROP,
      });

      new window.google.maps.Geocoder().geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const addr = results[0].formatted_address;
          setPickupLocation(prev => ({ ...prev, address: addr }));
        }
      });
    });

    // Radius circle
    circleRef.current = new window.google.maps.Circle({
      strokeColor: '#2563EB',
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: '#2563EB',
      fillOpacity: 0.13,
      map: newMap,
      center: defaultCenter,
      radius: radiusKm * 1000,
    });

    setMapInstance(newMap);
  }, [pickupLocation.latitude, pickupLocation.longitude, radiusKm]); // eslint-disable-line

  useEffect(() => {
    if (mapsLoaded) initMap();
  }, [mapsLoaded, initMap]);

  // Helper: fitBounds to circle with a zoom floor so it never goes too wide
  const fitToCircle = (map) => {
    if (!circleRef.current || !map) return;
    const bounds = circleRef.current.getBounds();
    if (!bounds) return;
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    // Enforce min zoom after Google finishes fitting
    window.google.maps.event.addListenerOnce(map, 'idle', () => {
      if (map.getZoom() < 7) map.setZoom(7);
    });
  };

  // ── 3. Re-center + refit when pin location changes ───────────
  useEffect(() => {
    if (!mapInstance || !circleRef.current || !pickupLocation.latitude || !pickupLocation.longitude) return;
    const lat = parseFloat(pickupLocation.latitude);
    const lng = parseFloat(pickupLocation.longitude);
    const center = { lat, lng };
    circleRef.current.setCenter(center);
    circleRef.current.setRadius(radiusKm * 1000);
    if (markerRef.current) {
      markerRef.current.setPosition(center);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: center, map: mapInstance, animation: window.google.maps.Animation.DROP,
      });
    }
    fitToCircle(mapInstance);
  }, [pickupLocation.latitude, pickupLocation.longitude, mapInstance]); // eslint-disable-line

  // ── 4. Update radius + zoom map out to show full circle ──────
  useEffect(() => {
    if (!circleRef.current) return;
    circleRef.current.setRadius(radiusKm * 1000);
    if (mapInstance && pickupLocation.latitude && pickupLocation.longitude) {
      fitToCircle(mapInstance);
    }
  }, [radiusKm]); // eslint-disable-line

  // ── Handlers ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title || !vendorProfile) return;
    setSaving(true);

    // We append the new mode to existing configurations
    const newConfig = {
      mode: title,
      coverageType: coverageType,
      radius: coverageType === 'radius_based' ? radiusKm : 0,
      selectedPincodes: zoneTags, // Using zoneTags for specific pincodes or areas
      shippingPrice: parseFloat(shippingPrice) || 0,
      status: true
    };

    const existingConfigs = vendorProfile.deliveryProfile?.deliveryConfigurations || [];
    let updatedConfigs = [];

    if (editIndex !== null) {
      // Update existing
      updatedConfigs = existingConfigs.map((c, i) => i === editIndex ? newConfig : c);
    } else {
      // Append new
      updatedConfigs = [...existingConfigs, newConfig];
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE}/api/vendorprofiles/${vendorProfile._id}`, {
        deliveryProfile: {
          deliveryConfigurations: updatedConfigs
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2400);
        fetchProfile(); // Refresh table
        handleReset();
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (idOfMode) => {
    if (!vendorProfile) return;

    // idOfMode is frontend index + 1
    const idx = idOfMode - 1;
    const existingConfigs = vendorProfile.deliveryProfile?.deliveryConfigurations || [];
    const updatedConfigs = existingConfigs.filter((_, i) => i !== idx);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE}/api/vendorprofiles/${vendorProfile._id}`, {
        deliveryProfile: {
          deliveryConfigurations: updatedConfigs
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        fetchProfile(); // Refresh table
      }
    } catch (err) {
      console.error('Error deleting mode:', err);
    }
  };

  const handleReset = () => {
    setEditIndex(null);
    setTitle("Standard package delivery");
    const vendorAddr = vendorProfile?.storeAddress?.fullAddress || "";
    setZoneTags(vendorAddr ? [vendorAddr] : []);
    setZoneInput("");
    setShippingPrice("");
    setRadiusKm(26);
    setLocationSelected(false);
    setCoverageType("radius_based");
    setPickupLocation({
      latitude: vendorProfile?.latitude || "",
      longitude: vendorProfile?.longitude || "",
      address: vendorProfile?.storeAddress?.fullAddress || ""
    });
    if (markerRef.current) { markerRef.current.setMap(null); markerRef.current = null; }
    if (circleRef.current) circleRef.current.setRadius(26 * 1000);
    if (searchInputRef.current) searchInputRef.current.value = "";
  };

  const handleZoneKeyDown = async (e) => {
    if ((e.key === "Enter" || e.key === ",") && zoneInput.trim()) {
      e.preventDefault();
      const val = zoneInput.trim();

      // If it looks like a pincode (number and at least 6 digits), try to look up zone
      if (/^\d{6,}$/.test(val)) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_BASE}/api/pincodes?search=${val}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const pincodeData = res.data?.data?.[0];
          if (pincodeData) {
            // Updated to match your new fields: state/city (instead of zone_id/district_name)
            const zoneName = pincodeData.state || pincodeData.city || "Unknown Zone";
            const fullTag = `${zoneName} (${val})`;
            if (!zoneTags.includes(fullTag)) {
              setZoneTags([...zoneTags, fullTag]);
            }
          } else {
            // Fallback: just add the pincode if not found
            if (!zoneTags.includes(val)) {
              setZoneTags([...zoneTags, val]);
            }
          }
        } catch (err) {
          console.error('Error looking up pincode:', err);
          if (!zoneTags.includes(val)) {
            setZoneTags([...zoneTags, val]);
          }
        }
      } else {
        if (!zoneTags.includes(val)) {
          setZoneTags([...zoneTags, val]);
        }
      }
      setZoneInput("");
    }
  };

  const removeZoneTag = (tag) => setZoneTags(zoneTags.filter(t => t !== tag));

  const handleSelectLocation = () => {
    if (pickupLocation.address) {
      setLocationSelected(true);
    }
  };

  const filteredModes = deliveryModes.filter(m => {
    const searchLow = tableSearch.toLowerCase();
    const smartLow = smartSearchZone.toLowerCase();

    const isTextMatch = m.mode.toLowerCase().includes(searchLow) ||
      m.zone.toLowerCase().includes(searchLow) ||
      m.distance.toLowerCase().includes(searchLow);

    // If we found a zone for the searched pincode, show rows matching that zone/district name
    const isSmartMatch = smartLow && m.zone.toLowerCase().includes(smartLow);

    return isTextMatch || isSmartMatch;
  });

  const sliderPct = ((radiusKm - 1) / 99) * 100;

  return (
    <>
      <style>{styles}</style>
      <div className="dp-root">
        <div className="dp-card">

          {/* Header */}
          <div className="dp-header">
            <p className="dp-header-label">Logistics Management</p>
            <h1 className="dp-header-title">Delivery <span>Zones</span></h1>
          </div>

          {/* ── FORM PANEL ── */}
          <div className="dp-panel">
            <p className="dp-section-label">Add Delivery Modes</p>

            {/* Title */}
            <div className="dp-field">
              <label>Title</label>
              <input
                placeholder="e.g. Express Delivery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Zone / District — tag input */}
            <div className="dp-field">
              <label>Zone / District</label>
              <div className="dp-tag-input-box">
                {zoneTags.map(tag => (
                  <span key={tag} className="dp-zone-tag">
                    {tag}
                    <button className="dp-tag-remove" onClick={() => removeZoneTag(tag)}>×</button>
                  </span>
                ))}
                <input
                  className="dp-tag-inner-input"
                  placeholder=""
                  value={zoneInput}
                  readOnly
                  style={{ cursor: 'default' }}
                />
              </div>
            </div>

            {/* Coverage Type Selection - Removed Entire Zone */}
            <div className="dp-field" style={{ display: 'none' }}>
              <label>Coverage Type</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <div className="dp-coverage-chip active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px' }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                  Radius Based
                </div>
              </div>
            </div>

            {/* ── GOOGLE MAP ── */}
            <div className="dp-map-wrapper">

              {/* Map canvas */}
              <div className="dp-map-area">
                {mapsLoaded ? (
                  <div ref={mapRef} className="dp-map-canvas" />
                ) : (
                  <div className="dp-map-loading">
                    <div className="dp-map-loading-spinner" />
                    <span className="dp-map-loading-text">Initializing Map Engine...</span>
                  </div>
                )}
              </div>

              {/* Radius slider BELOW map */}
              {mapsLoaded && coverageType === 'radius_based' && (
                <div className="dp-radius-section">
                  <div className="dp-radius-left">
                    <div className="dp-slider-icon">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2a10 10 0 0 1 10 10" /><path d="M12 2a10 10 0 0 0-10 10" /><path d="M12 22a10 10 0 0 0 10-10" /><path d="M12 22a10 10 0 0 1-10-10" /></svg>
                    </div>
                    <div>
                      <div className="dp-radius-label">Delivery Radius</div>
                      <div className="dp-radius-sub">Drag to adjust coverage area</div>
                    </div>
                  </div>
                  <div className="dp-radius-right">
                    <span className="dp-slider-value-pill">{radiusKm} km</span>
                  </div>
                  <div className="dp-radius-track-row">
                    <span className="dp-slider-tick-min">1 km</span>
                    <input
                      type="range"
                      className="dp-map-slider-input"
                      min={1} max={100} value={radiusKm}
                      style={{ '--val': `${sliderPct}%` }}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                    />
                    <span className="dp-slider-tick-max">100 km</span>
                  </div>
                </div>
              )}

              {/* Select button row */}
              <div className="dp-map-select-row">
                <div className="dp-map-tip-inline">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  Click on the map to pin your pickup/delivery location
                </div>
                <button className="dp-btn-select" onClick={handleSelectLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                  Select
                </button>
              </div>

              {/* Coordinates row */}
              <div className="dp-coords-row">
                <div className="dp-coord-field">
                  <label>Latitude</label>
                  <input value={pickupLocation.latitude} placeholder="0.0000" disabled readOnly />
                </div>
                <div className="dp-coord-field">
                  <label>Longitude</label>
                  <input value={pickupLocation.longitude} placeholder="0.0000" disabled readOnly />
                </div>
                <div className="dp-coord-field">
                  <label>Final Pickup Address</label>
                  <input
                    className="editable"
                    value={pickupLocation.address}
                    onChange={(e) => setPickupLocation(p => ({ ...p, address: e.target.value }))}
                    placeholder="Pin on map or type address..."
                  />
                </div>
              </div>
            </div>

            {/* Shipping Price + Save row */}
            <div className="dp-bottom-row">
              <div className="dp-field dp-field-price">
                <label>Shipping Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={shippingPrice}
                  onChange={(e) => setShippingPrice(e.target.value)}
                />
              </div>
              <div className="dp-bottom-actions">
                <button className="dp-btn-ghost" onClick={handleReset} disabled={saving}>
                  {editIndex !== null ? 'Cancel Edit' : 'Reset'}
                </button>
                <button className="dp-btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : (editIndex !== null ? 'Update Mode' : 'Save')}
                </button>
              </div>
            </div>
          </div>

          {/* ── ALL DELIVERY MODES TABLE ── */}
          <div className="dp-panel">
            <h2 className="dp-table-title" style={{ marginBottom: 16 }}>All Delivery Modes</h2>

            {/* Search bar */}
            <div className="dp-table-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="dp-table-search"
                placeholder="Search Area..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>

            <table className="dp-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Mode</th>
                  <th>Distance (km)</th>
                  <th>Zone / District</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredModes.length === 0 ? (
                  <tr><td colSpan={6} className="dp-empty">No delivery modes found.</td></tr>
                ) : (
                  filteredModes.map((mode, idx) => (
                    <tr key={mode.id}>
                      <td className="dp-td-sl">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</td>
                      <td><span className="dp-mode-name">{mode.mode}</span></td>
                      <td>
                        <span className="dp-distance-pill">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /></svg>
                          {mode.distance}
                        </span>
                      </td>
                      <td className="dp-td-zone">{mode.zone}</td>
                      <td>
                        <span className="dp-price-pill" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          background: '#fdf2f8',
                          border: '1px solid #fce7f3',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#db2777'
                        }}>
                          ₹ {parseFloat(mode.shippingPrice || 0).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className="dp-status-active">
                          {mode.status}
                        </span>
                      </td>
                      <td>
                        <div className="dp-action-btns">
                          <button
                            className="dp-action-edit"
                            title="Edit"
                            onClick={() => {
                              setTitle(mode.mode);
                              setShippingPrice(mode.shippingPrice);
                              setRadiusKm(mode._rawConfig.radius || 26);
                              setZoneTags(mode._rawConfig.selectedPincodes || []);
                              setEditIndex(mode._originalIndex);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button
                            className="dp-action-delete"
                            title="Delete"
                            onClick={() => handleDelete(mode.id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6" /><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6" /><path d="M10,11v6" /><path d="M14,11v6" /><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {showToast && (
          <div className="dp-toast">✓ Delivery mode saved successfully</div>
        )}
      </div>
    </>
  );
};

export default DeliveryProfile;