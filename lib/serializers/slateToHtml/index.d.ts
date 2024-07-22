import { AnyNode } from 'domhandler';
import { SlateToDomConfig } from '../..';
type SlateToHtml = (node: any[], config?: SlateToDomConfig) => string;
type SlateToDom = (node: any[], config?: SlateToDomConfig) => AnyNode | ArrayLike<AnyNode>;
export declare const slateToHtml: SlateToHtml;
export declare const slateToDom: SlateToDom;
export {};
