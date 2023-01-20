'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

(function (module) {
	/* global define */

	(function () {

		var hasOwn = {}.hasOwnProperty;

		function classNames() {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					if (arg.length) {
						var inner = classNames.apply(null, arg);
						if (inner) {
							classes.push(inner);
						}
					}
				} else if (argType === 'object') {
					if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
						classes.push(arg.toString());
						continue;
					}

					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else {
			window.classNames = classNames;
		}
	}());
} (classnames));

var classNames = classnames.exports;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This function debounce the received function
 * @param { function } 	func				Function to be debounced
 * @param { number } 		wait				Time to wait before execut the function
 * @param { boolean } 	immediate		Param to define if the function will be executed immediately
 */
const debounce = (func, wait, immediate) => {
    let timeout = null;
    return function debounced(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(this, args);
            }
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
};

const TooltipContent = ({ content }) => {
    return jsxRuntime.jsx("span", { dangerouslySetInnerHTML: { __html: content } });
};

const DEFAULT_TOOLTIP_ID = 'DEFAULT_TOOLTIP_ID';
const DEFAULT_CONTEXT_DATA = {
    anchorRefs: new Set(),
    activeAnchor: { current: null },
    attach: () => {
        /* attach anchor element */
    },
    detach: () => {
        /* detach anchor element */
    },
    setActiveAnchor: () => {
        /* set active anchor */
    },
};
const DEFAULT_CONTEXT_DATA_WRAPPER = {
    getTooltipData: () => DEFAULT_CONTEXT_DATA,
};
const TooltipContext = react.createContext(DEFAULT_CONTEXT_DATA_WRAPPER);
const TooltipProvider = ({ children }) => {
    const [anchorRefMap, setAnchorRefMap] = react.useState({
        [DEFAULT_TOOLTIP_ID]: new Set(),
    });
    const [activeAnchorMap, setActiveAnchorMap] = react.useState({
        [DEFAULT_TOOLTIP_ID]: { current: null },
    });
    const attach = (tooltipId, ...refs) => {
        setAnchorRefMap((oldMap) => {
            var _a;
            const tooltipRefs = (_a = oldMap[tooltipId]) !== null && _a !== void 0 ? _a : new Set();
            refs.forEach((ref) => tooltipRefs.add(ref));
            // create new object to trigger re-render
            return { ...oldMap, [tooltipId]: new Set(tooltipRefs) };
        });
    };
    const detach = (tooltipId, ...refs) => {
        setAnchorRefMap((oldMap) => {
            const tooltipRefs = oldMap[tooltipId];
            if (!tooltipRefs) {
                // tooltip not found
                // maybe thow error?
                return oldMap;
            }
            refs.forEach((ref) => tooltipRefs.delete(ref));
            // create new object to trigger re-render
            return { ...oldMap };
        });
    };
    const setActiveAnchor = (tooltipId, ref) => {
        setActiveAnchorMap((oldMap) => {
            var _a;
            if (((_a = oldMap[tooltipId]) === null || _a === void 0 ? void 0 : _a.current) === ref.current) {
                return oldMap;
            }
            // create new object to trigger re-render
            return { ...oldMap, [tooltipId]: ref };
        });
    };
    const getTooltipData = react.useCallback((tooltipId = DEFAULT_TOOLTIP_ID) => {
        var _a, _b;
        return ({
            anchorRefs: (_a = anchorRefMap[tooltipId]) !== null && _a !== void 0 ? _a : new Set(),
            activeAnchor: (_b = activeAnchorMap[tooltipId]) !== null && _b !== void 0 ? _b : { current: null },
            attach: (...refs) => attach(tooltipId, ...refs),
            detach: (...refs) => detach(tooltipId, ...refs),
            setActiveAnchor: (ref) => setActiveAnchor(tooltipId, ref),
        });
    }, [anchorRefMap, activeAnchorMap, attach, detach]);
    const context = react.useMemo(() => {
        return {
            getTooltipData,
        };
    }, [getTooltipData]);
    return jsxRuntime.jsx(TooltipContext.Provider, { value: context, children: children });
};
function useTooltip(tooltipId = DEFAULT_TOOLTIP_ID) {
    return react.useContext(TooltipContext).getTooltipData(tooltipId);
}

