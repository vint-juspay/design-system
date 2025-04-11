import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import { MenuProps, MenuItemWithSeparatorProps, MenuStandardProps, MenuCheckboxProps } from './types';
import { 
  getMenuClassNames, 
  getMenuItemClassNames, 
  getLabelClassNames, 
  getSeparatorClassNames, 
  getCheckClassNames, 
  getIconClassNames,
  getSubtextClassNames,
  getColorClassNames,
  getShortcutClassNames,
  getThreeColumnLayoutClassNames,
  getColumnContentClassNames,
  getFlexColumnClassNames
} from './utils';
import { themeConfig } from '../../themeConfig';
import Search, { filterItems } from '../common/Search';
import Checkbox from '../common/Checkbox';
import { cn } from '../../utils';

/**
 * Menu component built on top of Radix UI's dropdown menu primitive
 * Provides contextual dropdown menus for navigation and actions
 * 
 * @component
 * @example
 * // Basic usage
 * <Menu 
 *   items={[
 *     { content: 'Edit', icon: PencilIcon, onSelect: () => console.log('Edit') },
 *     { content: 'Duplicate', icon: CopyIcon, onSelect: () => console.log('Duplicate') }
 *   ]}
 * >
 *   <Button>Actions</Button>
 * </Menu>
 */
