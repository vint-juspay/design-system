import { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

/**
 * Available tooltip sizes
 */
export type TooltipSize = 'sm' | 'lg';

/**
 * Available tooltip arrow positions
 */
export type TooltipArrow 
  =  'default' 
  | 'right' 
  | 'left' 
  | 'bottomCenter' 
  | 'bottomLeft' 
  | 'bottomRight' 
  | 'topCenter' 
  | 'topLeft' 
  | 'topRight' 
  | 'none';

/**
 * Slot direction within the tooltip
 */
export type SlotDirection = 'left' | 'right';

/**
 * Props for the Tooltip component
 */
export interface TooltipProps {
  /** The element that will trigger the tooltip */
  children: ReactNode;
  /** Content to be displayed inside the tooltip */
  content: ReactNode;
  /** Size of the tooltip */
  size?: TooltipSize;
  /** Position of the arrow */
  arrow?: TooltipArrow;
  /** Direction to place the slot component */
  slotDirection?: SlotDirection;
  /** Whether the tooltip should display a slot component */
  hasSlot?: boolean;
  /** Custom slot component */
  slot?: React.ElementType;
  /** Tooltip provider props from Radix UI */
  providerProps?: Omit<RadixTooltip.TooltipProviderProps, 'children'>;
  /** Additional props for the tooltip root */
  rootProps?: Omit<RadixTooltip.TooltipProps, 'children'>;
  /** Additional props for the tooltip content */
  contentProps?: Omit<ComponentPropsWithoutRef<typeof RadixTooltip.Content>, 'children'>;
} 