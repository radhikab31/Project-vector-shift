import { BaseNode } from './BaseNode';
import { tableNodeConfig } from '../configs/tableNodeConfig';

export const TableNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={tableNodeConfig(id)} />
);