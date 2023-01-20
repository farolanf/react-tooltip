import { useEffect, useRef, forwardRef, Ref, MutableRefObject } from 'react'
import classNames from 'classnames'
import { useTooltip } from './TooltipProvider'
import type { ITooltipWrapper } from './TooltipProviderTypes'

const TooltipWrapper = (
  {
    tooltipId,
    children,
    className,
    place,
    content,
    html,
    variant,
    offset,
    wrapper = 'span',
    events,
    positionStrategy,
    delayShow,
    delayHide,
    ...restProps
  }: ITooltipWrapper,
  ref: Ref<HTMLElement | null>,
) => {
  const { attach, detach } = useTooltip(tooltipId)
  const anchorRef = useRef<HTMLElement | null>(null)
  const Component = wrapper

  const setRef = (current: typeof anchorRef.current) => {
    if (!ref) return
    if (typeof ref === 'function') {
      ref(current)
    } else if ('current' in ref) {
      // eslint-disable-next-line no-param-reassign
      ;(ref as MutableRefObject<HTMLElement | null>).current = current
    }
  }

  useEffect(() => {
    setRef(anchorRef.current)
    attach(anchorRef)
    return () => {
      detach(anchorRef)
    }
  }, [])

  return (
    <Component
      ref={setRef}
      className={classNames('react-tooltip-wrapper', className)}
      data-tooltip-place={place}
      data-tooltip-content={content}
      data-tooltip-html={html}
      data-tooltip-variant={variant}
      data-tooltip-offset={offset}
      data-tooltip-wrapper={wrapper}
      data-tooltip-events={events}
      data-tooltip-position-strategy={positionStrategy}
      data-tooltip-delay-show={delayShow}
      data-tooltip-delay-hide={delayHide}
      {...restProps}
    >
      {children}
    </Component>
  )
}

export default forwardRef(TooltipWrapper)