const TooltipWrapper = ({ tooltipId, children, className, place, content, html, variant, offset, wrapper = 'span', events, positionStrategy, delayShow, delayHide, ...restProps }, ref) => {
    const { attach, detach } = useTooltip(tooltipId);
    const anchorRef = react.useRef(null);
    const Component = wrapper;
    const setRef = (current) => {
        anchorRef.current = current;
        if (!ref)
            return;
        if (typeof ref === 'function') {
            ref(current);
        }
        else if ('current' in ref) {
            ref.current = current;
        }
    };
    react.useEffect(() => {
        attach(anchorRef);
        return () => {
            detach(anchorRef);
        };
    }, []);
    return (jsxRuntime.jsx(Component, { ref: setRef, className: classNames('react-tooltip-wrapper', className), "data-tooltip-place": place, "data-tooltip-content": content, "data-tooltip-html": html, "data-tooltip-variant": variant, "data-tooltip-offset": offset, "data-tooltip-wrapper": wrapper, "data-tooltip-events": events, "data-tooltip-position-strategy": positionStrategy, "data-tooltip-delay-show": delayShow, "data-tooltip-delay-hide": delayHide, ...restProps, children: children }));
};
var TooltipWrapper$1 = react.forwardRef(TooltipWrapper);

function getSide(placement) {
  return placement.split('-')[0];
}

function getAlignment(placement) {
  return placement.split('-')[1];
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
}

function getLengthFromAxis(axis) {
  return axis === 'y' ? 'height' : 'width';
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === 'x';
  let coords;

  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;

    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;

    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }

  switch (getAlignment(placement)) {
    case 'start':
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;

    case 'end':
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }

  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain positioning strategy.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */

const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));

  {
    if (platform == null) {
      console.error(['Floating UI: `platform` property was not passed to config. If you', 'want to use Floating UI on the web, install @floating-ui/dom', 'instead of the /core package. Otherwise, you can create your own', '`platform`: https://floating-ui.com/docs/platform'].join(' '));
    }

    if (validMiddleware.filter(_ref => {
      let {
        name
      } = _ref;
      return name === 'autoPlacement' || name === 'flip';
    }).length > 1) {
      throw new Error(['Floating UI: duplicate `flip` and/or `autoPlacement` middleware', 'detected. This will lead to an infinite loop. Ensure only one of', 'either has been passed to the `middleware` array.'].join(' '));
    }

    if (!reference || !floating) {
      console.error(['Floating UI: The reference and/or floating element was not defined', 'when `computePosition()` was called. Ensure that both elements have', 'been created and can be measured.'].join(' '));
    }
  }

  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;

  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = { ...middlewareData,
      [name]: { ...middlewareData[name],
        ...data
      }
    };

    {
      if (resetCount > 50) {
        console.warn(['Floating UI: The middleware lifecycle appears to be running in an', 'infinite loop. This is usually caused by a `reset` continually', 'being returned without a break condition.'].join(' '));
      }
    }

    if (reset && resetCount <= 50) {
      resetCount++;

      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }

        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }

        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }

      i = -1;
      continue;
    }
  }

  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}

function getSideObjectFromPadding(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}

function rectToClientRect(rect) {
  return { ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(middlewareArguments, options) {
  var _await$platform$isEle;

  if (options === void 0) {
    options = {};
  }

  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = middlewareArguments;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect: elementContext === 'floating' ? { ...rects.floating,
      x,
      y
    } : rects.reference,
    offsetParent: await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating)),
    strategy
  }) : rects[elementContext]);
  return {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
}

const min$1 = Math.min;
const max$1 = Math.max;

function within(min$1$1, value, max$1$1) {
  return max$1(min$1$1, min$1(value, max$1$1));
}

