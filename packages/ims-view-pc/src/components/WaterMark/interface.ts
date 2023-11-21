export interface IWaterMarkProps {
  width?: number;
  height?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  font?: string;
  content?: string;
  rotate?: number;
  zIndex?: number;
  children?: React.ReactNode;
  [props: string]: IWaterMarkProps[keyof IWaterMarkProps];
}
