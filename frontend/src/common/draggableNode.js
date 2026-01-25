import {colorSchemes} from "./colorScheme";

export const DraggableNode = ({type, label}) => {
  const colorSchemeMap = {
    customInput: "input",
    llm: "llm",
    customOutput: "output",
    text: "text",
    image: "image",
    document: "document",
    table: "table",
    colorPalette: "colorPalette",
    decision: "decision",
  };

  const schemeKey = colorSchemeMap[type] || "processing";
  const scheme = colorSchemes[schemeKey];

  const getColorClass = () => {
    switch (schemeKey) {
      case "input":
        return {bg: "bg-blue-600/15", border: "border-blue-400/30", darkBg: "dark:bg-blue-600/25", darkBorder: "dark:border-blue-300/40", hover: "hover:border-blue-400/60 dark:hover:border-blue-200/60", shadow: "shadow-blue-500/20"};
      case "output":
        return {bg: "bg-purple-600/15", border: "border-purple-400/30", darkBg: "dark:bg-purple-600/25", darkBorder: "dark:border-purple-300/40", hover: "hover:border-purple-400/60 dark:hover:border-purple-200/60", shadow: "shadow-purple-500/20"};
      case "llm":
        return {bg: "bg-orange-600/15", border: "border-orange-400/30", darkBg: "dark:bg-orange-600/25", darkBorder: "dark:border-orange-300/40", hover: "hover:border-orange-400/60 dark:hover:border-orange-200/60", shadow: "shadow-orange-500/20"};
      case "text":
        return {bg: "bg-green-600/15", border: "border-green-400/30", darkBg: "dark:bg-green-600/25", darkBorder: "dark:border-green-300/40", hover: "hover:border-green-400/60 dark:hover:border-green-200/60", shadow: "shadow-green-500/20"};
      case "image":
        return {bg: "bg-red-600/15", border: "border-red-400/30", darkBg: "dark:bg-red-600/25", darkBorder: "dark:border-red-300/40", hover: "hover:border-red-400/60 dark:hover:border-red-200/60", shadow: "shadow-red-500/20"};
      case "document":
        return {bg: "bg-amber-600/15", border: "border-amber-400/30", darkBg: "dark:bg-amber-600/25", darkBorder: "dark:border-amber-300/40", hover: "hover:border-amber-400/60 dark:hover:border-amber-200/60", shadow: "shadow-amber-500/20"};
      case "table":
        return {bg: "bg-cyan-600/15", border: "border-cyan-400/30", darkBg: "dark:bg-cyan-600/25", darkBorder: "dark:border-cyan-300/40", hover: "hover:border-cyan-400/60 dark:hover:border-cyan-200/60", shadow: "shadow-cyan-500/20"};
      case "colorPalette":
        return {bg: "bg-pink-600/15", border: "border-pink-400/30", darkBg: "dark:bg-pink-600/25", darkBorder: "dark:border-pink-300/40", hover: "hover:border-pink-400/60 dark:hover:border-pink-200/60", shadow: "shadow-pink-500/20"};
      case "decision":
        return {bg: "bg-yellow-600/15", border: "border-yellow-400/30", darkBg: "dark:bg-yellow-600/25", darkBorder: "dark:border-yellow-300/40", hover: "hover:border-yellow-400/60 dark:hover:border-yellow-200/60", shadow: "shadow-yellow-500/20"};
      default:
        return {bg: "bg-purple-600/15", border: "border-purple-400/30", darkBg: "dark:bg-purple-600/25", darkBorder: "dark:border-purple-300/40", hover: "hover:border-purple-400/60 dark:hover:border-purple-200/60", shadow: "shadow-purple-500/20"};
    }
  };

  const colors = getColorClass();

  const onDragStart = (event, nodeType) => {
    const appData = {nodeType};
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData("application/reactflow", JSON.stringify(appData));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      className={`${type} cursor-grab group min-w-20 h-12 flex items-center justify-center rounded-xl p-3
        backdrop-blur-md
        ${colors.bg} ${colors.darkBg}
        border ${colors.border} ${colors.darkBorder}
        ${colors.hover}
        hover:shadow-lg ${colors.shadow}
        hover:bg-opacity-20 dark:hover:bg-opacity-30
        transition-all duration-200
        focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50
        hover:scale-105`}
      draggable
    >
      <span className={`${label === "Table" ? "ml-2.5" : ""} text-xs font-semibold text-gray-800 dark:text-gray-100 text-center leading-snug group-hover:text-gray-900 dark:group-hover:text-gray-50 transition-colors duration-200`}>{label}</span>
    </div>
  );
};
