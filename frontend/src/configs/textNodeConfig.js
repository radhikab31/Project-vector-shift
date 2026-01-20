// configs/textNodeConfig.js
import {Position} from "reactflow";

export const textNodeConfig = (id) => ({
  title: "Text",
  description: "Text processing node",
  color: "text",
  handles: [
    {
      id: `${id}-output`,
      type: "source",
      position: Position.Right,
    },
  ],
  fields: [
    {
      key: "text",
      label: "Text",
      type: "textarea",
      rows: 3,
      defaultValue: "{{input}}",
    },
  ],
});
