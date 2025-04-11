import { ButtonProps } from '../Button/types';
import { MenuProps } from '../Menu/types';
import { ReactNode } from 'react';

/**
 * Props for the Dropdown component
 */
export interface DropdownProps extends Omit<MenuProps, 'children'> {
  /**
   * The text to display on the dropdown button
   */
  label: ReactNode;
  
  /**
   * Optional icon to display on the left side of the button
   */
  icon?: ButtonProps['leadingIcon'];
  
  /**
   * Size of the dropdown button
   */
  size?: ButtonProps['size'];
  
  /**
   * Button type/style variant
   */
  buttonType?: ButtonProps['buttonType'];
  
  /**
   * Whether the dropdown is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional class names to apply to the dropdown button
   */
  className?: string;
} 