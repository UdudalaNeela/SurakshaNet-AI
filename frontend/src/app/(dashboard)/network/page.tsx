"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Types for force‑graph
interface GraphNode {
  id: string;
  group: string;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface ForceGraphInstance {
  centerAt: (x: number, y: number, duration?: number) => void;
  zoom: (k: number, duration?: number) => void;
}
import { Network, Search, AlertCircle, Filter, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";

// Dynamically import the force graph to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

import { fetchWithAuth } from "@/lib/auth";

export default function FraudNetwork() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphInstance | null>(null);

  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth("/graph");
        if (res.ok) {
          const data = await res.json();
          // Adjust backend nodes structure if needed
          const nodes = data.nodes.map((n: any) => {
            const type = (n.type || "").toLowerCase();
            return {
              ...n,
              group: type,
              color: type === "person" ? "#ef4444" : type === "phone" ? "#3b82f6" : type === "bank" ? "#eab308" : type === "upi" ? "#8b5cf6" : type === "victim" ? "#22c55e" : "#ec4899"
            };
          });
          setGraphData({ nodes, links: data.edges || data.links });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  if (!graphData) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Fraud Network...</div>;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Network className="w-8 h-8 text-primary" />
            Fraud Network Intelligence
          </h2>
          <p className="text-muted-foreground mt-2">
            Interactive visualization of identified fraud rings and mule account networks.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border/50">
            <Filter className="w-4 h-4" />
            Filter Nodes
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export Graph Report
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] grid grid-cols-4 gap-6">
        <Card className="col-span-3 bg-background/40 backdrop-blur-sm border-border/50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"/> Suspects</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"/> Mule Accounts</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"/> Phone Numbers</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"/> Victims</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search Node ID..." className="pl-9 pr-4 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div ref={containerRef} className="flex-1 bg-[#0a0a0a] relative">
            {typeof window !== "undefined" && graphData.nodes.length > 0 && (
              <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                nodeLabel={(n: any, e: any) => `${n.id} (${n.group})`}
                nodeColor="color"
                nodeRelSize={6}
                linkColor={() => "#4b5563"}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                onNodeClick={(node: GraphNode) => {
                  if (graphRef.current) {
                    graphRef.current.centerAt(node.x ?? 0, node.y ?? 0, 1000);
                    graphRef.current.zoom(2, 2000);
                  }
                }}
              />
            )}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur border border-border p-3 rounded-lg text-xs space-y-1">
              <p><strong>Nodes:</strong> {graphData.nodes.length}</p>
              <p><strong>Edges:</strong> {graphData.links.length}</p>
            </div>
          </div>
        </Card>

        <div className="col-span-1 space-y-6 flex flex-col">
          <Card className="bg-background/40 backdrop-blur-sm border-border/50 flex-1">
            <CardHeader>
              <CardTitle>Network Intelligence</CardTitle>
              <CardDescription>AI-generated insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-500 text-sm">High Risk Syndicate Detected</h4>
                    <p className="text-xs text-red-400 mt-1">
                      A central mastermind is operating multiple mule accounts across HDFC and SBI using a shared device (IMEI: 84920...).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Key Entities</h4>
                
                <div className="border border-border/50 p-3 rounded-md bg-muted/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-red-400">person_1 (Mastermind)</span>
                    <Badge variant="destructive">Risk Score: 98</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Connected to 2 phones, 1 device</p>
                    <p>Controls 2 bank accounts indirectly</p>
                  </div>
                </div>

                <div className="border border-border/50 p-3 rounded-md bg-muted/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-pink-400">device_1 (Mobile Phone)</span>
                    <Badge variant="secondary">Shared Asset</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Used to login to both mule accounts</p>
                    <p>Identified in 4 previous fraud cases</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
