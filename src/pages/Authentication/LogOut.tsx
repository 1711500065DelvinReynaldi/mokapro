import { useEffect } from "react";

const LogOut = () => {
    useEffect(() => {
        sessionStorage.removeItem("loginId");
        window.location.replace("/auth/signin");
    }, []);

    return (
        <>
            <div className="w-full pt-[70px] pb-[20px] px-4 bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Logging out
                    </h2>
                </div>
            </div>
        </>
    );
};

export default LogOut;
