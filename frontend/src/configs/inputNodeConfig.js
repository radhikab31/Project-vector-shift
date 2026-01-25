import { Position } from 'reactflow';

export const inputNodeConfig = (id) => ({
  title: 'Input',
  description: 'Define input parameters',
  color: 'input',
  handles: [
    {
      id: `${id}-value`,
      type: 'source',
      position: Position.Right,
    }
  ],
  fields: [
    {
      key: 'inputName',
      label: 'Name',
      type: 'text',
      defaultValue: id.replace('customInput-', 'input_'),
    },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'File', 'Number', 'Boolean'],
      defaultValue: 'Text',
    }
  ]
});