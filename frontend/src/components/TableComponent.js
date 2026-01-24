import { useState } from "react";

export const TableComponent = ({rows, columns}) => {
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
