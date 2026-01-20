// outputNode.js
import { BaseNode } from './BaseNode';
import { outputNodeConfig } from '../configs/outputNodeConfig';

export const OutputNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={outputNodeConfig(id)} />
);