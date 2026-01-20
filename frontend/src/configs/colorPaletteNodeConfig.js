import {Position} from "reactflow";

export const colorPaletteNodeConfig = (id) => ({
  title: "Color Palette",
  description: "Pick and convert colors",
  color: "colorPalette",
  handles: [
    {
      id: `${id}-output`,
      type: "source",
      position: Position.Right,
    },
  ],
  fields: [
    {
      key: "colorType",
      label: "Color Format",
      type: "select",
      options: ["RGB", "HEX"],
      defaultValue: "RGB",
    },
    {
      key: "colorValue",
      label: "Color Value",
      type: "text",
      placeholder: "RGB: rgb(255, 128, 64) or HEX: #FF8040",
      defaultValue: "",
    },
    {
      key: "colorPickerDisplay",
      label: "Color Picker",
      type: "colorPicker",
      colorTypeKey: "colorType",
      defaultValue: "",
    },
  ],
});
