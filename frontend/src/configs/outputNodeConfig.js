import { Position } from 'reactflow';

export const outputNodeConfig = (id) => ({
  title: 'Output',
  description: 'Define output parameters',
  color: 'output',
  handles: [
    {
      id: `${id}-value`,
      type: 'target',
      position: Position.Left,
    }
  ],
  fields: [
    {
      key: 'outputName',
      label: 'Name',
      type: 'text',
      defaultValue: id.replace('customOutput-', 'output_'),
    },
    {
      key: 'outputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'Image', 'JSON', 'File'],
      defaultValue: 'Text',
    }
  ]
});