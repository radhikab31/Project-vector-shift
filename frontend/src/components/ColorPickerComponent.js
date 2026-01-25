import {useState, useEffect, useRef} from "react";

export const ColorPickerComponent = ({colorType, value, onChange}) => {
  const canvasRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : {r: 255, g: 0, b: 0};
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imageData = canvas.getContext("2d").getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;

    const newValue = colorType === "HEX" ? rgbToHex(r, g, b) : `${r}, ${g}, ${b}`;
    onChange(newValue);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
      const hue = (x / width) * 360;
      const saturation = 100;
      const lightness = 50;

      const rgb = hslToRgb(hue, saturation, lightness);
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.fillRect(x, 0, 1, height);
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  return (
    <div className="mb-2.5">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-200 mb-1 uppercase tracking-wider block">Color Picker</label>
      <canvas ref={canvasRef} width={200} height={120} onClick={handleCanvasClick} className="w-full h-auto cursor-crosshair rounded-lg border border-purple-400/30 dark:border-purple-300/40 block mb-2 hover:border-purple-500/50 dark:hover:border-purple-200/50 transition-all duration-200" />
      <div className="flex gap-2 items-center">
        <div
          className="w-8 h-8 rounded-md border-2 border-purple-400/50 shadow-md hover:shadow-lg transition-all duration-200"
          style={{
            backgroundColor: formatColorForCSS(value),
          }}
        />
        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{formatColorForCSS(value) || "Click to pick"}</span>
      </div>
    </div>
  );
};

const formatColorForCSS = (value) => {
  if (!value) return "transparent";

  if (typeof value === "string" && value.includes(",")) {
    return `rgb(${value})`;
  }

  return value;
};
