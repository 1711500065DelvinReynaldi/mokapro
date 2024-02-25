import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader";
import { ClockIcon } from "@heroicons/react/20/solid";

interface ShipData {
    status: number;
    description: string;
    data: {
        ship: {
            id: number;
            name: string;
            code: string;
            thumbnail: string;
            color_theme: string;
            usage_status: string;
            current_status: string;
        };
        statistic: {
            downtime: number;
            fuel_in: number;
            fuel_out: number;
            timah: number;
            tailing: number;
        };
    };
}

const Logsheet = () => {
    const [ships, setShips] = useState<ShipData[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleClick = (id: number) => {
        navigate(`/ship/${id}`);
    };

    const fetchData = async () => {
        try {
            const shipResoponse = await Axios.get(
                `https://api.greenforgood.id/odyssey/ship`,
            );
            setShips(shipResoponse.data);
            setLoading(false);
            return shipResoponse.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : ships.length === 0 ? (
                <p className="mx-auto text-center">No data available.</p>
            ) : (
                <div className="m-2 grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
                    {ships.map((item) => (
                        <div
                            className="p-8 m-2 shadow-md hover:shadow-lg rounded-lg bg-white"
                            key={item.data.ship.id}
                        >
                            <div className="flex justify-between mb-4">
                                <p className="text-lg font-semibold text-neutral-700">
                                    {item.data.ship.name}
                                </p>
                                <p className="mt-0.5  text-neutral-400 text-sm">
                                    {item.data.ship.code}
                                </p>
                            </div>

                            <img
                                src={item.data.ship.thumbnail}
                                className="mx-auto w-60 h-30 rounded-md my-2"
                                alt={item.data.ship.name}
                            />

                            <div className="flex items-center justify-between mt-5">
                                <div className="flex items-center">
                                    <ClockIcon className="h-5 w-5 stroke-gray-400 mr-2" />
                                    <span className="text-neutral-400 text-sm">
                                        Downtime
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-neutral-400 text-sm">
                                        {item.data.statistic.downtime}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-dashed space-y-4 p-2">
                                <div className="flex justify-between group">
                                    <div>
                                        <p className="text-lg text-neutral-600">
                                            Fuel In
                                        </p>
                                    </div>
                                    <span className="text-lg text-neutral-600">
                                        {item.data.statistic.fuel_in}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-dashed space-y-4 p-2">
                                <div className="flex justify-between group">
                                    <div>
                                        <p className="text-lg text-neutral-600">
                                            Fuel Out
                                        </p>
                                    </div>
                                    <span className="text-lg text-neutral-600">
                                        {item.data.statistic.fuel_out}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-dashed space-y-4 p-2">
                                <div className="flex justify-between group">
                                    <div>
                                        <p className="text-lg text-neutral-600">
                                            Timah
                                        </p>
                                    </div>
                                    <span className="text-lg text-neutral-600">
                                        {item.data.statistic.timah}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-dashed space-y-4 p-2">
                                <div className="flex justify-between group">
                                    <div>
                                        <p className="text-lg text-neutral-600">
                                            Tailing
                                        </p>
                                    </div>
                                    <span className="text-lg text-neutral-600">
                                        {item.data.statistic.tailing}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center mt-8">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleClick(item.data.ship.id)
                                    }
                                    className="rounded-xl bg-blue-500 hover:bg-blue-900 px-10 py-2 text-white"
                                >
                                    Open
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Logsheet;
