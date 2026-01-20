// inputNode.js
import {BaseNode} from "./BaseNode";
import {inputNodeConfig} from "../configs/inputNodeConfig";

export const InputNode = ({id, data}) => <BaseNode id={id} data={data} config={inputNodeConfig(id)} />;
