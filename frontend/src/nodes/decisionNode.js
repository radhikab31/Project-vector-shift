import {BaseNode} from "./BaseNode";
import {decisionNodeConfig} from "../configs/decisionNodeConfig";

export const DecisionNode = ({id, data}) => <BaseNode id={id} data={data} config={decisionNodeConfig(id)} />;
