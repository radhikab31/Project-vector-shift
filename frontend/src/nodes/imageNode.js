import { BaseNode } from './BaseNode';
import { imageNodeConfig } from '../configs/imageNodeConfig';

export const ImageNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={imageNodeConfig(id)} />
);