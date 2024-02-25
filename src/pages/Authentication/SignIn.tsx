import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SignIn = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [stringErrorEmailMsg, setStringErrorEmailMsg] = useState("");
    const [stringErrorPasswordMsg, setStringErrorPasswordMsg] = useState("");
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const validatePassword = (password: string) => {
        const isLengthValid = password.length >= 8;
        const hasNumber = /\d/.test(password);
        return isLengthValid && hasNumber;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // return passwordRegex.test(password);
    };

    const navigate = useNavigate();

    useEffect(() => {
        const loginId = sessionStorage.getItem("loginId");
        if (loginId) {
            navigate("/");
            toast.success("Welcome back.");
        }
    }, [navigate]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        setSubmitDisabled(true);

        if (!validateEmail(email)) {
            setEmailError(true);
            setStringErrorEmailMsg("Please enter a valid email.");
            setSubmitDisabled(false);
            return;
        } else {
            setEmailError(false);
            setStringErrorEmailMsg("");
        }

        if (!validatePassword(password)) {
            setPasswordError(true);
            setStringErrorPasswordMsg(
                "Please enter a valid password (at least 8 characters with number combinations).",
            );
            setSubmitDisabled(false);
            return;
        } else {
            setPasswordError(false);
            setStringErrorPasswordMsg("");
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            toast.loading("Authenticating...");
            const response = await axios.post(
                "https://api.greenforgood.id/auth",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.data.Status === 200) {
                sessionStorage.setItem("loginId", response.data.loginId);
                onLogin();

                const searchParams = new URLSearchParams(location.search);
                const redirectPath = searchParams.get("redirect");

                if (redirectPath) {
                    navigate(redirectPath);
                } else {
                    navigate("/");
                }
                toast.dismiss();
                setSubmitDisabled(false);
            } else {
                toast.dismiss();
                await toast.error(response.data.Description);
                setSubmitDisabled(false);
            }
        } catch (error) {
            console.error("Error during login:", error);
            await toast.error(
                "An error occurred during login. Please try again.",
            );
            setSubmitDisabled(false);
        }
    };

    return (
        <>
            <div className="flex min-h-screen align-middle items-center flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="bg-white rounded-xl w-70 sm:w-96 p-6">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://cdn.greenforgood.id/assets/img/logo_mini.png"
                            alt="LOGO GREENHR"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to MOKAPRO
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`block text-sm font-medium ${
                                        emailError
                                            ? "text-red-500"
                                            : "text-gray-900"
                                    } leading-6`}
                                >
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        disabled={isSubmitDisabled}
                                        placeholder="Enter your email"
                                        className={`w-full rounded-lg border ${
                                            emailError
                                                ? "border-red-500"
                                                : "border-stroke"
                                        } bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                                    />
                                    <p
                                        className={`text-red-500 ${
                                            emailError ? "" : "hidden"
                                        }`}
                                    >
                                        {stringErrorEmailMsg}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className={`block text-sm font-medium ${
                                            passwordError
                                                ? "text-red-500"
                                                : "text-gray-900"
                                        } leading-6`}
                                    >
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <Link
                                            to="/auth/forgot-password"
                                            className="text-sm text-blue-600 hover:text-blue-500"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        disabled={isSubmitDisabled}
                                        placeholder="********"
                                        className={`w-full rounded-lg border ${
                                            passwordError
                                                ? "border-red-500"
                                                : "border-stroke"
                                        } bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                                    />

                                    <p
                                        className={`text-red-500 ${
                                            passwordError ? "" : "hidden"
                                        }`}
                                    >
                                        {stringErrorPasswordMsg}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitDisabled}
                                    type="submit"
                                    className={`flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white ${
                                        isSubmitDisabled
                                            ? "bg-black hover:bg-black focus-visible:outline-bg-black"
                                            : "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600"
                                    }
                                    shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Not a member?&nbsp;
                            <a
                                href="#"
                                className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
                            >
                                Create account now
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
