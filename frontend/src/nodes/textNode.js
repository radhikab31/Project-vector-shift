import {BaseNode} from "./BaseNode";
import {textNodeConfig} from "../configs/textNodeConfig";

export const TextNode = ({id, data}) => <BaseNode id={id} data={data} config={textNodeConfig(id)} />;
