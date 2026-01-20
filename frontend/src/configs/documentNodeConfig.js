import { Position } from 'reactflow';

export const documentNodeConfig = (id) => ({
  title: 'Document',
  description: 'Upload PDF documents',
  color: 'document',
  handles: [
    {
      id: `${id}-output`,
      type: 'source',
      position: Position.Right,
    }
  ],
  fields: [
    {
      key: 'documentName',
      label: 'Document Name',
      type: 'text',
      placeholder: 'e.g., invoice_2024',
      defaultValue: '',
    },
    {
      key: 'documentFile',
      label: 'Upload PDF',
      type: 'file',
      accept: '.pdf,application/pdf',
      defaultValue: null,
    }
  ]
});