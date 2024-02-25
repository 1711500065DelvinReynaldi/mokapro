import { Fragment, useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import {
    BookOpenIcon,
    ReceiptPercentIcon,
    Squares2X2Icon,
    ChevronDownIcon,
    BellIcon,
    UserCircleIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const menus = [
    {
        name: "Daily Ship Operation",
        description: "Maintain your ship daily usage",
        href: "/daily-ship",
        icon: ChartPieIcon,
    },
    {
        name: "Tin Ore Production",
        description: "Check the production among your ship daily",
        href: "/tin-ore/production",
        icon: CursorArrowRaysIcon,
    },
    {
        name: "Tin Ore Unloading",
        description: "Craft to unload your tin ore product",
        href: "tin-ore/unloading",
        icon: BellIcon,
    },
    {
        name: "Tin Ore Inventory",
        description: "Inventory of remaining tin ore",
        href: "/tin-ore/inventory",
        icon: FingerPrintIcon,
    },
    {
        name: "Tin Ore Processing",
        description: "Maintain your ship daily usage",
        href: "/tin-ore/processing",
        icon: ChartPieIcon,
    },
    {
        name: "Repair & Maintenance",
        description: "Request a repair to the maintenance engineer quickly",
        href: "repair-maintenance",
        icon: SquaresPlusIcon,
    },
    {
        name: "Sparepart Inventory",
        description: "Restock and maintain your sparepart",
        href: "sparepart-inventory",
        icon: ArrowPathIcon,
    },
];

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

interface NavigationLinkProps {
    to: string;
    icon: React.ElementType;
    text: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
    to,
    icon: Icon,
    text,
}) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            isActive
                ? "w-full justify-center inline-block text-center pt-1.5 pb-1 text-blue-500"
                : "w-full justify-center inline-block text-center pt-1.5 pb-1 focus:text-blue-500 hover:text-blue-500"
        }
    >
        {Icon && <Icon className="inline-block w-6 h-6" />}
        <span className="tab tab-home block text-xs">{text}</span>
    </NavLink>
);

const BottomNavigation = () => {
    return (
        <section className="block sm:hidden fixed inset-x-0 bottom-0 z-20 h-[50px] bg-white shadow-sm">
            <div className="flex justify-between">
                <NavigationLink to="/" icon={Squares2X2Icon} text="Dashboard" />
                <NavigationLink
                    to="/logsheet"
                    icon={ReceiptPercentIcon}
                    text="Logsheet"
                />
                <NavigationLink
                    to="/transaction"
                    icon={BookOpenIcon}
                    text="Transaction"
                />
            </div>
        </section>
    );
};

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="bg-white fixed w-full top-0 shadow-sm z-10">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Mokapro</span>
                        <img
                            className="h-8 w-auto"
                            src="https://cdn.greenforgood.id/assets/img/logo_mini.png"
                            alt="LOGO GREENHR"
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <Popover className="relative">
                        <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                            Menu
                            <ChevronDownIcon
                                className="h-5 w-5 flex-none text-gray-400"
                                aria-hidden="true"
                            />
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                <div className="p-4">
                                    {menus.map((item) => (
                                        <div
                                            key={item.name}
                                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                        >
                                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                <item.icon
                                                    className="h-6 w-6 text-gray-600 group-hover:text-blue-600"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="flex-auto">
                                                <Link
                                                    to={item.href}
                                                    className="block font-semibold text-gray-900"
                                                >
                                                    {item.name}
                                                    <span className="absolute inset-0" />
                                                </Link>
                                                <p className="mt-1 text-gray-600">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                    <Link
                        to="/"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/logsheet"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Logsheet
                    </Link>
                    <Link
                        to="/transaction"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Transaction
                    </Link>
                    <Link
                        to="#"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Reports
                    </Link>
                    <Link
                        to="#"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Settings
                    </Link>
                </Popover.Group>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        <BellIcon
                            className="h-7 w-7 flex-none"
                            aria-hidden="true"
                        />
                    </button>
                    <Link
                        to="/account"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        <UserCircleIcon
                            className="h-7 w-7 flex-none"
                            aria-hidden="true"
                        />
                    </Link>
                </div>
            </nav>
            <Dialog
                as="div"
                className="lg:hidden"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
            >
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://cdn.greenforgood.id/assets/img/logo_mini.png"
                                alt="LOGO GREENHR"
                            />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                                Menu
                                                <ChevronDownIcon
                                                    className={classNames(
                                                        open
                                                            ? "rotate-180"
                                                            : "",
                                                        "h-5 w-5 flex-none",
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-2 space-y-2">
                                                {[...menus].map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Reports
                                </Link>
                            </div>
                            <div className="py-6">
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
};

const DefaultLayout = () => {
    return (
        <>
            <Header />
            <div className="w-full mt-[40px] py-[20px] mb-[50px] bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen">
                <Outlet />
            </div>
            <BottomNavigation />
            <footer className="hidden sm:block fixed inset-x-0 bottom-0 z-20 h-[50px] bg-gray-100 shadow-sm">
                <div className="flex justify-between items-center h-full">
                    <p className="font-semibold mx-auto">{`© ${new Date().getFullYear()}, MOKAPRO by GreenHR`}</p>
                </div>
            </footer>
        </>
    );
};

export default DefaultLayout;