/**
 * Positions an inner element of the floating element such that it is centered
 * to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,

  async fn(middlewareArguments) {
    // Since `element` is required, we don't Partial<> the type
    const {
      element,
      padding = 0
    } = options != null ? options : {};
    const {
      x,
      y,
      placement,
      rects,
      platform
    } = middlewareArguments;

    if (element == null) {
      {
        console.warn('Floating UI: No `element` was passed to the `arrow` middleware.');
      }

      return {};
    }

    const paddingObject = getSideObjectFromPadding(padding);
    const coords = {
      x,
      y
    };
    const axis = getMainAxisFromPlacement(placement);
    const alignment = getAlignment(placement);
    const length = getLengthFromAxis(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const minProp = axis === 'y' ? 'top' : 'left';
    const maxProp = axis === 'y' ? 'bottom' : 'right';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;

    if (clientSize === 0) {
      clientSize = rects.floating[length];
    }

    const centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds

    const min = paddingObject[minProp];
    const max = clientSize - arrowDimensions[length] - paddingObject[maxProp];
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = within(min, center, max); // Make sure that arrow points at the reference

    const alignmentPadding = alignment === 'start' ? paddingObject[minProp] : paddingObject[maxProp];
    const shouldAddOffset = alignmentPadding > 0 && center !== offset && rects.reference[length] <= rects.floating[length];
    const alignmentOffset = shouldAddOffset ? center < min ? min - center : max - center : 0;
    return {
      [axis]: coords[axis] - alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset
      }
    };
  }

});

const hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, matched => hash$1[matched]);
}

function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }

  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';

  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }

  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}

const hash = {
  start: 'end',
  end: 'start'
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, matched => hash[matched]);
}

function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}

/**
 * Changes the placement of the floating element to one that will fit if the
 * initially specified `placement` does not.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }

  return {
    name: 'flip',
    options,

    async fn(middlewareArguments) {
      var _middlewareData$flip;

      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = middlewareArguments;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const side = getSide(placement);
      const isBasePlacement = side === initialPlacement;
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];

      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }

      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
        overflows.push(overflow[main], overflow[cross]);
      }

      overflowsData = [...overflowsData, {
        placement,
        overflows
      }]; // One or more sides is overflowing

      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip$, _middlewareData$flip2;

        const nextIndex = ((_middlewareData$flip$ = (_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) != null ? _middlewareData$flip$ : 0) + 1;
        const nextPlacement = placements[nextIndex];

        if (nextPlacement) {
          // Try next placement and re-run the lifecycle
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        let resetPlacement = 'bottom';

        switch (fallbackStrategy) {
          case 'bestFit':
            {
              var _overflowsData$map$so;

              const placement = (_overflowsData$map$so = overflowsData.map(d => [d, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0].placement;

              if (placement) {
                resetPlacement = placement;
              }

              break;
            }

          case 'initialPlacement':
            resetPlacement = initialPlacement;
            break;
        }

        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }

      return {};
    }

  };
};

async function convertValueToCoords(middlewareArguments, value) {
  const {
    placement,
    platform,
    elements
  } = middlewareArguments;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === 'x';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = typeof value === 'function' ? value(middlewareArguments) : value; // eslint-disable-next-line prefer-const

  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };

  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }

  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
/**
 * Displaces the floating element from its reference element.
 * @see https://floating-ui.com/docs/offset
 */

const offset = function (value) {
  if (value === void 0) {
    value = 0;
  }

  return {
    name: 'offset',
    options: value,

    async fn(middlewareArguments) {
      const {
        x,
        y
      } = middlewareArguments;
      const diffCoords = await convertValueToCoords(middlewareArguments, value);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }

  };
};

function getCrossAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/**
 * Shifts the floating element in order to keep it in view when it will overflow
 * a clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }

  return {
    name: 'shift',
    options,

    async fn(middlewareArguments) {
      const {
        x,
        y,
        placement
      } = middlewareArguments;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getSide(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];

      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min, mainAxisCoord, max);
      }

      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min, crossAxisCoord, max);
      }

      const limitedCoords = limiter.fn({ ...middlewareArguments,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return { ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }

  };
};

function isWindow(value) {
  return value && value.document && value.location && value.alert && value.setInterval;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (!isWindow(node)) {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function getNodeName(node) {
  return isWindow(node) ? '' : node ? (node.nodeName || '').toLowerCase() : '';
}

function getUAString() {
  const uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands) {
    return uaData.brands.map(item => item.brand + "/" + item.version).join(' ');
  }

  return navigator.userAgent;
}

function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function isShadowRoot(node) {
  // Browsers without `ShadowRoot` support
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isOverflowElement(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isContainingBlock(element) {
  // TODO: Try and use feature detection here instead
  const isFirefox = /firefox/i.test(getUAString());
  const css = getComputedStyle(element);
  const backdropFilter = css.backdropFilter || css.WebkitBackdropFilter; // This is non-exhaustive but covers the most common CSS properties that
  // create a containing block.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

  return css.transform !== 'none' || css.perspective !== 'none' || (backdropFilter ? backdropFilter !== 'none' : false) || isFirefox && css.willChange === 'filter' || isFirefox && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective'].some(value => css.willChange.includes(value)) || ['paint', 'layout', 'strict', 'content'].some( // TS 4.1 compat
  value => {
    const contain = css.contain;
    return contain != null ? contain.includes(value) : false;
  });
}
function isLayoutViewport() {
  // Not Safari
  return !/^((?!chrome|android).)*safari/i.test(getUAString()); // Feature detection for this fails in various ways
  // • Always-visible scrollbar or not
  // • Width of <html>, etc.
  // const vV = win.visualViewport;
  // return vV ? Math.abs(win.innerWidth / vV.scale - vV.width) < 0.5 : true;
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}

const min = Math.min;
const max = Math.max;
const round = Math.round;

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  var _win$visualViewport$o, _win$visualViewport, _win$visualViewport$o2, _win$visualViewport2;

  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  const clientRect = element.getBoundingClientRect();
  let scaleX = 1;
  let scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  const win = isElement(element) ? getWindow(element) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  const x = (clientRect.left + (addVisualOffsets ? (_win$visualViewport$o = (_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) != null ? _win$visualViewport$o : 0 : 0)) / scaleX;
  const y = (clientRect.top + (addVisualOffsets ? (_win$visualViewport$o2 = (_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) != null ? _win$visualViewport$o2 : 0 : 0)) / scaleY;
  const width = clientRect.width / scaleX;
  const height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}

function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}

function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}

function isScaled(element) {
  const rect = getBoundingClientRect(element);
  return round(rect.width) !== element.offsetWidth || round(rect.height) !== element.offsetHeight;
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(element, // @ts-ignore - checked above (TS 4.1 compat)
  isOffsetParentAnElement && isScaled(offsetParent), strategy === 'fixed');
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }

  const result = // Step into the shadow DOM of the parent of a slotted node
  node.assignedSlot || // DOM Element detected
  node.parentNode || ( // ShadowRoot detected
  isShadowRoot(node) ? node.host : null) || // Fallback
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
}

function getContainingBlock(element) {
  let currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  const window = getWindow(element);
  let offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getDimensions(element) {
  if (isHTMLElement(element)) {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  const rect = getBoundingClientRect(element);
  return {
    width: rect.width,
    height: rect.height
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);

  if (offsetParent === documentElement) {
    return rect;
  }

  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } // This doesn't appear to be need to be negated.
    // else if (documentElement) {
    //   offsets.x = getWindowScrollBarX(documentElement);
    // }

  }

  return { ...rect,
    x: rect.x - scroll.scrollLeft + offsets.x,
    y: rect.y - scroll.scrollTop + offsets.y
  };
}

function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width,
    height,
    x,
    y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  const width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  const height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width,
    height,
    x,
    y
  };
}

function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);

  if (isLastTraversableNode(parentNode)) {
    // @ts-ignore assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }

  return getNearestOverflowAncestor(parentNode);
}

function getOverflowAncestors(node, list) {
  var _node$ownerDocument;

  if (list === void 0) {
    list = [];
  }

  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  const target = isBody ? [win].concat(win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []) : scrollableAncestor;
  const updatedList = list.concat(target);
  return isBody ? updatedList : // @ts-ignore: isBody tells us target will be an HTMLElement here
  updatedList.concat(getOverflowAncestors(target));
}

function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, false, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  return {
    top,
    left,
    x: left,
    y: top,
    right: left + element.clientWidth,
    bottom: top + element.clientHeight,
    width: element.clientWidth,
    height: element.clientHeight
  };
}

function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  if (clippingAncestor === 'viewport') {
    return rectToClientRect(getViewportRect(element, strategy));
  }

  if (isElement(clippingAncestor)) {
    return getInnerBoundingClientRect(clippingAncestor, strategy);
  }

  return rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping ancestor" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingElementAncestors(element) {
  let result = getOverflowAncestors(element).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let currentNode = element;
  let currentContainingBlockComputedStyle = null; // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);

    if (computedStyle.position === 'static' && currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) && !isContainingBlock(currentNode)) {
      // Drop non-containing blocks
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration
      currentContainingBlockComputedStyle = computedStyle;
    }

    currentNode = getParentNode(currentNode);
  }

  return result;
} // Gets the maximum area that the element is visible in due to any number of
// clipping ancestors


function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

const platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getElementRects: _ref => {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    return {
      reference: getRectRelativeToOffsetParent(reference, getOffsetParent(floating), strategy),
      floating: { ...getDimensions(floating),
        x: 0,
        y: 0
      }
    };
  },
  getClientRects: element => Array.from(element.getClientRects()),
  isRTL: element => getComputedStyle(element).direction === 'rtl'
};

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain CSS positioning
 * strategy.
 */

const computePosition = (reference, floating, options) => computePosition$1(reference, floating, {
  platform,
  ...options
});

