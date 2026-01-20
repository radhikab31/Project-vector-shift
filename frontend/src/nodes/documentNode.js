import { BaseNode } from './BaseNode';
import { documentNodeConfig } from '../configs/documentNodeConfig';

export const DocumentNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={documentNodeConfig(id)} />
);