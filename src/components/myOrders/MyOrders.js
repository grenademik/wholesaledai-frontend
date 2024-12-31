import React, { useEffect, useState } from 'react';
import Table from '../table/Table';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { get } from '../../api';

const MyOrders = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(null);
	const [orders, setOrders] = useState([]);
	const { user } = useSelector((state) => state.user);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const getOrders = async () => {
		try {
			setIsLoading(true); // Start loading state
			setIsError(null); // Reset any previous errors
			const res = await get(`sales/order-summaries/`);
			console.log(res)
			const data = res.results;
			setOrders(data || []);
			setIsLoading(false);
			toast.success("Orders loaded successfully!");
			console.log(data);
		} catch (error) {
			console.error(error);
			setIsError(
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				error?.message ||
				"Something went wrong!"
			);
			setIsLoading(false);
			toast.error("Failed to fetch orders.");
		}
	};

	useEffect(() => {
		getOrders();
	}, []);

	console.log(orders)
	return (
		<div className="overflow-hidden">
			<h2 className="text-xl text-black font-semibold mb-5">My Orders</h2>
			<Table data={orders} loading={isLoading} error={isError} />
		</div>
	);
};

export default MyOrders;
