import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';

import { styles } from '../../style';

import { View } from './View';

type TooltipProps = Partial<ComponentProps<typeof AriaTooltip>> & {
  children: ReactNode;
  content: ReactNode;
  triggerProps?: Partial<ComponentProps<typeof TooltipTrigger>>;
};

export const Tooltip = ({
  children,
  content,
  triggerProps = {},
  ...props
}: TooltipProps) => {
  const triggerRef = useRef(null);
  const [hover, setHover] = useState(false);

  const [delayHandler, setDelayHandler] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleMouseEnter = useCallback(() => {
    const timeout = setTimeout(() => {
      setHover(true);
    }, triggerProps.delay ?? 300);

    setDelayHandler(timeout);
    return () => {
      clearTimeout(timeout);
    };
  }, [triggerProps.delay]);

  const handleMouseLeave = useCallback(() => {
    if (delayHandler) {
      clearTimeout(delayHandler);
    }

    setHover(false);
  }, [delayHandler]);

  // Force closing the tooltip whenever the disablement state changes
  useEffect(() => {
    setHover(false);
  }, [triggerProps.isDisabled]);

  return (
    <View
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TooltipTrigger
        isOpen={hover && !triggerProps.isDisabled}
        {...triggerProps}
      >
        {children}

        <AriaTooltip triggerRef={triggerRef} style={styles.tooltip} {...props}>
          {content}
        </AriaTooltip>
      </TooltipTrigger>
    </View>
  );
};