const computeTooltipPosition = async ({ elementReference = null, tooltipReference = null, tooltipArrowReference = null, place = 'top', offset: offsetValue = 10, strategy = 'absolute', }) => {
    if (!elementReference) {
        // elementReference can be null or undefined and we will not compute the position
        // eslint-disable-next-line no-console
        // console.error('The reference element for tooltip was not defined: ', elementReference)
        return { tooltipStyles: {}, tooltipArrowStyles: {} };
    }
    if (tooltipReference === null) {
        return { tooltipStyles: {}, tooltipArrowStyles: {} };
    }
    const middleware = [offset(Number(offsetValue)), flip(), shift({ padding: 5 })];
    if (tooltipArrowReference) {
        middleware.push(arrow({ element: tooltipArrowReference, padding: 5 }));
        return computePosition(elementReference, tooltipReference, {
            placement: place,
            strategy,
            middleware,
        }).then(({ x, y, placement, middlewareData }) => {
            var _a, _b;
            const styles = { left: `${x}px`, top: `${y}px` };
            const { x: arrowX, y: arrowY } = (_a = middlewareData.arrow) !== null && _a !== void 0 ? _a : { x: 0, y: 0 };
            const staticSide = (_b = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
            }[placement.split('-')[0]]) !== null && _b !== void 0 ? _b : 'bottom';
            const arrowStyle = {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                [staticSide]: '-4px',
            };
            return { tooltipStyles: styles, tooltipArrowStyles: arrowStyle };
        });
    }
    return computePosition(elementReference, tooltipReference, {
        placement: 'bottom',
        strategy,
        middleware,
    }).then(({ x, y }) => {
        const styles = { left: `${x}px`, top: `${y}px` };
        return { tooltipStyles: styles, tooltipArrowStyles: {} };
    });
};

var styles = {"tooltip":"styles-module_tooltip__mnnfp","fixed":"styles-module_fixed__7ciUi","arrow":"styles-module_arrow__K0L3T","no-arrow":"styles-module_no-arrow__KcFZN","clickable":"styles-module_clickable__Bv9o7","show":"styles-module_show__2NboJ","dark":"styles-module_dark__xNqje","light":"styles-module_light__Z6W-X","success":"styles-module_success__A2AKt","warning":"styles-module_warning__SCK0X","error":"styles-module_error__JvumD","info":"styles-module_info__BWdHW"};

