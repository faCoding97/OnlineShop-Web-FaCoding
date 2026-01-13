"use client";
import { useState } from "react";

export default function MapEmbed({
  embedSrc,
  query,
  title = "Map",
  className = "",
}) {
  const [loading, setLoading] = useState(false);

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const directionsFromHere = () => {
    if (!navigator.geolocation) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const origin = `${coords.latitude},${coords.longitude}`;
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(query)}&travelmode=driving`,
          "_blank",
          "noopener,noreferrer"
        );
        setLoading(false);
      },
      () => {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`,
          "_blank",
          "noopener,noreferrer"
        );
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="embed-responsive rounded-lg overflow-hidden shadow">
        <iframe
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}></iframe>
      </div>

      <div className="absolute right-2 top-2 flex gap-2">
        <button
          onClick={openInMaps}
          className="px-3 py-1.5 rounded-md bg-white/95 hover:bg-white text-gray-800 shadow border text-sm">
          Open in Maps
        </button>
        <button
          onClick={directionsFromHere}
          disabled={loading}
          className="px-3 py-1.5 rounded-md bg-[var(--brand)] hover:brightness-95 text-white shadow text-sm disabled:opacity-60">
          {loading ? "Locating..." : "Directions from here"}
        </button>
      </div>
    </div>
  );
}
