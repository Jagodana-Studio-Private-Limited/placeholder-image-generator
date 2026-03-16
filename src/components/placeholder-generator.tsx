"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Image, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolEvents } from "@/lib/analytics";

const PRESETS = [
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1280×720", w: 1280, h: 720 },
  { label: "800×600", w: 800, h: 600 },
  { label: "600×400", w: 600, h: 400 },
  { label: "400×300", w: 400, h: 300 },
  { label: "300×300", w: 300, h: 300 },
  { label: "150×150", w: 150, h: 150 },
  { label: "1200×630", w: 1200, h: 630 },
  { label: "1080×1080", w: 1080, h: 1080 },
  { label: "1080×1920", w: 1080, h: 1920 },
] as const;

type ExportFormat = "png" | "jpeg" | "svg";

export function PlaceholderGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [customText, setCustomText] = useState("");
  const [fontSize, setFontSize] = useState(0); // 0 = auto
  const [format, setFormat] = useState<ExportFormat>("png");
  const [copied, setCopied] = useState(false);

  const displayText = customText || `${width} × ${height}`;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to a preview size (max 600px wide)
    const scale = Math.min(1, 600 / width, 400 / height);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cross lines
    ctx.strokeStyle = textColor;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Text
    const autoSize = fontSize > 0 ? fontSize * scale : Math.max(12, Math.min(canvas.width, canvas.height) * 0.08);
    ctx.font = `600 ${autoSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
  }, [width, height, bgColor, textColor, displayText, fontSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getFullCanvas = useCallback(() => {
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext("2d")!;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = textColor;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const autoSize = fontSize > 0 ? fontSize : Math.max(14, Math.min(width, height) * 0.08);
    ctx.font = `600 ${autoSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);

    return offscreen;
  }, [width, height, bgColor, textColor, displayText, fontSize]);

  const generateSvg = useCallback(() => {
    const autoSize = fontSize > 0 ? fontSize : Math.max(14, Math.min(width, height) * 0.08);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${textColor}" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${textColor}" stroke-opacity="0.15" stroke-width="1"/>
  <text x="${width / 2}" y="${height / 2}" font-family="sans-serif" font-size="${autoSize}" font-weight="600" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${displayText}</text>
</svg>`;
  }, [width, height, bgColor, textColor, displayText, fontSize]);

  const handleDownload = useCallback(() => {
    const filename = `placeholder-${width}x${height}`;

    if (format === "svg") {
      const svg = generateSvg();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = getFullCanvas();
      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      const ext = format === "jpeg" ? "jpg" : "png";
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }, mimeType, 0.92);
    }

    toast.success(`Downloaded as ${format.toUpperCase()}`);
    ToolEvents.resultExported(format);
  }, [width, height, format, getFullCanvas, generateSvg]);

  const handleCopy = useCallback(async () => {
    try {
      const canvas = getFullCanvas();
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
      ToolEvents.resultCopied();
    } catch {
      toast.error("Failed to copy. Try downloading instead.");
    }
  }, [getFullCanvas]);

  const handlePreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    ToolEvents.toolUsed("preset");
  };

  const handleRandomize = () => {
    const randomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setBgColor(randomColor());
    setTextColor(randomColor());
    ToolEvents.toolUsed("randomize");
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Settings */}
        <div className="space-y-5">
          {/* Presets */}
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">
              Size Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.w, p.h)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    width === p.w && height === p.h
                      ? "bg-brand/15 border-brand/40 text-brand font-medium"
                      : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted hover:border-border"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground">
                Width (px)
              </label>
              <Input
                type="number"
                min={1}
                max={4096}
                value={width}
                onChange={(e) => setWidth(Math.min(4096, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground">
                Height (px)
              </label>
              <Input
                type="number"
                min={1}
                max={4096}
                value={height}
                onChange={(e) => setHeight(Math.min(4096, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground">
                Background
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Custom text */}
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">
              Custom Text{" "}
              <span className="text-muted-foreground font-normal">(optional — defaults to dimensions)</span>
            </label>
            <Input
              placeholder={`${width} × ${height}`}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          </div>

          {/* Font size */}
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">
              Font Size{" "}
              <span className="text-muted-foreground font-normal">(0 = auto)</span>
            </label>
            <Input
              type="number"
              min={0}
              max={500}
              value={fontSize}
              onChange={(e) => setFontSize(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>

          {/* Randomize */}
          <Button variant="outline" onClick={handleRandomize} className="gap-2 w-full">
            <RefreshCw className="h-4 w-4" />
            Randomize Colors
          </Button>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col items-center gap-4">
          <label className="text-sm font-medium text-foreground self-start">
            Preview
          </label>
          <div className="w-full flex items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 min-h-[280px]">
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-md max-w-full"
              style={{ imageRendering: "auto" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {width} × {height}px &middot; Aspect ratio {(width / height).toFixed(2)}:1
          </p>
        </div>
      </div>

      {/* Export controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-3 justify-center"
      >
        {/* Format selector */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["png", "jpeg", "svg"] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                format === f
                  ? "bg-brand/15 text-brand"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <Button
          onClick={handleDownload}
          className="gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25"
        >
          <Download className="h-4 w-4" />
          Download {format.toUpperCase()}
        </Button>

        <Button variant="outline" onClick={handleCopy} className="gap-2">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </motion.div>
    </div>
  );
}