const Tooltip = ({ 
// props
id, className, classNameArrow, variant = 'dark', anchorId, place = 'top', offset = 10, events = ['hover'], positionStrategy = 'absolute', wrapper: WrapperElement = 'div', children = null, delayShow = 0, delayHide = 0, float = false, noArrow = false, clickable = false, style: externalStyles, position, afterShow, afterHide, 
// props handled by controller
content, html, isOpen, setIsOpen, }) => {
    const tooltipRef = react.useRef(null);
    const tooltipArrowRef = react.useRef(null);
    const tooltipShowDelayTimerRef = react.useRef(null);
    const tooltipHideDelayTimerRef = react.useRef(null);
    const [inlineStyles, setInlineStyles] = react.useState({});
    const [inlineArrowStyles, setInlineArrowStyles] = react.useState({});
    const [show, setShow] = react.useState(false);
    const wasShowing = react.useRef(false);
    const [calculatingPosition, setCalculatingPosition] = react.useState(false);
    const lastFloatPosition = react.useRef(null);
    const { anchorRefs, setActiveAnchor: setProviderActiveAnchor } = useTooltip(id);
    const [activeAnchor, setActiveAnchor] = react.useState({ current: null });
    const hoveringTooltip = react.useRef(false);
    const handleShow = (value) => {
        if (setIsOpen) {
            setIsOpen(value);
        }
        else if (isOpen === undefined) {
            setShow(value);
        }
    };
    react.useEffect(() => {
        if (show === wasShowing.current) {
            return;
        }
        wasShowing.current = show;
        if (show) {
            afterShow === null || afterShow === void 0 ? void 0 : afterShow();
        }
        else {
            afterHide === null || afterHide === void 0 ? void 0 : afterHide();
        }
    }, [show]);
    const handleShowTooltipDelayed = () => {
        if (tooltipShowDelayTimerRef.current) {
            clearTimeout(tooltipShowDelayTimerRef.current);
        }
        tooltipShowDelayTimerRef.current = setTimeout(() => {
            handleShow(true);
        }, delayShow);
    };
    const handleHideTooltipDelayed = (delay = delayHide) => {
        if (tooltipHideDelayTimerRef.current) {
            clearTimeout(tooltipHideDelayTimerRef.current);
        }
        tooltipHideDelayTimerRef.current = setTimeout(() => {
            if (hoveringTooltip.current) {
                return;
            }
            handleShow(false);
        }, delay);
    };
    const handleShowTooltip = (event) => {
        var _a;
        if (!event) {
            return;
        }
        if (delayShow) {
            handleShowTooltipDelayed();
        }
        else {
            handleShow(true);
        }
        const target = (_a = event.currentTarget) !== null && _a !== void 0 ? _a : event.target;
        setActiveAnchor((anchor) => anchor.current === target ? anchor : { current: target });
        setProviderActiveAnchor({ current: target });
        if (tooltipHideDelayTimerRef.current) {
            clearTimeout(tooltipHideDelayTimerRef.current);
        }
    };
    const handleHideTooltip = () => {
        if (clickable) {
            // allow time for the mouse to reach the tooltip, in case there's a gap
            handleHideTooltipDelayed(delayHide || 50);
        }
        else if (delayHide) {
            handleHideTooltipDelayed();
        }
        else {
            handleShow(false);
        }
        if (tooltipShowDelayTimerRef.current) {
            clearTimeout(tooltipShowDelayTimerRef.current);
        }
    };
    const handleTooltipPosition = ({ x, y }) => {
        const virtualElement = {
            getBoundingClientRect() {
                return {
                    x,
                    y,
                    width: 0,
                    height: 0,
                    top: y,
                    left: x,
                    right: x,
                    bottom: y,
                };
            },
        };
        setCalculatingPosition(true);
        computeTooltipPosition({
            place,
            offset,
            elementReference: virtualElement,
            tooltipReference: tooltipRef.current,
            tooltipArrowReference: tooltipArrowRef.current,
            strategy: positionStrategy,
        }).then((computedStylesData) => {
            setCalculatingPosition(false);
            if (Object.keys(computedStylesData.tooltipStyles).length) {
                setInlineStyles(computedStylesData.tooltipStyles);
            }
            if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
                setInlineArrowStyles(computedStylesData.tooltipArrowStyles);
            }
        });
    };
    const handleMouseMove = (event) => {
        if (!event) {
            return;
        }
        const mouseEvent = event;
        const mousePosition = {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
        };
        handleTooltipPosition(mousePosition);
        lastFloatPosition.current = mousePosition;
    };
    const handleClickTooltipAnchor = (event) => {
        handleShowTooltip(event);
        if (delayHide) {
            handleHideTooltipDelayed();
        }
    };
    const handleClickOutsideAnchor = (event) => {
        var _a;
        if ((_a = activeAnchor.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)) {
            return;
        }
        handleShow(false);
    };
    // debounce handler to prevent call twice when
    // mouse enter and focus events being triggered toggether
    const debouncedHandleShowTooltip = debounce(handleShowTooltip, 50);
    const debouncedHandleHideTooltip = debounce(handleHideTooltip, 50);
    react.useEffect(() => {
        var _a, _b;
        const elementRefs = new Set(anchorRefs);
        const anchorById = document.querySelector(`[id='${anchorId}']`);
        if (anchorById) {
            setActiveAnchor((anchor) => anchor.current === anchorById ? anchor : { current: anchorById });
            elementRefs.add({ current: anchorById });
        }
        if (!elementRefs.size) {
            return () => null;
        }
        const enabledEvents = [];
        if (events.find((event) => event === 'click')) {
            window.addEventListener('click', handleClickOutsideAnchor);
            enabledEvents.push({ event: 'click', listener: handleClickTooltipAnchor });
        }
        if (events.find((event) => event === 'hover')) {
            enabledEvents.push({ event: 'mouseenter', listener: debouncedHandleShowTooltip }, { event: 'mouseleave', listener: debouncedHandleHideTooltip }, { event: 'focus', listener: debouncedHandleShowTooltip }, { event: 'blur', listener: debouncedHandleHideTooltip });
            if (float) {
                enabledEvents.push({
                    event: 'mousemove',
                    listener: handleMouseMove,
                });
            }
        }
        const handleMouseEnterTooltip = () => {
            hoveringTooltip.current = true;
        };
        const handleMouseLeaveTooltip = () => {
            hoveringTooltip.current = false;
            handleHideTooltip();
        };
        if (clickable) {
            (_a = tooltipRef.current) === null || _a === void 0 ? void 0 : _a.addEventListener('mouseenter', handleMouseEnterTooltip);
            (_b = tooltipRef.current) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseleave', handleMouseLeaveTooltip);
        }
        enabledEvents.forEach(({ event, listener }) => {
            elementRefs.forEach((ref) => {
                var _a;
                (_a = ref.current) === null || _a === void 0 ? void 0 : _a.addEventListener(event, listener);
            });
        });
        return () => {
            var _a, _b;
            window.removeEventListener('click', handleClickOutsideAnchor);
            if (clickable) {
                (_a = tooltipRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('mouseenter', handleMouseEnterTooltip);
                (_b = tooltipRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseleave', handleMouseLeaveTooltip);
            }
            enabledEvents.forEach(({ event, listener }) => {
                elementRefs.forEach((ref) => {
                    var _a;
                    (_a = ref.current) === null || _a === void 0 ? void 0 : _a.removeEventListener(event, listener);
                });
            });
        };
    }, [anchorRefs, activeAnchor, anchorId, events, delayHide, delayShow]);
    react.useEffect(() => {
        if (position) {
            // if `position` is set, override regular and `float` positioning
            handleTooltipPosition(position);
            return () => null;
        }
        if (float) {
            if (lastFloatPosition.current) {
                /*
                  Without this, changes to `content`, `place`, `offset`, ..., will only
                  trigger a position calculation after a `mousemove` event.
        
                  To see why this matters, comment this line, run `yarn dev` and click the
                  "Hover me!" anchor.
                */
                handleTooltipPosition(lastFloatPosition.current);
            }
            // if `float` is set, override regular positioning
            return () => null;
        }
        let elementReference = activeAnchor.current;
        if (anchorId) {
            // `anchorId` element takes precedence
            elementReference = document.querySelector(`[id='${anchorId}']`);
        }
        setCalculatingPosition(true);
        let mounted = true;
        computeTooltipPosition({
            place,
            offset,
            elementReference,
            tooltipReference: tooltipRef.current,
            tooltipArrowReference: tooltipArrowRef.current,
            strategy: positionStrategy,
        }).then((computedStylesData) => {
            if (!mounted) {
                // invalidate computed positions after remount
                return;
            }
            setCalculatingPosition(false);
            if (Object.keys(computedStylesData.tooltipStyles).length) {
                setInlineStyles(computedStylesData.tooltipStyles);
            }
            if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
                setInlineArrowStyles(computedStylesData.tooltipArrowStyles);
            }
        });
        return () => {
            mounted = false;
        };
    }, [
        show,
        isOpen,
        anchorId,
        activeAnchor,
        content,
        html,
        place,
        offset,
        positionStrategy,
        position,
    ]);
    react.useEffect(() => {
        return () => {
            if (tooltipShowDelayTimerRef.current) {
                clearTimeout(tooltipShowDelayTimerRef.current);
            }
            if (tooltipHideDelayTimerRef.current) {
                clearTimeout(tooltipHideDelayTimerRef.current);
            }
        };
    }, []);
    const hasContentOrChildren = Boolean(html || content || children);
    return (jsxRuntime.jsxs(WrapperElement, { id: id, role: "tooltip", className: classNames('react-tooltip', styles['tooltip'], styles[variant], className, {
            [styles['show']]: hasContentOrChildren && !calculatingPosition && (isOpen || show),
            [styles['fixed']]: positionStrategy === 'fixed',
            [styles['clickable']]: clickable,
        }), style: { ...externalStyles, ...inlineStyles }, ref: tooltipRef, children: [children || (html && jsxRuntime.jsx(TooltipContent, { content: html })) || content, jsxRuntime.jsx("div", { className: classNames('react-tooltip-arrow', styles['arrow'], classNameArrow, {
                    [styles['no-arrow']]: noArrow,
                }), style: inlineArrowStyles, ref: tooltipArrowRef })] }));
};

