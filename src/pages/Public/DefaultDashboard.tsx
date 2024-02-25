import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import Axios from "axios";
import ReactApexChart from "react-apexcharts";
import Loader from "../../component/Loader";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface TimahData {
    data: {
        ship: {
            name: string;
        };
        summary: {
            [month: number]: {
                timah: number;
            };
        };
    };
}

interface TailingData {
    data: {
        ship: {
            name: string;
        };
        summary: {
            [month: number]: {
                tailing: number;
            };
        };
    };
}

interface DowntimeData {
    data: {
        ship: {
            name: string;
        };
        summary: {
            [month: number]: {
                downtime: number;
            };
        };
    };
}

interface FueloutData {
    data: {
        ship: {
            name: string;
        };
        summary: {
            [month: number]: {
                fuel_out: number;
            };
        };
    };
}

const Statistics = () => {
    const [dataTimah, setDataTimah] = useState<TimahData[]>([]);
    const [dataTailing, setDataTailing] = useState<TailingData[]>([]);
    const [dataDowntime, setDataDowntime] = useState<DowntimeData[]>([]);
    const [dataFuelout, setDataFuelout] = useState<FueloutData[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const shipResoponse = await Axios.get(
                `https://api.greenforgood.id/odyssey/ship`,
            );
            setDataTimah(shipResoponse.data);
            setDataTailing(shipResoponse.data);
            setDataDowntime(shipResoponse.data);
            setDataFuelout(shipResoponse.data);
            return shipResoponse.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const optionTimah = {
        yaxis: {
            show: true,
            tickAmount: 5,
            min: 0,
            max: 500,
        },
        chart: {
            toolbar: {
                show: false,
            },
        },
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        fill: {
            opacity: 0.4,
        },
    };

    const optionTailing = {
        yaxis: {
            show: true,
            tickAmount: 5,
            min: 0,
            max: 500,
        },
        chart: {
            toolbar: {
                show: false,
            },
        },
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        fill: {
            opacity: 0.4,
        },
    };

    const optionDowntime = {
        yaxis: {
            show: true,
            tickAmount: 5,
            min: 0,
            max: 100,
        },
        chart: {
            toolbar: {
                show: false,
            },
        },
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        fill: {
            opacity: 0.4,
        },
    };

    const optionFuelout = {
        yaxis: {
            show: true,
            tickAmount: 5,
            min: 0,
            max: 500,
        },
        chart: {
            toolbar: {
                show: false,
            },
        },
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        fill: {
            opacity: 0.4,
        },
    };

    const seriesTimah = dataTimah.map((item) => {
        const seriesData = Object.entries(item.data.summary).map(
            ([month, summary]) => ({
                x: month.toString(),
                y: summary.timah,
            }),
        );

        return {
            name: item.data.ship.name,
            data: seriesData,
        };
    });

    const seriesTailing = dataTailing.map((item) => {
        const seriesData = Object.entries(item.data.summary).map(
            ([month, summary]) => ({
                x: month.toString(),
                y: summary.tailing,
            }),
        );

        return {
            name: item.data.ship.name,
            data: seriesData,
        };
    });

    const seriesDowntime = dataDowntime.map((item) => {
        const seriesData = Object.entries(item.data.summary).map(
            ([month, summary]) => ({
                x: month.toString(),
                y: summary.downtime,
            }),
        );

        return {
            name: item.data.ship.name,
            data: seriesData,
        };
    });

    const seriesFuelout = dataFuelout.map((item) => {
        const seriesData = Object.entries(item.data.summary).map(
            ([month, summary]) => ({
                x: month.toString(),
                y: summary.fuel_out,
            }),
        );

        return {
            name: item.data.ship.name,
            data: seriesData,
        };
    });

    return (
        <div className="flex flex-col sm:flex-row mx-2 sm:mx-4 gap-3 mt-2">
            <div className="w-full">
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                    selected
                                        ? "bg-white text-blue-700 shadow"
                                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                                )
                            }
                        >
                            Timah
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                    selected
                                        ? "bg-white text-blue-700 shadow"
                                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                                )
                            }
                        >
                            Tailing
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                    selected
                                        ? "bg-white text-blue-700 shadow"
                                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                                )
                            }
                        >
                            Downtime
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                    selected
                                        ? "bg-white text-blue-700 shadow"
                                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                                )
                            }
                        >
                            Fuel
                        </Tab>
                    </Tab.List>
                    {loading ? (
                        <Loader />
                    ) : (
                        <Tab.Panels className="mt-2">
                            <Tab.Panel
                                className={classNames(
                                    "rounded-xl bg-white p-3",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                )}
                            >
                                <ReactApexChart
                                    options={optionTimah}
                                    series={seriesTimah}
                                    type="bar"
                                    height="390"
                                />
                            </Tab.Panel>
                            <Tab.Panel
                                className={classNames(
                                    "rounded-xl bg-white p-3",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                )}
                            >
                                <ReactApexChart
                                    options={optionTailing}
                                    series={seriesTailing}
                                    type="bar"
                                    height="390"
                                />
                            </Tab.Panel>
                            <Tab.Panel
                                className={classNames(
                                    "rounded-xl bg-white p-3",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                )}
                            >
                                <ReactApexChart
                                    options={optionDowntime}
                                    series={seriesDowntime}
                                    type="bar"
                                    height="390"
                                />
                            </Tab.Panel>
                            <Tab.Panel
                                className={classNames(
                                    "rounded-xl bg-white p-3",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                )}
                            >
                                <ReactApexChart
                                    options={optionFuelout}
                                    series={seriesFuelout}
                                    type="bar"
                                    height="390"
                                />
                            </Tab.Panel>
                        </Tab.Panels>
                    )}
                </Tab.Group>
            </div>
        </div>
    );
};

const DefaultDashboard = ({}) => {
    return (
        <>
            <Statistics />
        </>
    );
};

export default DefaultDashboard;
