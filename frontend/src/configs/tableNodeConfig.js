import { Position } from 'reactflow';

export const tableNodeConfig = (id) => ({
  title: 'Table',
  description: 'Create and design tables',
  color: 'table',
  handles: [
    {
      id: `${id}-output`,
      type: 'source',
      position: Position.Right,
    }
  ],
  fields: [
    {
      key: 'rows',
      label: 'Number of Rows',
      type: 'number',
      min: 0,
      max: 50,
      step: 1,
      defaultValue: 0,
    },
    {
      key: 'columns',
      label: 'Number of Columns',
      type: 'number',
      min: 0,
      max: 50,
      step: 1,
      defaultValue: 0,
    },
    {
      key: 'tableDisplay',
      label: 'Render Table',
      type: 'table',
      rowsKey: 'rows',
      columnsKey: 'columns',
      defaultValue: null,
    }
  ]
});