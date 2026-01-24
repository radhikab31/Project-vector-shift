import {useState, useRef, useEffect, useCallback} from "react";
import {Handle, Position, useUpdateNodeInternals} from "reactflow";

import {useColorMode} from "../hooks/useColorMode";
import {colorSchemes} from "../colorScheme";
import {useStore} from "../store";
import {extractVariables} from "../utils/variableParser";
import {ColorPickerComponent} from "../components/ColorPickerComponent";
import {TableComponent} from "../components/TableComponent";
import {useDarkMode} from "../hooks/useDarkMode";

export const BaseNode = ({id, data, config}) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const {colorMode} = useColorMode();
  const updateNodeSize = useStore((state) => state.updateNodeSize);
  const isDark = useDarkMode();

  const {title = "Node", description = null, handles = [], fields = [], styles = {}, color = "processing"} = config;
  const scheme = colorSchemes[color] || colorSchemes.processing;

  const [fieldValues, setFieldValues] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.key] = data?.[field.key] ?? field.defaultValue;
    });
    return initial;
  });

  const [extractedVariables, setExtractedVariables] = useState([]);
  const textareaRef = useRef(null);

  // ==================== PART 3: VARIABLE EXTRACTION EFFECT ====================
  useEffect(() => {
    const textField = fields.find((f) => f.type === "textarea" && f.key === "text");

    if (textField) {
      const textValue = fieldValues[textField.key] || "";
      const variables = extractVariables(textValue);
      setExtractedVariables(variables);
    }
  }, [fieldValues, fields]);

  // ==================== PART 3: AUTO-SIZING EFFECT ====================
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${newHeight}px`;

    const contentWidth = Math.max(200, textarea.scrollWidth + 40);
    const contentHeight = newHeight + 80;

    updateNodeSize(id, contentWidth, contentHeight);
  }, [fieldValues, id, updateNodeSize]);

  // ==================== DEBUG: LOG HANDLE INFORMATION ====================
  useEffect(() => {
    console.log("📊 BaseNode Debug Info:");
    console.log("  Node ID:", id);
    console.log("  Node Title:", title);
    const textField = fields.find((f) => f.key === "text");
    console.log("  Text field value:", textField ? fieldValues[textField.key] : "N/A");
    console.log("  Extracted Variables:", extractedVariables);
    console.log(
      "  Dynamic Handle IDs:",
      extractedVariables.map((v) => `${id}-var-${v}`),
    );
    console.log("  Static Handles:", handles);
  }, [id, title, fieldValues, extractedVariables, handles, fields]);

  // ==================== FIX: FORCE REACT FLOW TO UPDATE HANDLES ====================
  // When new dynamic handles are created, React Flow needs to recalculate positions
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      console.log("🔄 Dispatched resize event to update React Flow handles");
    }, 50);

    return () => clearTimeout(timer);
  }, [extractedVariables]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [extractedVariables, id, updateNodeInternals]);

  const handleFieldChange = useCallback((fieldKey, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }, []);

  const renderFields = () => {
    return fields.map((field) => {
      const value = fieldValues[field.key];

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

      // ========== TEXTAREA WITH AUTO-SIZING (PART 3) ==========
      else if (field.type === "textarea") {
        return (
          <div key={field.key} className="mb-2.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider block">{field.label}</label>
            <textarea
              ref={textareaRef}
              value={value || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              rows={field.rows || 3}
              placeholder={field.placeholder || ""}
              style={{
                resize: "none",
                overflow: "hidden",
                minHeight: "60px",
              }}
              className="py-2 px-2.5 rounded-lg border border-purple-400/30 dark:border-purple-300/40 text-xs w-full outline-none box-border bg-white/80 dark:bg-purple-900/20 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-400/80 dark:focus:border-purple-200/80 focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 transition-all duration-200 hover:border-purple-400/50 dark:hover:border-purple-200/50"
            />
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

      // ========== COLOR PICKER (MODULARIZED) ==========
      else if (field.type === "colorPicker") {
        const colorType = fieldValues[field.colorTypeKey] || "RGB";
        return (
          <div key={field.key}>
            <ColorPickerComponent colorType={colorType} value={value || ""} onChange={(newValue) => handleFieldChange(field.key, newValue)} />
          </div>
        );
      }

      // ========== TABLE (MODULARIZED) ==========
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
  const bgColor = isDark ? scheme.darkBg : scheme.lightBg;
  const borderColor = isDark ? scheme.darkBorder : scheme.lightBorder;
  const titleColor = isDark ? scheme.darkTitle : scheme.title;

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

      {/* ==================== PART 3: DYNAMIC VARIABLE HANDLES (FIXED WITH VALIDATION) ==================== */}
      {extractedVariables.map((varName, index) => {
        const safeVar = varName.replace(/[^a-zA-Z0-9_-]/g, "");
        const handleId = `${id}-var-${safeVar}`;

        return (
          <Handle
            key={handleId}
            type="target"
            position={Position.Left}
            id={handleId}
            className="w-3 h-3 rounded-full border-2 border-white shadow-md hover:shadow-lg hover:scale-150 transition-all duration-300 cursor-pointer"
            style={{
              top: `${((index + 1) / (extractedVariables.length + 1)) * 100}%`,
              backgroundColor: isDark ? scheme.darkBorder : scheme.border,
              boxShadow: `0 0 8px ${isDark ? scheme.darkBorder : scheme.border}50, 0 0 0 2px white`,
            }}
            title={`Connect to ${varName}`}
            isConnectable={true}
            isValidConnection={(connection) => {
              console.log("🔗 Connection validation:", {
                from: connection.source,
                fromHandle: connection.sourceHandle,
                to: connection.target,
                toHandle: connection.targetHandle,
              });
              return true;
            }}
          />
        );
      })}

      {/* Static Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          className="w-3 h-3 rounded-full border-2 border-white shadow-md hover:shadow-lg hover:scale-150 transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: isDark ? scheme.darkBorder : scheme.border,
            boxShadow: `0 0 8px ${isDark ? scheme.darkBorder : scheme.border}50, 0 0 0 2px white`,
            ...handle.style,
          }}
          isConnectable={true}
        />
      ))}
    </div>
  );
};
