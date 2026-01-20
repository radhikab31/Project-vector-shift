// BaseNode.js
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

// Color schemes for different node types
const colorSchemes = {
  input: { bg: '#E3F2FD', border: '#1976D2', title: '#0D47A1' },
  output: { bg: '#F3E5F5', border: '#7B1FA2', title: '#4A148C' },
  llm: { bg: '#FFF3E0', border: '#F57C00', title: '#E65100' },
  text: { bg: '#E8F5E9', border: '#388E3C', title: '#1B5E20' },
  processing: { bg: '#FCE4EC', border: '#C2185B', title: '#880E4F' },
  database: { bg: '#ECEFF1', border: '#455A64', title: '#1C252C' },
  trigger: { bg: '#FFF9C4', border: '#F9A825', title: '#F57F17' },
};

export const BaseNode = ({ id, data, config }) => {
  // Extract configuration with defaults
  const {
    title = 'Node',
    description = null,
    handles = [],
    fields = [],
    styles = {},
    color = 'processing',
  } = config;

  // Get color scheme
  const scheme = colorSchemes[color] || colorSchemes.processing;

  // Dynamically create state for all fields
  const [fieldValues, setFieldValues] = useState(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.key] = data?.[field.key] ?? field.defaultValue;
    });
    return initial;
  });

  // Generic onChange handler for any field
  const handleFieldChange = (fieldKey, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Render form fields based on configuration
  const renderFields = () => {
    return fields.map(field => {
      const value = fieldValues[field.key];
      
      // Text input field
      if (field.type === 'text') {
        return (
          <div key={field.key} style={{ marginBottom: '10px' }}>
            <label style={{
              fontSize: '11px',
              display: 'block',
              fontWeight: '500',
              color: '#555',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {field.label}
            </label>
            <input 
              type="text" 
              value={value} 
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '12px',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = scheme.border}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        );
      }
      
      // Select/dropdown field
      else if (field.type === 'select') {
        return (
          <div key={field.key} style={{ marginBottom: '10px' }}>
            <label style={{
              fontSize: '11px',
              display: 'block',
              fontWeight: '500',
              color: '#555',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {field.label}
            </label>
            <select 
              value={value} 
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '12px',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                backgroundColor: '#fff',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = scheme.border}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            >
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      }

      // Textarea field
      else if (field.type === 'textarea') {
        return (
          <div key={field.key} style={{ marginBottom: '10px' }}>
            <label style={{
              fontSize: '11px',
              display: 'block',
              fontWeight: '500',
              color: '#555',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {field.label}
            </label>
            <textarea 
              value={value} 
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              rows={field.rows || 3}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '11px',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                resize: 'vertical',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = scheme.border}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        );
      }

      // Checkbox field
      else if (field.type === 'checkbox') {
        return (
          <div key={field.key} style={{ marginBottom: '10px' }}>
            <label style={{
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
            }}>
              <input 
                type="checkbox" 
                checked={value} 
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                style={{
                  cursor: 'pointer',
                  width: '16px',
                  height: '16px',
                  accentColor: scheme.border,
                }}
              />
              {field.label}
            </label>
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
    borderRadius: '12px',
    padding: '14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    transition: 'box-shadow 0.2s, transform 0.2s',
    ...styles
  };

  return (
    <div 
      style={defaultStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.12), 0 0 0 3px ${scheme.bg}`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Title */}
      <div style={{
        fontWeight: '700',
        marginBottom: '6px',
        fontSize: '13px',
        color: scheme.title,
        letterSpacing: '0.3px',
      }}>
        {title}
      </div>

      {/* Description */}
      {description && (
        <div style={{
          fontSize: '10px',
          color: '#888',
          marginBottom: '10px',
          fontStyle: 'italic',
          lineHeight: '1.4',
        }}>
          {description}
        </div>
      )}

      {/* Form Fields Container */}
      {fields.length > 0 && (
        <div style={{
          marginBottom: '8px',
          paddingTop: '8px',
          borderTop: `1px solid ${scheme.border}30`,
        }}>
          {renderFields()}
        </div>
      )}

      {/* Handles */}
      {handles.map(handle => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: scheme.border,
            border: '2px solid white',
            boxShadow: `0 0 0 2px ${scheme.border}`,
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};