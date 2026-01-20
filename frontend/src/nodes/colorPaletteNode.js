import {BaseNode} from "./BaseNode";
import {colorPaletteNodeConfig} from "../configs/colorPaletteNodeConfig";

export const ColorPaletteNode = ({id, data}) => <BaseNode id={id} data={data} config={colorPaletteNodeConfig(id)} />;
