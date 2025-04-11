import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownProps } from './types';
import Button from '../Button/Button';
import Menu from '../Menu/Menu';

/**
 * Dropdown component that wraps the Menu component with a standardized button trigger
 * 
 * @component
 * @example
 * // Basic usage
 * <Dropdown 
 *   label="Actions"
 *   items={[
 *     { content: 'Edit', onSelect: () => console.log('Edit') },
 *     { content: 'Delete', onSelect: () => console.log('Delete') }
 *   ]}
 * />
 */
const Dropdown = React.forwardRef<
  React.ElementRef<typeof Menu>,
  DropdownProps
>(({
  label,
  icon,
  size = 'md',
  buttonType = 'secondary',
  disabled = false,
  className,
  items,
  align = 'center',
  side = 'bottom',
  search,
  multiSelect,
  checkboxPosition,
  rootProps,
  contentProps,
}, ref) => {
  return (
    <Menu
      ref={ref}
      items={items}
      align={align}
      side={side}
      search={search}
      multiSelect={multiSelect}
      checkboxPosition={checkboxPosition}
      rootProps={rootProps}
      contentProps={contentProps}
    >
      <Button
        buttonType={buttonType}
        size={size}
        leadingIcon={icon}
        trailingIcon={ChevronDown}
        isDisabled={disabled}
        className={className}
      >
        {label}
      </Button>
    </Menu>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown; 