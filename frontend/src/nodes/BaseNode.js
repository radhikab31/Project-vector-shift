// BaseNode.js
import {useState, useRef, useEffect} from "react";
import {Handle, Position} from "reactflow";

// Color schemes for different node types
const colorSchemes = {
  input: {bg: "#E3F2FD", border: "#1976D2", title: "#0D47A1"},
  output: {bg: "#F3E5F5", border: "#7B1FA2", title: "#4A148C"},
  llm: {bg: "#FFF3E0", border: "#F57C00", title: "#E65100"},
  text: {bg: "#E8F5E9", border: "#388E3C", title: "#1B5E20"},
  processing: {bg: "#FCE4EC", border: "#C2185B", title: "#880E4F"},
  database: {bg: "#ECEFF1", border: "#455A64", title: "#1C252C"},
  trigger: {bg: "#FFF9C4", border: "#F9A825", title: "#F57F17"},
  image: {bg: "#FFEBEE", border: "#FF6B6B", title: "#D32F2F"},
  document: {bg: "#FFF3E0", border: "#FFA500", title: "#E65100"},
  table: {bg: "#E3F2FD", border: "#0288D1", title: "#01579B"},
  colorPalette: {bg: "#FCE4EC", border: "#E91E63", title: "#880E4F"},
  decision: {bg: "#FFF9C4", border: "#FBC02D", title: "#F57F17"},
};

// ============ HELPER COMPONENTS ============

// Color Picker Component
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

  // Draw color gradient on canvas
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
    <div style={{marginBottom: "10px"}}>
      <label className="text-2.6 block font-semibold text-zinc-500 mb-1 uppercase tracking-[0.5px]">Color Picker</label>
      <canvas ref={canvasRef} width={200} height={120} onClick={handleCanvasClick} className="w-full h-auto cursor-crosshair rounded-md border border-neutral-200 block mb-2 " />
      <div className="flex gap-2 items-center">
        <div
          className="w-7.5 h-7.5 rounded-sm border border-neutral-200"
          style={{
            backgroundColor: formatColorForCSS(value),
          }}
        />
        <span className="text-3.5 text-gray-600">{formatColorForCSS(value) || "Click to pick"}</span>
      </div>
    </div>
  );
};

