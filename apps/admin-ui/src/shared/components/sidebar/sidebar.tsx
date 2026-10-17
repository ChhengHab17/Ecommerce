'use client';
import React, { useEffect } from 'react';
import { useSidebar } from 'apps/admin-ui/src/hook/useSidebar';
import { usePathname } from 'next/navigation';
import useSeller from 'apps/admin-ui/src/hook/useSeller';
import Box from '../box';
import Link from 'next/link';
import { Sidebar } from './sidebar.styles';
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  CreditCardPlus,
  Home,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SidebarIcon,
  SquarePlus,
  TicketPercent,
} from 'lucide-react';
import SidebarItem from './sidebar.item';
import SideBarMenu from './sidebar.manu';

const SideBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();
  console.log('seller', seller);

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) => {
    return activeSidebar === route ? '#0085ff' : '#969696';
  };

  return (
    <Box
      css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: 0,
        overflowY: 'scroll',
        scrollbarWidth: 'none',
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={'/'} className="flex justify-center text-center gap-2">
            <SidebarIcon />
            <Box>
              <h3 className="text-xl font-medium text-white">
                {' '}
                {seller?.shop.name}
              </h3>
              <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<Home color={getIconColor('/dashboard')} />}
            isActive={activeSidebar === '/dashboard'}
            href="/dashboard"
          />
          <div className="mt-2 block">
            <SideBarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                icon={<ListOrdered color={getIconColor('/dashboard/orders')} />}
                isActive={activeSidebar === '/dashboard/orders'}
                href="/dashboard/orders"
              />
              <SidebarItem
                title="payment"
                icon={<CreditCardPlus color={getIconColor('/dashboard/payment')} />}
                isActive={activeSidebar === '/dashboard/payment'}
                href="/dashboard/payment"
              />
            </SideBarMenu>
            <SideBarMenu title="Products">
              <SidebarItem
                title="Create Product"
                icon={
                  <SquarePlus
                    color={getIconColor('/dashboard/create-product')}
                  />
                }
                isActive={activeSidebar === '/dashboard/create-product'}
                href="/dashboard/create-product"
              />
              <SidebarItem
                title="All Products"
                icon={
                  <PackageSearch
                    color={getIconColor('/dashboard/all-products')}
                  />
                }
                isActive={activeSidebar === '/dashboard/all-products'}
                href="/dashboard/all-products"
              />
            </SideBarMenu>
            <SideBarMenu title="Events">
              <SidebarItem
                title="Create Event"
                icon={
                  <CalendarPlus
                    color={getIconColor('/dashboard/create-event')}
                  />
                }
                isActive={activeSidebar === '/dashboard/create-event'}
                href="/dashboard/create-event"
              />
              <SidebarItem
                title="All Events"
                icon={
                  <BellPlus color={getIconColor('/dashboard/all-events')} />
                }
                isActive={activeSidebar === '/dashboard/all-events'}
                href="/dashboard/all-events"
              />
            </SideBarMenu>
            <SideBarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                icon={<Mail color={getIconColor('/dashboard/inbox')} />}
                isActive={activeSidebar === '/dashboard/inbox'}
                href="/dashboard/inbox"
              />
              <SidebarItem
                title="Settings"
                icon={<Settings color={getIconColor('/dashboard/settings')} />}
                isActive={activeSidebar === '/dashboard/settings'}
                href="/dashboard/settings"
              />
              <SidebarItem
                title="Notifications"
                icon={
                  <BellRing color={getIconColor('/dashboard/notifications')} />
                }
                isActive={activeSidebar === '/dashboard/notifications'}
                href="/dashboard/notifications"
              />
            </SideBarMenu>
            <SideBarMenu title="Extras">
              <SidebarItem
                title="Discount Codes"
                icon={<TicketPercent color={getIconColor('/dashboard/discount-code')} />}
                isActive={activeSidebar === '/dashboard/discounts-code'}
                href="/dashboard/discounts-code"
              />
              <SidebarItem
                title="Logout"
                icon={<LogOut color={getIconColor('/logout')} />}
                isActive={activeSidebar === '/logout'}
                href="/logout"
              />
            </SideBarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
