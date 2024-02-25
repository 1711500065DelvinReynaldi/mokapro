import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface BreadcrumbProps {
    pageTitle: string;
}

interface MainLayoutProps {
    children: ReactNode;
    pageTitle: string;
}

const Header = ({ pageTitle }: BreadcrumbProps) => {
    const navigate = useNavigate();

    const handleCancel = () => {
        if (typeof navigate === "function") {
            navigate(-1);
        } else {
            // If navigate is not a function, use Link or handle it accordingly
            return <Link to="/logsheet">Go to Logsheet</Link>;
        }
    };

    return (
        <header className="bg-white fixed w-full shadow-sm z-50">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between px-2 py-3 lg:px-8"
                aria-label="Global"
            >
                <div className="flex">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="-m-1.5 p-1.5 flex items-center"
                    >
                        <ChevronLeftIcon className="h-8 w-8" /> Back
                    </button>
                </div>
                <h1 className="absolute left-[50px] right-[50px] align-middle m-0 p-0 text-center tracking-tight overflow-hidden whitespace-nowrap font-semibold text-gray-900">
                    {pageTitle}
                </h1>
            </nav>
        </header>
    );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
    return (
        <>
            <Header pageTitle={pageTitle} />
            <div className="w-full pt-[70px] pb-[20px] px-4 bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen">
                {children}
            </div>
        </>
    );
};

export default MainLayout;