// Table Component
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
    return <div className="text-2.6 text-slate-400 p-2 text-center">Set rows and columns to render table</div>;
  }

  return (
    <div className="overflow-x-auto mb-2.5 mt-2">
      <table className="w-full text-2.5 overflow-hidden bg-white rounded-sm border border-neutral-200 border-collapse">
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={`${rowIdx}-${colIdx}`} className="border border-neutral-200 py-1 px-1.5">
                  <input type="text" value={cell} onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)} className="w-full border-none p-0.5 text-2.5 outline-none" placeholder={`R${rowIdx + 1}C${colIdx + 1}`} />
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
  // Extract configuration with defaults
  const {title = "Node", description = null, handles = [], fields = [], styles = {}, color = "processing"} = config;

  // Get color scheme
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
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-2.6 block font-semibold text-neutral-600 mb-1 uppercase tracking-widest ">{field.label}</label>
            <input type="text" value={value || ""} onChange={(e) => handleFieldChange(field.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} placeholder={field.placeholder || ""} className="py-2 px-2.5 rounded-md border border-neutral-200 text-xs w-full outline-none box-border font-serif transition-[border-color] duration-200" onFocus={(e) => (e.target.style.borderColor = scheme.border)} onBlur={(e) => (e.target.style.borderColor = "#ddd")} />
          </div>
        );
      }

      // ========== NUMBER INPUT ==========
      else if (field.type === "number") {
        return (
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-2.6 block font-semibold text-neutral-600 mb-1 uppercase tracking-widest ">{field.label}</label>
            <input type="number" value={value || ""} onWheel={(e) => e.target.blur()} onChange={(e) => handleFieldChange(field.key, e.target.value ? parseInt(e.target.value) : "")} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} min={field.min || 0} max={field.max || undefined} step={field.step || 1} className="py-2 px-2.5 rounded-md border border-neutral-200 text-xs w-full outline-none box-border font-serif transition-[border-color] duration-200" onFocus={(e) => (e.target.style.borderColor = scheme.border)} onBlur={(e) => (e.target.style.borderColor = "#ddd")} />
          </div>
        );
      }

      // ========== FILE INPUT ==========
      else if (field.type === "file") {
        return (
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-2.6 block font-semibold text-neutral-600 mb-1 uppercase tracking-widest ">{field.label}</label>

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
              className="py-2 px-2.5 rounded-md border border-neutral-200 text-xs w-full outline-none box-border font-serif transition-[border-color] duration-200"
              onFocus={(e) => (e.target.style.borderColor = scheme.border)}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
            {value?.name && <div className="text-xs text-gray-600 bg-neutral-100 mb-1 p-1.5 rounded break-words">📄 {value.name}</div>}
          </div>
        );
      }

      // ========== SELECT/DROPDOWN ==========
      else if (field.type === "select") {
        return (
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-xs block font-semibold text-gray-600 mb-1 uppercase tracking-widest">{field.label}</label>
            <select value={value || ""} onChange={(e) => handleFieldChange(field.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} className="py-2 px-2.5 rounded-md border bg-white cursor-pointer border-neutral-200 text-xs w-full outline-none box-border font-serif transition-[border-color] duration-200" onFocus={(e) => (e.target.style.borderColor = scheme.border)} onBlur={(e) => (e.target.style.borderColor = "#ddd")}>
              <option value="">Select {field.label}</option>
              {field.options.map((opt) => {
                // Handle both string options and object options
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
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-xs block font-semibold text-gray-600 mb-1 uppercase tracking-widest">{field.label}</label>
            <textarea value={value || ""} onChange={(e) => handleFieldChange(field.key, e.target.value)} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} rows={field.rows || 3} placeholder={field.placeholder || ""} className="py-2 px-2.5 resize-y rounded-md border border-neutral-200 text-xs w-full outline-none box-border font-serif transition-[border-color] duration-200" onFocus={(e) => (e.target.style.borderColor = scheme.border)} onBlur={(e) => (e.target.style.borderColor = "#ddd")} />
          </div>
        );
      }

      // ========== CHECKBOX ==========
      else if (field.type === "checkbox") {
        return (
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-xs flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="cursor-pointer w-4 h-4 "
                style={{
                  accentColor: scheme.border,
                }}
              />
              {field.label}
            </label>
          </div>
        );
      }

      // ========== COLOR PICKER ==========
      else if (field.type === "colorPicker") {
        const colorType = fieldValues[field.colorTypeKey] || "RGB";
        console.log("color value", value, formatColorForCSS(value));

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
          <div key={field.key} style={{marginBottom: "10px"}}>
            <label className="text-xs block font-semibold mb-1 uppercase tracking-widest">{field.label}</label>
            <TableComponent rows={parseInt(rows) || 0} columns={parseInt(columns) || 0} />
          </div>
        );
      }

      return null;
    });
  };

  // Default node styling with enhanced design
  const defaultStyles = {
    width: 220,
    minHeight: 100,
    backgroundColor: scheme.bg,
    border: `2px solid ${scheme.border}`,
    borderRadius: "12px",
    padding: "14px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    transition: "box-shadow 0.2s, transform 0.2s",
    ...styles,
  };

  return (
    <div
      style={defaultStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.12), 0 0 0 3px ${scheme.bg}`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Title */}
      <div
        className="font-bold mb-2.5 text-sm tracking-[0.3px]"
        style={{
          color: scheme.title,
        }}
      >
        {title}
      </div>

      {/* Description */}
      {description && <div className="text-2.5 leading-3 text-gray-500 mb-2.5 italic line-">{description}</div>}

      {/* Form Fields Container */}
      {fields.length > 0 && (
        <div
          className="mb-2 pt-2"
          style={{
            borderTop: `1px solid ${scheme.border}30`,
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
          className="w-3 h-3 rounded-full border-0.5 border-white"
          style={{
            backgroundColor: scheme.border,
            boxShadow: `0 0 0 2px ${scheme.border}`,
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
