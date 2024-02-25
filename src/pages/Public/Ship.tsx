import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import MainLayout from "../../component/MainLayout";
import Axios from "axios";
import mapboxgl from "mapbox-gl";
import Loader from "../../component/Loader";

import "mapbox-gl/dist/mapbox-gl.css";

const MapTable = () => {
    type Coordinate = {
        data: {
            coordinate: {
                date: string;
                latitude: string;
                longitude: string;
            };
        };
    };

    const [data, setData] = useState<Coordinate[]>([]);

    let { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shipResponse = await Axios.get(
                    `https://api.greenforgood.id/odyssey/coordinate?ship_id=${id}`,
                );
                setData(shipResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

    const columnHelper = createColumnHelper<Coordinate>();

    const columns = [
        columnHelper.accessor("data.coordinate", {
            cell: (info) => {
                const coordinate = info.row.original.data.coordinate;
                return (
                    <ul role="list" className="divide-y divide-gray-200">
                        <li className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {coordinate.latitude}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate ">
                                        {coordinate.longitude}
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-sm text-gray-900">
                                    {new Date(
                                        coordinate.date,
                                    ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </li>
                    </ul>
                );
            },
            header: () => (
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                        Location History
                    </h3>
                    <button
                        type="button"
                        onClick={() => rerender()}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                        Refresh
                    </button>
                </div>
            ),
        }),
    ];

    const rerender = useReducer(() => ({}), {})[1];
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full overflow-y-auto h-[170px] py-2">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-2 py-1 whitespace-nowrap"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-50">
                    {table.getFooterGroups().map((footerGroup) => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.footer,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    );
};

const MapComponent: React.FC = () => {
    let { id } = useParams();

    const fetchData = async () => {
        try {
            const shipResponse = await Axios.get(
                `https://api.greenforgood.id/odyssey/coordinate?ship_id=${id}`,
            );
            return shipResponse.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchAndMapData = async () => {
            const shipData = await fetchData();

            const PublicKey = import.meta.env.VITE_MAPBOXGL_PUBLIC_KEY;
            mapboxgl.accessToken = PublicKey;

            // Create a new Mapbox map
            const map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: [105.4840626817946, -1.5149237752910238], // long, lat
                zoom: 9,
            });

            // Mapping markers for each ship
            shipData.forEach(
                (item: {
                    data: {
                        coordinate: { longitude: string; latitude: string };
                    };
                }) => {
                    new mapboxgl.Marker({ color: "red" })
                        .setLngLat([
                            parseFloat(item.data.coordinate.longitude),
                            parseFloat(item.data.coordinate.latitude),
                        ])
                        .addTo(map);
                },
            );

            const nav = new mapboxgl.NavigationControl();
            map.addControl(nav, "top-left");

            return () => map.remove();
        };

        fetchAndMapData();
    }, [id]);

    return (
        <>
            <div id="map" className="w-full h-[300px] rounded-md" />
            <MapTable />
        </>
    );
};

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

const Ship = () => {
    const { shipDataFetch, id, loading } = Data();

    const menuItems = [
        {
            to: `/ship/${id}/operation`,
            iconSrc:
                "https://cdn.greenforgood.id/assets/lms/m/img/icons/appimg_operation-icon-18965.png",
            backgroundColor: "bg-orange-500",
            hoverBackgroundColor: "hover:bg-orange-600",
            label: "Daily Ship Operation",
        },
        {
            to: `/ship/${id}/tin-ore/production`,
            iconSrc:
                "https://cdn.greenforgood.id/assets/lms/m/img/icons/appimg_production-icon-8639.png",
            backgroundColor: "bg-orange-500",
            hoverBackgroundColor: "hover:bg-orange-600",
            label: "Tin Ore Production",
        },
        {
            to: `/ship/${id}/tin-ore/inventory`,
            iconSrc:
                "https://cdn.greenforgood.id/assets/lms/m/img/icons/appimg_tin-ore-icon-329.png",
            backgroundColor: "bg-orange-500",
            hoverBackgroundColor: "hover:bg-orange-600",
            label: "Tin Ore Inventory",
        },
        {
            to: `/ship/${id}/repair-maintenance`,
            iconSrc:
                "https://cdn.greenforgood.id/assets/lms/m/img/icons/appimg_maintenance-icon-18882.png",
            backgroundColor: "bg-red-500",
            hoverBackgroundColor: "hover:bg-red-600",
            label: "Repair & Maintenance",
        },
        {
            to: `/ship/${id}/sparepart-inventory`,
            iconSrc:
                "https://cdn.greenforgood.id/assets/lms/m/img/icons/appimg_sparepart-inventory-icon-33854.png",
            backgroundColor: "bg-red-500",
            hoverBackgroundColor: "hover:bg-red-600",
            label: "Sparepart Inventory",
        },
        {
            to: `/ship/${id}/tin-ore/unload`,
            iconSrc:
                "https://cdn.greenforgood.id/assets/lms/m/img/icons/appimg_unload-icon-png-7968.png",
            backgroundColor: "bg-red-500",
            hoverBackgroundColor: "hover:bg-red-600",
            label: "Tin Ore Unloading",
        },
    ];

    return (
        <MainLayout pageTitle={shipDataFetch.data.ship.name}>
            {loading ? (
                <Loader />
            ) : shipDataFetch.status === 400 ? (
                <p className="mx-auto text-center text-white">
                    No data available.
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mx-auto">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className={`flex-shrink-0 rounded-md ${item.backgroundColor} ${item.hoverBackgroundColor}`}
                            >
                                <div className="p-2 justify-center items-center text-center">
                                    <div className="flex flex-col items-center">
                                        <img
                                            className="w-8 h-8 sm:w-20 sm:h-20"
                                            src={item.iconSrc}
                                            alt={item.label}
                                        />
                                        <span className="text-white text-sm tracking-tight leading-tight">
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mx-auto mt-3">
                        <Disclosure>
                            {({ open }) => (
                                <div className="flex flex-col gap-3">
                                    <Disclosure.Button className="flex w-full justify-between rounded-md bg-orange-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/75">
                                        <span>Open Map</span>
                                        <ChevronUpIcon
                                            className={`${
                                                open
                                                    ? "rotate-180 transform"
                                                    : ""
                                            } h-5 w-5 text-white`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="rounded-md h-[500px] bg-white p-4">
                                        <MapComponent />
                                    </Disclosure.Panel>
                                </div>
                            )}
                        </Disclosure>
                        <div className="h-full py-8 px-6 space-y-6 rounded-md border border-gray-200 bg-white">
                            <div>
                                <h5 className="text-xl text-gray-600 text-center">
                                    Fuel Usage
                                </h5>
                                <div className="mt-2 flex justify-center gap-4">
                                    <h3 className="text-3xl font-bold text-gray-700">
                                        {shipDataFetch.data.fuel.total}L
                                    </h3>
                                </div>
                                <span className="block text-center text-gray-500">
                                    {new Date(
                                        shipDataFetch.data.fuel.last_transaction_date,
                                    ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <table className="w-full text-gray-600">
                                <tbody>
                                    <tr>
                                        <td className="py-2">Fuel In</td>
                                        <td className="text-gray-500">
                                            {shipDataFetch.data.fuel.in}L
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Fuel Out</td>
                                        <td className="text-gray-500">
                                            {shipDataFetch.data.fuel.out}L
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Remain</td>
                                        <td className="text-gray-500">
                                            {shipDataFetch.data.fuel.remain}L
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="h-full py-6 px-6 rounded-md border border-gray-200 bg-white">
                            <h5 className="text-xl text-gray-700">Downtime</h5>
                            <div className="my-8">
                                <h1 className="text-5xl font-bold text-gray-800">
                                    {shipDataFetch.data.downtime.total}x
                                </h1>
                                <span className="text-gray-500">
                                    {new Date(
                                        shipDataFetch.data.downtime.last_transaction_date,
                                    ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <table className="mt-6 -mb-2 w-full text-gray-600">
                                <tbody>
                                    <tr>
                                        <td className="py-2">Perbaikan</td>
                                        <td className="text-gray-500">
                                            {
                                                shipDataFetch.data.downtime
                                                    .category.perbaikan
                                            }
                                            x
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Perawatan</td>
                                        <td className="text-gray-500">
                                            {
                                                shipDataFetch.data.downtime
                                                    .category.perawatan
                                            }
                                            x
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Bongkar Muat</td>
                                        <td className="text-gray-500">
                                            {
                                                shipDataFetch.data.downtime
                                                    .category.bongkar_muat
                                            }
                                            x
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Cuaca</td>
                                        <td className="text-gray-500">
                                            {
                                                shipDataFetch.data.downtime
                                                    .category.cuaca
                                            }
                                            x
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Docking</td>
                                        <td className="text-gray-500">
                                            {
                                                shipDataFetch.data.downtime
                                                    .category.docking
                                            }
                                            x
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Other</td>
                                        <td className="text-gray-500">
                                            {
                                                shipDataFetch.data.downtime
                                                    .category.other
                                            }
                                            x
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </MainLayout>
    );
};

export default Ship;
