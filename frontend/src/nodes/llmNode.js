import { BaseNode } from './BaseNode';
import { llmNodeConfig } from '../configs/llmNodeConfig';

export const LLMNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={llmNodeConfig(id)} />
);