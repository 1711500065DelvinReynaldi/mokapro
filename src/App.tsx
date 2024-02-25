import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "./component/Loader";

import SignIn from "./pages/Authentication/SignIn";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import LogOut from "./pages/Authentication/LogOut";
import DefaultDashboard from "./pages/Public/DefaultDashboard";
import routes from "./routes";
import Ship from "./pages/Public/Ship";
import ShipOperation from "./pages/Public/ShipOperation";

const DefaultLayout = lazy(() => import("./component/DefaultLayout"));

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginId = sessionStorage.getItem("loginId");
        if (loginId) {
            setIsLoggedIn(true);
        }

        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        sessionStorage.getItem("loginId");
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Routes>
            <Route
                path="/auth/signin"
                element={<SignIn onLogin={handleLogin} />}
            />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/logout" element={<LogOut />} />
            {isLoggedIn ? (
                <>
                    <Route path="/ship/:id" element={<Ship />} />
                    <Route
                        path="/ship/:id/operation"
                        element={<ShipOperation />}
                    />
                    <Route element={<DefaultLayout />}>
                        <Route index element={<DefaultDashboard />} />
                        {routes.map((route, index) => {
                            const { requiresAuth, children } = route;
                            if (requiresAuth && children) {
                                return (
                                    <Route key={index}>
                                        {children.map(
                                            (childRoute, childIndex) => {
                                                const {
                                                    index: isIndex,
                                                    path,
                                                    component: Component,
                                                } = childRoute;
                                                return (
                                                    <Route
                                                        key={childIndex}
                                                        index={isIndex}
                                                        path={path}
                                                        element={
                                                            <Suspense
                                                                fallback={
                                                                    <Loader />
                                                                }
                                                            >
                                                                <Component />
                                                            </Suspense>
                                                        }
                                                    />
                                                );
                                            },
                                        )}
                                    </Route>
                                );
                            }
                            return null;
                        })}
                    </Route>
                </>
            ) : (
                <Route
                    path="/*"
                    element={
                        <Navigate
                            to={`/auth/signin?redirect=${window.location.pathname}`}
                            replace
                        />
                    }
                />
            )}
        </Routes>
    );
}

export default App;
