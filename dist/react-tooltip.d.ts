import * as react from 'react';
import react__default, { ElementType, ReactNode, CSSProperties, PropsWithChildren } from 'react';

type PlacesType = 'top' | 'right' | 'bottom' | 'left'

type VariantType = 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'

type WrapperType = ElementType | 'div' | 'span'

type ChildrenType = Element | ElementType | ReactNode

type EventsType = 'hover' | 'click'

type PositionStrategy = 'absolute' | 'fixed'

type DataAttribute =
  | 'place'
  | 'content'
  | 'html'
  | 'variant'
  | 'offset'
  | 'wrapper'
  | 'events'
  | 'position-strategy'
  | 'delay-show'
  | 'delay-hide'
  | 'float'

interface IPosition {
  x: number
  y: number
}

interface ITooltipController {
  className?: string
  classNameArrow?: string
  content?: string
  html?: string
  place?: PlacesType
  offset?: number
  id?: string
  variant?: VariantType
  anchorId?: string
  wrapper?: WrapperType
  children?: ChildrenType
  events?: EventsType[]
  positionStrategy?: PositionStrategy
  delayShow?: number
  delayHide?: number
  float?: boolean
  noArrow?: boolean
  clickable?: boolean
  style?: CSSProperties
  position?: IPosition
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
  afterShow?: () => void
  afterHide?: () => void
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-tooltip-place'?: PlacesType
    'data-tooltip-content'?: string
    'data-tooltip-html'?: string
    'data-tooltip-variant'?: VariantType
    'data-tooltip-offset'?: number
    'data-tooltip-wrapper'?: WrapperType
    'data-tooltip-events'?: EventsType[]
    'data-tooltip-position-strategy'?: PositionStrategy
    'data-tooltip-delay-show'?: number
    'data-tooltip-delay-hide'?: number
    'data-tooltip-float'?: boolean
  }
}

interface ITooltipWrapper {
  tooltipId?: string
  children: ReactNode
  className?: string

  place?: ITooltipController['place']
  content?: ITooltipController['content']
  html?: ITooltipController['html']
  variant?: ITooltipController['variant']
  offset?: ITooltipController['offset']
  wrapper?: ITooltipController['wrapper']
  events?: ITooltipController['events']
  positionStrategy?: ITooltipController['positionStrategy']
  delayShow?: ITooltipController['delayShow']
  delayHide?: ITooltipController['delayHide']
}

declare const TooltipController: ({ id, anchorId, content, html, className, classNameArrow, variant, place, offset, wrapper, children, events, positionStrategy, delayShow, delayHide, float, noArrow, clickable, style, position, isOpen, setIsOpen, afterShow, afterHide, }: ITooltipController) => JSX.Element;

declare const TooltipProvider: react__default.FC<PropsWithChildren>;

declare const _default: react.ForwardRefExoticComponent<ITooltipWrapper & react.RefAttributes<HTMLElement>>;

export { ChildrenType, DataAttribute, EventsType, IPosition, ITooltipController as ITooltip, ITooltipWrapper, PlacesType, PositionStrategy, TooltipController as Tooltip, TooltipProvider, _default as TooltipWrapper, VariantType, WrapperType };
