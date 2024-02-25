import { lazy } from "react";

const Logsheet = lazy(() => import("../pages/Public/Logsheet"));
const Transaction = lazy(() => import("../pages/Public/Transaction"));
const Account = lazy(() => import("../pages/Public/DefaultDashboard"));

const TinOreProduction = lazy(() => import("../pages/Public/TinOreProduction"));
const TinOreInventory = lazy(() => import("../pages/Public/TinOreInventory"));
const TinOreUnloading = lazy(() => import("../pages/Public/TinOreUnloading"));
const TinOreProcessing = lazy(() => import("../pages/Public/TinOreProcessing"));

const coreRoutes = [
    {
        title: "Logsheet",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/logsheet",
                redirectTo: "/logsheet",
                component: Logsheet,
            },
        ],
    },
    {
        title: "Transaction",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/transaction",
                redirectTo: "/transaction",
                component: Transaction,
            },
        ],
    },
    {
        title: "Account",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/account",
                redirectTo: "/account",
                component: Account,
            },
        ],
    },
    {
        title: "Tin Ore Production",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/ship/:id/tin-ore/production",
                redirectTo: "/ship/:id/tin-ore/production",
                component: TinOreProduction,
            },
            {
                index: true,
                path: "/tin-ore/production",
                redirectTo: "/tin-ore/production",
                component: TinOreProduction,
            },
        ],
    },
    {
        title: "Tin Ore Inventory",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/ship/:id/tin-ore/inventory",
                redirectTo: "/ship/:id/tin-ore/inventory",
                component: TinOreInventory,
            },
            {
                index: true,
                path: "/tin-ore/inventory",
                redirectTo: "/tin-ore/inventory",
                component: TinOreInventory,
            },
        ],
    },
    {
        title: "Tin Ore Unloading",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/ship/:id/tin-ore/unloading",
                redirectTo: "/ship/:id/tin-ore/unloading",
                component: TinOreUnloading,
            },
            {
                index: true,
                path: "/tin-ore/unloading",
                redirectTo: "/tin-ore/unloading",
                component: TinOreUnloading,
            },
        ],
    },
    {
        title: "Tin Ore Processing",
        requiresAuth: true,
        children: [
            {
                index: true,
                path: "/ship/:id/tin-ore/processing",
                redirectTo: "/ship/:id/tin-ore/processing",
                component: TinOreProcessing,
            },
            {
                index: true,
                path: "/tin-ore/processing",
                redirectTo: "/tin-ore/processing",
                component: TinOreProcessing,
            },
        ],
    },
];

const routes = [...coreRoutes];
export default routes;
