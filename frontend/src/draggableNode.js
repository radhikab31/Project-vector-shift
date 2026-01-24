// draggableNode.js

export const DraggableNode = ({type, label}) => {
  const onDragStart = (event, nodeType) => {
    const appData = {nodeType};
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData("application/reactflow", JSON.stringify(appData));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      // className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      className={`${type} cursor-grab min-w-20 h-15 flex items-center justify-center flex-col rounded-lg bg-dark-blue dark:bg-blue-300  p-2.5`}
      draggable
    >
      <span className="text-white dark:text-dark-blue">{label}</span>
    </div>
  );
};
