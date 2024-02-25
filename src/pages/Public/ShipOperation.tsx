import { useEffect, useState, useRef, Fragment, ChangeEvent } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import { useParams } from "react-router-dom";
import {
    Battery50Icon,
    ClockIcon,
    PlusCircleIcon,
    PhotoIcon,
    CameraIcon,
} from "@heroicons/react/20/solid";
import Axios from "axios";
import Loader from "../../component/Loader";
import MainLayout from "../../component/MainLayout";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

interface ExtendedReactCropperElement extends ReactCropperElement {
    getCroppedCanvas: () => HTMLCanvasElement;
}

const Data = () => {
    const [shipData, setShipData] = useState({
        status: 0,
        description: "",
        data: {
            ship: {
                id: "",
                name: "",
                code: "",
                thumbnail: "",
                color_theme: "",
                usage_status: "",
                current_status: "",
            },
            fuel: {
                total: "",
                in: "",
                out: "",
                remain: "",
                last_transaction: "",
                last_transaction_date: "",
            },
            downtime: {
                total: "",
                category: {
                    perbaikan: "",
                    perawatan: "",
                    bongkar_muat: "",
                    cuaca: "",
                    docking: "",
                    other: "",
                },
                last_transaction: "",
                last_transaction_date: "",
            },
        },
    });

    let { id } = useParams();
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            if (!id) return null;

            const shipResponse = await Axios.get(
                `https://api.greenforgood.id/odyssey/ship?id=${id}`,
            );

            if (shipResponse.data[0]) {
                setShipData(shipResponse.data[0]);
                setLoading(false);
                return shipResponse.data[0];
            } else {
                setShipData({
                    status: 400,
                    description: "",
                    data: {
                        ship: {
                            id: "",
                            name: "",
                            code: "",
                            thumbnail: "",
                            color_theme: "",
                            usage_status: "",
                            current_status: "",
                        },
                        fuel: {
                            total: "",
                            in: "",
                            out: "",
                            remain: "",
                            last_transaction: "",
                            last_transaction_date: "",
                        },
                        downtime: {
                            total: "",
                            category: {
                                perbaikan: "",
                                perawatan: "",
                                bongkar_muat: "",
                                cuaca: "",
                                docking: "",
                                other: "",
                            },
                            last_transaction: "",
                            last_transaction_date: "",
                        },
                    },
                });
                setLoading(false);
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const shipDataFetch = shipData;
    return { shipDataFetch, id, loading };
};

const TableFuelShip = () => {
    const { id } = Data();

    const thisId = id;
    const loginId = sessionStorage.getItem("loginId");

    let [isOpen, setIsOpen] = useState(false);
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);

    // IMAGE
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const cropperRef = useRef<ExtendedReactCropperElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setCroppedImage(null);
        }
    };

    const handleCrop = () => {
        if (cropperRef.current && cropperRef.current.getCroppedCanvas) {
          const croppedDataUrl = cropperRef.current.getCroppedCanvas().toDataURL();
          setCroppedImage(croppedDataUrl);
        }
    };

    // FORM
    const [formData, setFormData] = useState({
        login_id: parseInt(loginId || "0", 10),
        ship_id: parseInt(thisId || "0", 10),
        date: "",
        category: "",
        value: "",
        remarks: "",
    });

    const [error, setError] = useState({
        dateError: false,
        categoryError: false,
        valueError: false,
        remarksError: false,
    });

    const [stringErrorMsg, setStringErrorMsg] = useState({
        dateString: "",
        categoryString: "",
        valueString: "",
        remarksString: "",
    });

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        setSubmitDisabled(true);
    };

    useEffect(() => {
        const { dateError, categoryError, valueError, remarksError } = error;
        setSubmitDisabled(
            dateError || categoryError || valueError || remarksError,
        );
    }, [error]);

    const handleChange = (e: {
        target: { name: any; value: any; type: any };
    }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "date") {
            setError((nextState) => ({
                ...nextState,
                dateError: value === "" ? true : false,
            }));
            if (value === "") {
                setStringErrorMsg((nextState) => ({
                    ...nextState,
                    dateString: "Date field is required",
                }));
            }
        }

        if (name === "category") {
            setError((nextState) => ({
                ...nextState,
                categoryError: value === "" ? true : false,
            }));
            if (value === "") {
                setStringErrorMsg((nextState) => ({
                    ...nextState,
                    categoryString: "Category field is required",
                }));
            }
        }

        if (name === "value") {
            setError((nextState) => ({
                ...nextState,
                valueError: value === "" ? true : false,
            }));
            if (value === "") {
                setStringErrorMsg((nextState) => ({
                    ...nextState,
                    valueString: "Value field is required",
                }));
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-900">Fuel</h3>
                <button type="button" className="pl-4" onClick={openModal}>
                    <PlusCircleIcon className="w-6 h-6 text-blue-600 hover:text-blue-700" />
                </button>
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="fixed inset-0 bg-black/30"
                            aria-hidden="true"
                        />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Create a Fuel Data
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4 grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                            <input
                                                id="login_id"
                                                name="login_id"
                                                type="hidden"
                                                value={formData.login_id}
                                            />
                                            <input
                                                id="ship_id"
                                                name="ship_id"
                                                type="hidden"
                                                value={formData.ship_id}
                                            />
                                            <div className="sm:col-span-4 my-4">
                                                <label
                                                    className={`block text-sm font-medium leading-6 ${
                                                        error.dateError
                                                            ? "text-red-500"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Date{" "}
                                                    <code className="text-red-500">
                                                        *
                                                    </code>
                                                </label>
                                                <div className="mx-auto">
                                                    <input
                                                        id="date"
                                                        name="date"
                                                        type="date"
                                                        placeholder="Insert a date"
                                                        value={formData.date}
                                                        onChange={handleChange}
                                                        className={`w-full rounded border-[1.5px] bg-transparent py-1 px-5 font-sm outline-none transition disabled:cursor-default
                                                        ${
                                                            error.dateError
                                                                ? "border-red-500 active:border-red-600 focus:border-red-600"
                                                                : "border-black active:border-blue-500 focus:border-blue-500"
                                                        }`}
                                                    />
                                                </div>
                                                {error.dateError && (
                                                    <p className="mb-3 text-sm leading-6 text-red-600">
                                                        {
                                                            stringErrorMsg.dateString
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-full my-4">
                                                <label
                                                    className={`block text-sm font-medium leading-6 ${
                                                        error.dateError
                                                            ? "text-red-500"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Category{" "}
                                                    <code className="text-red-500">
                                                        *
                                                    </code>
                                                </label>
                                                <div className="mx-auto">
                                                    <select
                                                        id="category"
                                                        name="category"
                                                        value={
                                                            formData.category
                                                        }
                                                        onChange={handleChange}
                                                        className={`w-full rounded border-[1.5px] bg-transparent py-1 px-5 font-sm outline-none transition disabled:cursor-default
                                                        ${
                                                            error.categoryError
                                                                ? "border-red-500 active:border-red-600 focus:border-red-600"
                                                                : "border-black active:border-blue-500 focus:border-blue-500"
                                                        }`}
                                                    >
                                                        <option value="">
                                                            --Select Category--
                                                        </option>
                                                        <option value="in">
                                                            In
                                                        </option>
                                                        <option value="out">
                                                            Out
                                                        </option>
                                                    </select>
                                                </div>
                                                {error.categoryError && (
                                                    <p className="mb-3 text-sm leading-6 text-red-600">
                                                        {
                                                            stringErrorMsg.categoryString
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-full my-4">
                                                <label
                                                    className={`block text-sm font-medium leading-6 ${
                                                        error.valueError
                                                            ? "text-red-500"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Value{" "}
                                                    <code className="text-red-500">
                                                        *
                                                    </code>
                                                </label>
                                                <div className="mx-auto">
                                                    <input
                                                        id="value"
                                                        name="value"
                                                        type="number"
                                                        placeholder="Insert a value between 1 to 99999"
                                                        value={formData.value}
                                                        onChange={handleChange}
                                                        className={`w-full rounded border-[1.5px] bg-transparent py-1 px-5 font-sm outline-none transition disabled:cursor-default
                                                        ${
                                                            error.valueError
                                                                ? "border-red-500 active:border-red-600 focus:border-red-600"
                                                                : "border-black active:border-blue-500 focus:border-blue-500"
                                                        }`}
                                                    />
                                                </div>
                                                {error.valueError && (
                                                    <p className="mb-3 text-sm leading-6 text-red-600">
                                                        {
                                                            stringErrorMsg.valueString
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-full my-4">
                                                <label
                                                    className={`block text-sm font-medium leading-6 ${
                                                        error.remarksError
                                                            ? "text-red-500"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Remarks
                                                </label>
                                                <div className="mx-auto">
                                                    <textarea
                                                        id="remarks"
                                                        name="remarks"
                                                        value={formData.remarks}
                                                        onChange={handleChange}
                                                        rows={3}
                                                        placeholder="Write a description..."
                                                        className={`w-full rounded border-[1.5px] bg-transparent py-1 px-5 font-sm outline-none transition disabled:cursor-default
                                                        ${
                                                            error.remarksError
                                                                ? "border-red-500 active:border-red-600 focus:border-red-600"
                                                                : "border-black active:border-blue-500 focus:border-blue-500"
                                                        }`}
                                                    />
                                                </div>
                                                {error.remarksError && (
                                                    <p className="mb-3 text-sm leading-6 text-red-600">
                                                        {
                                                            stringErrorMsg.remarksString
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-full">
                                                <label
                                                    htmlFor="cover-photo"
                                                    className="block text-sm font-medium leading-6 text-gray-900 text-center"
                                                >
                                                    Attachment
                                                </label>
                                                <div className="mt-2 flex">
                                                    <div className="text-center justify-center rounded-lg border border-dashed border-gray-900/25 mx-auto">
                                                        {selectedFile ? (
                                                            <div className="mx-auto">
                                                                  <Cropper
                                                                    ref={cropperRef}
                                                                    dragMode="move"
                                                                    aspectRatio={1 / 1}
                                                                    autoCropArea={1}
                                                                    restore={false}
                                                                    center={false}
                                                                    highlight={false}
                                                                    cropBoxMovable={false}
                                                                    cropBoxResizable={false}
                                                                    toggleDragModeOnDblclick={false}
                                                                    src={URL.createObjectURL(selectedFile)}
                                                                    className="w-60 h-60"
                                                                    viewMode={3}
                                                                    zoomable={true}
                                                                    crop={handleCrop}
                                                                  />
                                                                  {croppedImage && (
                                                                    <div>
                                                                      <p>Cropped Image Preview:</p>
                                                                      <img src={croppedImage} alt="Cropped Preview" />
                                                                    </div>
                                                                  )}
                                                            </div>
                                                        ) : (
                                                            <PhotoIcon
                                                                className="mx-auto h-12 w-12 text-gray-300"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        <div className="p-5 mx-auto text-gray-600">
                                                            <label
                                                                htmlFor="fileInput"
                                                                className="flex items-center justify-center w-20 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
                                                            >
                                                                <CameraIcon className="w-4 h-4" />
                                                                <input
                                                                    type="file"
                                                                    name="fileInput"
                                                                    id="fileInput"
                                                                    accept="image/*"
                                                                    className="sr-only"
                                                                    onChange={
                                                                        handleFileChange
                                                                    }
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid space-y-2">
                                            <p className="text-xs">
                                                <code className="text-red-500">
                                                    *
                                                </code>{" "}
                                                is a required field
                                            </p>
                                            <div className="flex space-x-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitDisabled}
                                                    className={`inline-flex justify-center rounded-md border border-transparent
                                                    ${
                                                        isSubmitDisabled
                                                            ? "bg-blue-100 px-4 py-2 text-sm font-medium text-white hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                            : "bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
                                                    }`}
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    onClick={closeModal}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

const ShipOperation = () => {
    const { shipDataFetch, loading } = Data();

    let firstDate = "2023-01-01";
    let lastDate = "2023-12-19";

    return (
        <MainLayout pageTitle={shipDataFetch.data.ship.name}>
            {loading ? (
                <Loader />
            ) : shipDataFetch.status === 400 ? (
                <p className="mx-auto text-center text-white">
                    No data available.
                </p>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:space-x-4 space-y-4">
                        <div className="flex items-center border rounded-md mt-4 bg-white">
                            <button
                                type="button"
                                className="w-full focus:outline-none border-0 p-2 rounded-l-md border-r border-gray-300 text-center"
                            >
                                {new Date(firstDate).toLocaleDateString(
                                    "en-US",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    },
                                )}
                            </button>
                            <div className="inline-block p-2 w-10 text-center">
                                to
                            </div>
                            <button
                                type="button"
                                className="w-full focus:outline-none border-0 p-2 rounded-r-md border-l border-gray-300 text-center"
                            >
                                {new Date(lastDate).toLocaleDateString(
                                    "en-US",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    },
                                )}
                            </button>
                        </div>
                        <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black/5">
                            <div className="relative grid gap-8 bg-white p-7 sm:grid-cols-2">
                                <a
                                    href="#"
                                    className="-m-3 flex items-center rounded-md p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                        <Battery50Icon className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            450
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Fuel (litres)
                                        </p>
                                    </div>
                                </a>
                                <a
                                    href="#"
                                    className="-m-3 flex items-center rounded-md p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                        <ClockIcon className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            72
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Downtime (hours)
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:px-0">
                        <Tab.Group>
                            <Tab.List className="flex space-x-1 rounded-md bg-blue-900/20 p-1">
                                <Tab
                                    className={({ selected }) =>
                                        classNames(
                                            "w-full rounded-md py-2.5 text-sm font-medium leading-5",
                                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                            selected
                                                ? "bg-white text-blue-700 shadow"
                                                : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                                        )
                                    }
                                >
                                    Fuel
                                </Tab>
                                <Tab
                                    className={({ selected }) =>
                                        classNames(
                                            "w-full rounded-md py-2.5 text-sm font-medium leading-5",
                                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                            selected
                                                ? "bg-white text-blue-700 shadow"
                                                : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                                        )
                                    }
                                >
                                    Downtime
                                </Tab>
                            </Tab.List>
                            <Tab.Panels className="mt-2">
                                <Tab.Panel className="rounded-md bg-white p-4">
                                    <TableFuelShip />
                                </Tab.Panel>
                                <Tab.Panel className="rounded-md bg-white p-4">
                                    Downtime
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default ShipOperation;