const TooltipController = ({ id, anchorId, content, html, className, classNameArrow, variant = 'dark', place = 'top', offset = 10, wrapper = 'div', children = null, events = ['hover'], positionStrategy = 'absolute', delayShow = 0, delayHide = 0, float = false, noArrow = false, clickable = false, style, position, isOpen, setIsOpen, afterShow, afterHide, }) => {
    const [tooltipContent, setTooltipContent] = react.useState(content);
    const [tooltipHtml, setTooltipHtml] = react.useState(html);
    const [tooltipPlace, setTooltipPlace] = react.useState(place);
    const [tooltipVariant, setTooltipVariant] = react.useState(variant);
    const [tooltipOffset, setTooltipOffset] = react.useState(offset);
    const [tooltipDelayShow, setTooltipDelayShow] = react.useState(delayShow);
    const [tooltipDelayHide, setTooltipDelayHide] = react.useState(delayHide);
    const [tooltipFloat, setTooltipFloat] = react.useState(float);
    const [tooltipWrapper, setTooltipWrapper] = react.useState(wrapper);
    const [tooltipEvents, setTooltipEvents] = react.useState(events);
    const [tooltipPositionStrategy, setTooltipPositionStrategy] = react.useState(positionStrategy);
    const { anchorRefs, activeAnchor } = useTooltip(id);
    const getDataAttributesFromAnchorElement = (elementReference) => {
        const dataAttributes = elementReference === null || elementReference === void 0 ? void 0 : elementReference.getAttributeNames().reduce((acc, name) => {
            var _a;
            if (name.startsWith('data-tooltip-')) {
                const parsedAttribute = name.replace(/^data-tooltip-/, '');
                acc[parsedAttribute] = (_a = elementReference === null || elementReference === void 0 ? void 0 : elementReference.getAttribute(name)) !== null && _a !== void 0 ? _a : null;
            }
            return acc;
        }, {});
        return dataAttributes;
    };
    const applyAllDataAttributesFromAnchorElement = (dataAttributes) => {
        const handleDataAttributes = {
            place: (value) => {
                var _a;
                setTooltipPlace((_a = value) !== null && _a !== void 0 ? _a : place);
            },
            content: (value) => {
                setTooltipContent(value !== null && value !== void 0 ? value : content);
            },
            html: (value) => {
                setTooltipHtml(value !== null && value !== void 0 ? value : html);
            },
            variant: (value) => {
                var _a;
                setTooltipVariant((_a = value) !== null && _a !== void 0 ? _a : variant);
            },
            offset: (value) => {
                setTooltipOffset(value === null ? offset : Number(value));
            },
            wrapper: (value) => {
                var _a;
                setTooltipWrapper((_a = value) !== null && _a !== void 0 ? _a : 'div');
            },
            events: (value) => {
                const parsed = value === null || value === void 0 ? void 0 : value.split(' ');
                setTooltipEvents(parsed !== null && parsed !== void 0 ? parsed : events);
            },
            'position-strategy': (value) => {
                var _a;
                setTooltipPositionStrategy((_a = value) !== null && _a !== void 0 ? _a : positionStrategy);
            },
            'delay-show': (value) => {
                setTooltipDelayShow(value === null ? delayShow : Number(value));
            },
            'delay-hide': (value) => {
                setTooltipDelayHide(value === null ? delayHide : Number(value));
            },
            float: (value) => {
                setTooltipFloat(value === null ? float : Boolean(value));
            },
        };
        // reset unset data attributes to default values
        // without this, data attributes from the last active anchor will still be used
        Object.values(handleDataAttributes).forEach((handler) => handler(null));
        Object.entries(dataAttributes).forEach(([key, value]) => {
            var _a;
            (_a = handleDataAttributes[key]) === null || _a === void 0 ? void 0 : _a.call(handleDataAttributes, value);
        });
    };
    react.useEffect(() => {
        setTooltipContent(content);
    }, [content]);
    react.useEffect(() => {
        setTooltipHtml(html);
    }, [html]);
    react.useEffect(() => {
        var _a;
        const elementRefs = new Set(anchorRefs);
        const anchorById = document.querySelector(`[id='${anchorId}']`);
        if (anchorById) {
            elementRefs.add({ current: anchorById });
        }
        if (!elementRefs.size) {
            return () => null;
        }
        const anchorElement = (_a = activeAnchor.current) !== null && _a !== void 0 ? _a : anchorById;
        const observerCallback = (mutationList) => {
            mutationList.forEach((mutation) => {
                var _a;
                if (!anchorElement ||
                    mutation.type !== 'attributes' ||
                    !((_a = mutation.attributeName) === null || _a === void 0 ? void 0 : _a.startsWith('data-tooltip-'))) {
                    return;
                }
                // make sure to get all set attributes, since all unset attributes are reset
                const dataAttributes = getDataAttributesFromAnchorElement(anchorElement);
                applyAllDataAttributesFromAnchorElement(dataAttributes);
            });
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(observerCallback);
        // do not check for subtree and childrens, we only want to know attribute changes
        // to stay watching `data-attributes-*` from anchor element
        const observerConfig = { attributes: true, childList: false, subtree: false };
        if (anchorElement) {
            const dataAttributes = getDataAttributesFromAnchorElement(anchorElement);
            applyAllDataAttributesFromAnchorElement(dataAttributes);
            // Start observing the target node for configured mutations
            observer.observe(anchorElement, observerConfig);
        }
        return () => {
            // Remove the observer when the tooltip is destroyed
            observer.disconnect();
        };
    }, [anchorRefs, activeAnchor, anchorId]);
    const props = {
        id,
        anchorId,
        className,
        classNameArrow,
        content: tooltipContent,
        html: tooltipHtml,
        place: tooltipPlace,
        variant: tooltipVariant,
        offset: tooltipOffset,
        wrapper: tooltipWrapper,
        events: tooltipEvents,
        positionStrategy: tooltipPositionStrategy,
        delayShow: tooltipDelayShow,
        delayHide: tooltipDelayHide,
        float: tooltipFloat,
        noArrow,
        clickable,
        style,
        position,
        isOpen,
        setIsOpen,
        afterShow,
        afterHide,
    };
    return children ? jsxRuntime.jsx(Tooltip, { ...props, children: children }) : jsxRuntime.jsx(Tooltip, { ...props });
};

exports.Tooltip = TooltipController;
exports.TooltipProvider = TooltipProvider;
exports.TooltipWrapper = TooltipWrapper$1;