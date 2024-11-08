import { Icons } from '@/components/icons';
// Type cho icons
export type IconKeys = keyof typeof Icons;

// Interface cho navigation items
export interface NavItem {
  title: string;
  icon?: IconKeys;
  url: string;
  items?: NavItem[];
  isActive?: boolean;
}