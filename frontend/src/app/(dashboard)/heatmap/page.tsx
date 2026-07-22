"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon, Filter, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { fetchWithAuth } from "@/lib/auth";

// Dynamically import Leaflet components to avoid SSR errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Heatmap() {
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth("/heatmap");
        if (res.ok) {
          const data = await res.json();
          setHotspots(data.hotspots);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MapIcon className="w-8 h-8 text-primary" />
            India Cyber Crime Heatmap
          </h2>
          <p className="text-muted-foreground mt-2">
            Real-time geographical tracking of fraud hotspots and scam origins.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border/50">
            <Filter className="w-4 h-4" />
            Filter by State/Type
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-6 min-h-[600px]">
        <Card className="col-span-3 bg-background/40 backdrop-blur-sm border-border/50 overflow-hidden flex flex-col relative z-0">
          <div className="flex-1 relative">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[22.5937, 78.9629]}
                zoom={5}
                style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {hotspots.map((spot) => (
                  <CircleMarker
                    key={spot.id}
                    center={[spot.lat, spot.lng]}
                    radius={spot.intensity * 25}
                    pathOptions={{
                      color: spot.intensity > 0.8 ? "#ef4444" : spot.intensity > 0.6 ? "#f97316" : "#eab308",
                      fillColor: spot.intensity > 0.8 ? "#ef4444" : spot.intensity > 0.6 ? "#f97316" : "#eab308",
                      fillOpacity: 0.6,
                    }}
                  >
                    <Popup className="bg-background border-border text-foreground">
                      <div className="p-1">
                        <h4 className="font-bold">{spot.city}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Active Cases: {spot.cases}</p>
                        <p className="text-sm text-red-500 font-medium">{spot.type}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}
          </div>
        </Card>

        <div className="col-span-1 space-y-6 flex flex-col">
          <Card className="bg-background/40 backdrop-blur-sm border-border/50 flex-1">
            <CardHeader>
              <CardTitle>Hotspot Intelligence</CardTitle>
              <CardDescription>Predictive threat modeling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-500 text-sm">Critical Alert</h4>
                    <p className="text-xs text-red-400 mt-1">
                      A 45% spike in Digital Arrest scams originating from the Agartala IP block in the last 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-semibold">Top Threat Regions</h4>
                {hotspots
                  .sort((a, b) => b.intensity - a.intensity)
                  .map((spot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-border/50">
                      <div>
                        <p className="text-sm font-medium">{spot.city}</p>
                        <p className="text-xs text-muted-foreground">{spot.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-500">{spot.cases}</p>
                        <p className="text-[10px] text-muted-foreground">cases</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