const Menu = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  MenuProps
>(({
  children,
  items,
  align = 'center',
  side = 'bottom',
  search,
  multiSelect,
  checkboxPosition = 'left',
  rootProps,
  contentProps,
}, ref) => {
  const menuClassNames = getMenuClassNames();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(multiSelect?.selectedValues || []);
  
  // Reset search query when menu is closed
  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Update selectedValues if the prop changes
  React.useEffect(() => {
    if (multiSelect?.selectedValues) {
      setSelectedValues(multiSelect.selectedValues);
    }
  }, [multiSelect?.selectedValues]);

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!search?.enabled || !searchQuery) {
      return items;
    }
    return filterItems(items, searchQuery);
  }, [items, searchQuery, search?.enabled]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle multi-select checkbox changes
  const handleCheckboxListChange = (value: string, checked: boolean, event?: React.MouseEvent) => {
    // Prevent the dropdown from closing when checkbox items are clicked
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const newValues = checked 
      ? [...selectedValues, value]
      : selectedValues.filter(v => v !== value);
    
    setSelectedValues(newValues);
    
    if (multiSelect?.onSelectionChange) {
      multiSelect.onSelectionChange(newValues);
    }
  };

  // Handle dropdown state changes
  const handleOpenChange = (open: boolean) => {
    // Only update the state if it's different from the current state
    if (open !== isOpen) {
      setIsOpen(open);
      if (rootProps?.onOpenChange) {
        rootProps.onOpenChange(open);
      }
    }
  };

  // Render a menu item based on its type
  const renderMenuItem = (item: MenuItemWithSeparatorProps, index: number) => {
    if ('isSeparator' in item && item.isSeparator) {
      return <DropdownMenu.Separator key={`separator-${index}`} className={getSeparatorClassNames()} />;
    }

    if ('isLabel' in item && item.isLabel) {
      return (
        <DropdownMenu.Label key={`label-${index}`} className={getLabelClassNames()}>
          {item.content}
        </DropdownMenu.Label>
      );
    }

    // Handle standard item with onSelect (not a checkbox)
    if ('onSelect' in item && 
        !('isCheckbox' in item) && 
        !('isCheckboxListItem' in item)) {
      // Standard menu item with onSelect (should close menu)
      return (
        <DropdownMenu.Item
          key={`item-${index}`}
          onSelect={item.onSelect}
          disabled={'disabled' in item ? item.disabled : false}
          className={cn(
            getMenuItemClassNames('disabled' in item ? item.disabled : false), 
            getColorClassNames('color' in item ? item.color : undefined)
          )}
        >
          <div className={getThreeColumnLayoutClassNames()}>
            {'icon' in item && item.icon && <item.icon className={getIconClassNames()} />}
            <div className={getColumnContentClassNames()}>
              {'subtext' in item && item.subtext ? (
                <div className={getFlexColumnClassNames()}>
                  <div>{item.content}</div>
                  <div className={getSubtextClassNames()}>{item.subtext}</div>
                </div>
              ) : (
                item.content
              )}
            </div>
            {'shortcut' in item && item.shortcut && (
              <div className={getShortcutClassNames()}>{item.shortcut}</div>
            )}
          </div>
        </DropdownMenu.Item>
      );
    }

    if ('isCheckbox' in item && item.isCheckbox) {
      if ('isCheckboxListItem' in item && item.isCheckboxListItem && 'value' in item && item.value && multiSelect?.enabled) {
        const isChecked = selectedValues.includes(item.value);
        return (
          <DropdownMenu.Item
            key={`checkbox-list-${index}`}
            disabled={'disabled' in item ? item.disabled : false}
            className={getCheckClassNames()}
            // This prevents the menu from closing when a checkbox is clicked
            onSelect={(event) => {
              event.preventDefault();
              handleCheckboxListChange(item.value!, !isChecked, event as any);
            }}
          >
            {checkboxPosition === 'left' ? (
              <div className={themeConfig.euler.menu.layout.container}>
                <Checkbox 
                  checked={isChecked}
                  disabled={'disabled' in item ? item.disabled : false}
                  size="sm"
                  position="left"
                  onCheckedChange={(checked) => {
                    handleCheckboxListChange(item.value!, !!checked);
                  }}
                  className={themeConfig.euler.menu.layout.checkboxLeft}
                >
                  <div className={themeConfig.euler.menu.layout.content}>
                    {'icon' in item && item.icon && <item.icon className={getIconClassNames()} />}
                    {item.content}
                  </div>
                </Checkbox>
              </div>
            ) : (
              <div className={themeConfig.euler.menu.layout.container}>
                <div className={themeConfig.euler.menu.layout.content}>
                  {'icon' in item && item.icon && <item.icon className={getIconClassNames()} />}
                  {item.content}
                </div>
                <Checkbox 
                  checked={isChecked}
                  disabled={'disabled' in item ? item.disabled : false}
                  size="sm"
                  onCheckedChange={(checked) => {
                    handleCheckboxListChange(item.value!, !!checked);
                  }}
                  className={themeConfig.euler.menu.layout.checkboxRight}
                />
              </div>
            )}
          </DropdownMenu.Item>
        );
      }
      
      const checkboxItem = item as MenuCheckboxProps;
      return (
        <DropdownMenu.CheckboxItem
          key={`checkbox-${index}`}
          checked={checkboxItem.checked}
          onCheckedChange={checkboxItem.onSelect as unknown as (checked: boolean) => void}
          disabled={'disabled' in checkboxItem ? checkboxItem.disabled : false}
          className={getCheckClassNames()}
        >
          {checkboxPosition === 'left' ? (
            <div className={themeConfig.euler.menu.layout.container}>
              <Checkbox 
                checked={checkboxItem.checked}
                disabled={'disabled' in checkboxItem ? checkboxItem.disabled : false}
                size="sm"
                position="left"
                onCheckedChange={() => {}}
              >
                <div className={themeConfig.euler.menu.layout.content}>
                  {'icon' in checkboxItem && checkboxItem.icon && <checkboxItem.icon className={getIconClassNames()} />}
                  {checkboxItem.content}
                </div>
              </Checkbox>
            </div>
          ) : (
            <div className={themeConfig.euler.menu.layout.container}>
              <div className={themeConfig.euler.menu.layout.content}>
                {'icon' in checkboxItem && checkboxItem.icon && <checkboxItem.icon className={getIconClassNames()} />}
                {checkboxItem.content}
              </div>
              <Checkbox 
                checked={checkboxItem.checked}
                disabled={'disabled' in checkboxItem ? checkboxItem.disabled : false}
                size="sm"
                onCheckedChange={() => {}}
                className={themeConfig.euler.menu.layout.checkboxRight}
              />
            </div>
          )}
        </DropdownMenu.CheckboxItem>
      );
    }

    if ('isRadio' in item && item.isRadio && item.value) {
      return (
        <DropdownMenu.RadioItem
          key={`radio-${index}`}
          value={item.value}
          disabled={'disabled' in item ? item.disabled : false}
          className={getCheckClassNames()}
        >
          <DropdownMenu.ItemIndicator className={themeConfig.euler.menu.checkbox.indicator}>
            <Check className={themeConfig.euler.menu.checkbox.icon} />
          </DropdownMenu.ItemIndicator>
          {'icon' in item && item.icon && <item.icon className={getIconClassNames()} />}
          {item.content}
        </DropdownMenu.RadioItem>
      );
    }

    if ('hasSubmenu' in item && item.hasSubmenu && item.submenuItems) {
      return (
        <DropdownMenu.Sub key={`sub-${index}`}>
          <DropdownMenu.SubTrigger className={getMenuItemClassNames('disabled' in item ? item.disabled : false)}>
            {'icon' in item && item.icon && <item.icon className={getIconClassNames()} />}
            {item.content}
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent className={menuClassNames}>
              {item.submenuItems.map((subItem, subIndex) => 
                renderMenuItem(subItem as MenuItemWithSeparatorProps, subIndex)
              )}
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      );
    }

    // For standard menu items
    const standardItem = item as MenuStandardProps;
    return (
      <DropdownMenu.Item
        key={`item-${index}`}
        onSelect={standardItem.onSelect}
        disabled={'disabled' in standardItem ? standardItem.disabled : false}
        className={cn(
          getMenuItemClassNames('disabled' in standardItem ? standardItem.disabled : false), 
          getColorClassNames(standardItem.color)
        )}
      >
        <div className={getThreeColumnLayoutClassNames()}>
          {/* Column 1: Icon */}
          {'icon' in standardItem && standardItem.icon && <standardItem.icon className={getIconClassNames()} />}
          
          {/* Column 2: Content (main text + subtext) */}
          <div className={getColumnContentClassNames()}>
            {'subtext' in standardItem && standardItem.subtext ? (
              <div className={getFlexColumnClassNames()}>
                <div>{standardItem.content}</div>
                <div className={getSubtextClassNames()}>{standardItem.subtext}</div>
              </div>
            ) : (
              standardItem.content
            )}
          </div>
          
          {/* Column 3: Shortcut */}
          {'shortcut' in standardItem && standardItem.shortcut && (
            <div className={getShortcutClassNames()}>{standardItem.shortcut}</div>
          )}
        </div>
      </DropdownMenu.Item>
    );
  };

  return (
    <DropdownMenu.Root 
      {...rootProps} 
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DropdownMenu.Trigger asChild>
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          ref={ref}
          align={align}
          side={side}
          sideOffset={5}
          className={menuClassNames}
          {...contentProps}
        >
          <Search
            enabled={search?.enabled}
            placeholder={search?.placeholder}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          
          {filteredItems.length > 0 ? (
            filteredItems.map((item: any, index: number) => 
              renderMenuItem(item as MenuItemWithSeparatorProps, index)
            )
          ) : (
            <DropdownMenu.Item disabled className={getMenuItemClassNames(true)}>
              No results found
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});

Menu.displayName = 'Menu';

export default Menu; 