import { Position } from 'reactflow';

export const llmNodeConfig = (id) => ({
  title: 'LLM',
  description: 'Language Model Node',
  color: 'llm',
  handles: [
    {
      id: `${id}-system`,
      type: 'target',
      position: Position.Left,
      style: { top: '33%' }
    },
    {
      id: `${id}-prompt`,
      type: 'target',
      position: Position.Left,
      style: { top: '66%' }
    },
    {
      id: `${id}-response`,
      type: 'source',
      position: Position.Right,
    }
  ],
  fields: [
    {
      key: 'model',
      label: 'Model',
      type: 'select',
      options: ['GPT-4', 'GPT-3.5', 'Claude', 'Llama'],
      defaultValue: 'GPT-4',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      type: 'text',
      defaultValue: '0.7',
    }
  ]
});