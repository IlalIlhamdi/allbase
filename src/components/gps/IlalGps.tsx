"use client";

import { useState } from "react";
import { MapPin, Navigation, Share2, Map, AlertCircle } from "lucide-react";

export default function IlalGps() {
  const [coords, setCoords] = useState<string>("Koordinat muncul di sini...");
  const [address, setAddress] = useState<string>("Alamat muncul di sini...");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [lastLat, setLastLat] = useState<number | null>(null);
  const [lastLon, setLastLon] = useState<number | null>(null);
  const [manualInput, setManualInput] = useState<string>("");

  const updateLocation = async (lat: number, lon: number) => {
    setLastLat(lat);
    setLastLon(lon);
    setCoords(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
    setAddress("Mengambil alamat via OpenStreetMap...");
    setErrorMsg("");

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.display_name || "Alamat ditemukan.";
        setAddress(addr);
      } else {
        setAddress("Alamat tidak ditemukan.");
      }
    } catch {
      setAddress("Gagal mengunduh deskripsi alamat.");
    }
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Browser Anda tidak mendukung fitur Geolocation.");
      return;
    }

    setLoading(true);
    setCoords("Mengambil posisi GPS...");
    setAddress("Menunggu persetujuan izin...");
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        setCoords("Gagal mengambil posisi.");
        setAddress("-");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Izin akses lokasi ditolak oleh pengguna.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setErrorMsg("Informasi lokasi tidak tersedia saat ini.");
        } else if (err.code === err.TIMEOUT) {
          setErrorMsg("Waktu permintaan lokasi habis (timeout).");
        } else {
          setErrorMsg("Terjadi kendala saat mengambil koordinat.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const searchManual = () => {
    const parts = manualInput.split(",");
    if (parts.length !== 2) {
      setErrorMsg("Format koordinat manual harus: lat, lon (Contoh: -6.2, 106.8)");
      return;
    }
    const lat = parseFloat(parts[0]!.trim());
    const lon = parseFloat(parts[1]!.trim());
    if (isNaN(lat) || isNaN(lon)) {
      setErrorMsg("Nilai lat/lon tidak valid.");
      return;
    }
    updateLocation(lat, lon);
  };

  const openGoogleMaps = () => {
    if (lastLat !== null && lastLon !== null) {
      window.open(`https://www.google.com/maps?q=${lastLat},${lastLon}`, "_blank", "noopener,noreferrer");
    }
  };

  const shareWhatsApp = () => {
    if (lastLat === null || lastLon === null) return;
    const text = `📍 Lokasi Saya:\nKoordinat: ${lastLat}, ${lastLon}\nGoogle Maps: https://www.google.com/maps?q=${lastLat},${lastLon}\nAlamat: ${address}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "700px", marginInline: "auto" }}>
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(18px, 4vw, 32px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: "var(--color-primary-50)",
              color: "var(--color-primary-600)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <MapPin size={14} /> Geolocation Utility
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", marginBottom: "6px" }}>Deteksi Lokasi GPS</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Ambil koordinat presisi real-time dan deskripsi alamat perangkat Anda setelah penekanan tombol izin.
        </p>

        {/* Display Box */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--color-surface-soft)",
            borderRadius: "var(--radius-sm)",
            border: "1px dashed var(--color-border)",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.95rem, 3.5vw, 1.1rem)",
            fontWeight: 700,
            marginBottom: "12px",
            overflowWrap: "anywhere",
          }}
        >
          {coords}
        </div>

        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--color-surface-soft)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            textAlign: "center",
            fontSize: "0.9rem",
            marginBottom: "20px",
            lineHeight: 1.5,
            overflowWrap: "anywhere",
          }}
        >
          {address}
        </div>

        {errorMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-danger)", marginBottom: "16px", fontWeight: 600, fontSize: "0.9rem" }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={getMyLocation}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "48px",
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-primary-600)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.95rem",
              width: "100%",
            }}
          >
            <Navigation size={18} /> {loading ? "Mengambil Lokasi..." : "📍 Ambil Lokasi Saya"}
          </button>

          {lastLat !== null && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={openGoogleMaps}
                style={{
                  flex: "1 1 140px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-surface-soft)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontWeight: 600,
                }}
              >
                <Map size={16} /> Buka di Google Maps
              </button>

              <button
                onClick={shareWhatsApp}
                style={{
                  flex: "1 1 140px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                <Share2 size={16} /> Kirim ke WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Search */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(18px, 4vw, 24px)",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Cari Alamat Manual</h3>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="manualLatLon" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
            Masukkan Koordinat (Lat, Lon)
          </label>
          <input
            id="manualLatLon"
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Contoh: -6.2, 106.8"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
            }}
          />
        </div>
        <button
          onClick={searchManual}
          style={{
            width: "100%",
            minHeight: "44px",
            padding: "10px 16px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-surface-soft)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            fontWeight: 600,
          }}
        >
          Cari Alamat
        </button>
      </div>
    </div>
  );
}
