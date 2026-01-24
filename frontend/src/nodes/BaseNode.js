import {useState, useRef, useEffect} from "react";
import {Handle, Position} from "reactflow";
import {useColorMode} from "../hooks/useColorMode";
import {colorSchemes} from "../colorScheme";
const ColorPickerComponent = ({colorType, value, onChange}) => {
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

    // Create horizontal rainbow gradient
    for (let x = 0; x < width; x++) {
      const hue = (x / width) * 360;
      const saturation = 100;
      const lightness = 50;

      const rgb = hslToRgb(hue, saturation, lightness);
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.fillRect(x, 0, 1, height);
    }

    // Add brightness gradient (top = bright, bottom = dark)
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

// Table Component with glassmorphism styling
const TableComponent = ({rows, columns}) => {
  const [tableData, setTableData] = useState(() => {
    const data = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push("");
      }
      data.push(row);
    }
    return data;
  });

  const handleCellChange = (rowIdx, colIdx, value) => {
    const newData = [...tableData];
    newData[rowIdx][colIdx] = value;
    setTableData(newData);
  };

  if (rows === 0 || columns === 0) {
    return <div className="text-xs text-slate-400 dark:text-slate-500 p-3 text-center bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700/50">Set rows and columns to render table</div>;
  }

  return (
    <div className="overflow-x-auto mb-2.5 mt-2">
      <table className="w-full text-xs bg-white dark:bg-slate-900/50 rounded-lg border border-purple-400/20 dark:border-purple-300/20 border-collapse overflow-hidden backdrop-blur-sm">
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-purple-100/20 dark:hover:bg-purple-900/20 transition-colors duration-150">
              {row.map((cell, colIdx) => (
                <td key={`${rowIdx}-${colIdx}`} className="border border-purple-400/20 dark:border-purple-300/20 py-1.5 px-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-150">
                  <input type="text" value={cell} onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)} className="w-full border-none bg-transparent p-0.5 text-xs outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder={`R${rowIdx + 1}C${colIdx + 1}`} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============ MAIN BASENODE COMPONENT ============

export const BaseNode = ({id, data, config}) => {
  const {colorMode} = useColorMode();

  // Extract configuration with defaults
  const {title = "Node", description = null, handles = [], fields = [], styles = {}, color = "processing"} = config;

  // Get color scheme from imported colorSchemes object
  const scheme = colorSchemes[color] || colorSchemes.processing;

  // Dynamically create state for all fields
  const [fieldValues, setFieldValues] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.key] = data?.[field.key] ?? field.defaultValue;
    });
    return initial;
  });

  // Generic onChange handler for any field
  const handleFieldChange = (fieldKey, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // Render form fields based on configuration
  const renderFields = () => {
    return fields.map((field) => {
      const value = fieldValues[field.key];

      // Check if field should be shown (conditional rendering)
      if (field.conditional && field.showWhen) {
        if (!field.showWhen(fieldValues)) {
          return null;
        }
      }

      // ========== TEXT INPUT ==========
      if (field.type === "text") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <input type="text" value={value || ""} onChange={(e) => handleFieldChange(field.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} placeholder={field.placeholder || ""} className="py-2 px-2.5 rounded-lg border border-purple-400/30 dark:border-purple-300/40 text-xs w-full outline-none box-border bg-white/80 dark:bg-purple-900/20 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-400/80 dark:focus:border-purple-200/80 focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 focus:scale-105 transition-all duration-200 hover:border-purple-400/50 dark:hover:border-purple-200/50" />
          </div>
        );
      }

      // ========== NUMBER INPUT ==========
      else if (field.type === "number") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <input
              type="number"
              value={value || ""}
              onWheel={(e) => e.target.blur()}
              onChange={(e) => handleFieldChange(field.key, e.target.value ? parseInt(e.target.value) : "")}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              min={field.min || 0}
              max={field.max || undefined}
              step={field.step || 1}
              className="py-2 px-2.5 rounded-lg border border-purple-400/30 dark:border-purple-300/40 text-xs w-full outline-none box-border bg-white/80 dark:bg-purple-200/20 backdrop-blur-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-400/80 dark:focus:border-purple-200/80 focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 focus:scale-105 transition-all duration-200 hover:border-purple-400/50 dark:hover:border-purple-200/50"
            />
          </div>
        );
      }

      // ========== FILE INPUT ==========
      else if (field.type === "file") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <input
              type="file"
              accept={field.accept || "*"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFieldChange(field.key, {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file: file,
                  });
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="py-2 px-2.5 rounded-lg border border-purple-400/30 dark:border-purple-300/40 text-xs w-full outline-none box-border bg-white/80 dark:bg-purple-900/20 backdrop-blur-sm text-gray-900 dark:text-gray-200 focus:border-purple-400/80 dark:focus:border-purple-200/80 focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 transition-all duration-200 hover:border-purple-400/50 dark:hover:border-purple-200/50"
            />
            {value?.name && <div className="text-xs text-gray-700 dark:text-gray-300 bg-purple-100/40 dark:bg-purple-900/30 mb-1.5 p-1.5 rounded-lg break-words border border-purple-300/30 dark:border-purple-400/30">📄 {value.name}</div>}
          </div>
        );
      }

      // ========== SELECT/DROPDOWN ==========
      else if (field.type === "select") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <select value={value || ""} onChange={(e) => handleFieldChange(field.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} className="py-2 px-2.5 rounded-lg border border-purple-400/30 dark:border-purple-300/40 bg-white dark:bg-purple-900/20 cursor-pointer text-xs w-full outline-none box-border backdrop-blur-sm text-gray-900 dark:text-gray-200 focus:border-purple-400/80 dark:focus:border-purple-200/80 focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 transition-all duration-200 hover:border-purple-400/50 dark:hover:border-purple-200/50">
              <option value="">Select {field.label}</option>
              {field.options.map((opt) => {
                const optionValue = typeof opt === "object" ? opt.value : opt;
                const optionLabel = typeof opt === "object" ? opt.label : opt;
                return (
                  <option key={optionValue} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </div>
        );
      }

      // ========== TEXTAREA ==========
      else if (field.type === "textarea") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <textarea value={value || ""} onChange={(e) => handleFieldChange(field.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} rows={field.rows || 3} placeholder={field.placeholder || ""} className="py-2 px-2.5 resize-none rounded-lg border border-purple-400/30 dark:border-purple-300/40 text-xs w-full outline-none box-border bg-white/80 dark:bg-purple-900/20 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-400/80 dark:focus:border-purple-200/80 focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 transition-all duration-200 hover:border-purple-400/50 dark:hover:border-purple-200/50" />
          </div>
        );
      }

      // ========== CHECKBOX ==========
      else if (field.type === "checkbox") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs flex items-center gap-2 cursor-pointer select-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150">
              <input type="checkbox" checked={value || false} onChange={(e) => handleFieldChange(field.key, e.target.checked)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} className="cursor-pointer w-4 h-4 rounded accent-purple-600 dark:accent-purple-400" />
              {field.label}
            </label>
          </div>
        );
      }

      // ========== COLOR PICKER ==========
      else if (field.type === "colorPicker") {
        const colorType = fieldValues[field.colorTypeKey] || "RGB";
        return (
          <div key={field.key}>
            <ColorPickerComponent colorType={colorType} value={value || ""} onChange={(newValue) => handleFieldChange(field.key, newValue)} />
          </div>
        );
      }

      // ========== TABLE ==========
      else if (field.type === "table") {
        const rows = fieldValues[field.rowsKey] || 0;
        const columns = fieldValues[field.columnsKey] || 0;
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <TableComponent rows={parseInt(rows) || 0} columns={parseInt(columns) || 0} />
          </div>
        );
      }

      return null;
    });
  };

  // Determine colors based on mode
  const bgColor = colorMode === "dark" ? scheme.darkBg : scheme.lightBg;
  const borderColor = colorMode === "dark" ? scheme.darkBorder : scheme.lightBorder;
  const titleColor = colorMode === "dark" ? scheme.darkTitle : scheme.title;

  return (
    <div
      className="w-41 min-h-24 rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 hover:border-purple-400/50 dark:hover:border-purple-300/50 p-3.5 backdrop-blur-md bg-gradient-to-br from-purple-600/10 to-purple-800/5 dark:from-purple-600/15 dark:to-purple-800/10"
      style={{
        borderColor: borderColor,
        backgroundColor: bgColor,
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Title */}
      <div className="font-bold mb-1.5 text-sm tracking-wide" style={{color: titleColor}}>
        {title}
      </div>

      {/* Description */}
      {description && <div className="text-2xs leading-5 text-gray-600 dark:text-gray-200 mb-2 font-medium">{description}</div>}

      {/* Form Fields Container */}
      {fields.length > 0 && (
        <div
          className="mb-2 pt-2 border-t"
          style={{
            borderTopColor: `${borderColor}50`,
          }}
        >
          {renderFields()}
        </div>
      )}

      {/* Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          className="w-3 h-3 rounded-full border-2 border-white shadow-md hover:shadow-lg hover:scale-150 transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: colorMode === "dark" ? scheme.darkBorder : scheme.border,
            boxShadow: `0 0 8px ${colorMode === "dark" ? scheme.darkBorder : scheme.border}50, 0 0 0 2px white`,
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};

const formatColorForCSS = (value) => {
  if (!value) return "transparent";

  // Convert RGB format: "255, 128, 64" → "rgb(255, 128, 64)"
  if (typeof value === "string" && value.includes(",")) {
    return `rgb(${value})`;
  }

  // Keep HEX format unchanged: "#FF8040" → "#FF8040"
  return value;
};
