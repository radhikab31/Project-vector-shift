import { Position } from 'reactflow';

export const imageNodeConfig = (id) => ({
  title: 'Image',
  description: 'Upload and process images',
  color: 'image',
  handles: [
    {
      id: `${id}-output`,
      type: 'source',
      position: Position.Right,
    }
  ],
  fields: [
    {
      key: 'imageName',
      label: 'Image Name',
      type: 'text',
      placeholder: 'e.g., product_photo',
      defaultValue: '',
    },
    {
      key: 'imageFile',
      label: 'Upload Image',
      type: 'file',
      accept: '.jpeg,.jpg,.png,image/jpeg,image/png',
      defaultValue: null,
    }
  ]
});