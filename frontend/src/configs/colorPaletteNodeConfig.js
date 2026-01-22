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
      key: "colorPickerDisplay",
      label: "Color Picker",
      type: "colorPicker",
      colorTypeKey: "colorType",
      defaultValue: "",
    },
  ],
});
