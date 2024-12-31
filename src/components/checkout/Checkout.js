import { Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import OrderSummary from '../orderSummary/OrderSummary';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import randomId from 'random-id';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Payment from '../payment/Payment';
import { postApi } from '../../api';

const SignupSchema = Yup.object().shape({
	firstName: Yup.string().required('First Name is required!'),
	lastName: Yup.string().required('Last name is required!'),
	email: Yup.string()
		.email('Invalid email')
		.required('Email address is required!'),
	phoneNumber: Yup.string().required('Phone number is required!'),
	address: Yup.string().required('Street address is required!'),
	city: Yup.string().required('City is required!'),
});

function Checkout() {
	let [isPayment, setIsPayment] = useState(false);
	let [order, setOrder] = useState('');
	let [isloading, setIsLoading] = useState(false);
	let [isError, setIsError] = useState(false);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	let navigate = useNavigate();
	var Id = randomId(30, 'aA0');
	const { cartTotalAmount } = useSelector((state) => state.cart);
	const { ...item } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.user);
	const [shippingPrice, setShippingPrice] = useState('50');

	const onchangeSubmit = async (value) => {
		console.log("Submitting order...");

		if (cartTotalAmount <= 50) {
			return toast.error("Order items must be worth more than $50");
		}

		const shippingPrice = value.shippingOption === "fedx" ? 50 : 60;

		const orderedItems = item.cartItems.map((cartItem) => ({
			quantity: cartItem.cartQuantity,
			inventory_item: cartItem.id || cartItem[0]?.id, // Adjust based on structure
		}));

		const orderData = {
			buyer_name: `${value.firstName} ${value.lastName}`,
			contact_number: value.phoneNumber,
			shipping_address: value.address,
			status: "draft",
			buyer: user?.user?.id || user?.user?._id, // Adjust based on user object
			ordered_items: orderedItems,
			paymentMethod: value.paymentMethod || "COD", // Ensure this field is set
		};


		if (orderData.paymentMethod === "COD") {
			try {
				setIsLoading(true); // Start loading state
				const res = await postApi(`sales/order-summaries/`, orderData);
				const data = res.order_number;
				setIsLoading(false);
				toast.success(data.message);
				console.log(data);

				// Uncomment and update navigation logic as needed
				// navigate(`./order/${data.id}`);
			} catch (error) {
				const errorMessage =
					error?.response?.data?.error ||
					error?.response?.data?.message ||
					error?.response?.data?.error?.message ||
					error?.message;

				toast.error(errorMessage);
				setIsError(errorMessage);
				setTimeout(() => {
					setIsError(false);
				}, 2000);
				setIsLoading(false); // Reset loading state on error
			}
		} else {
			setIsPayment(true);
			setOrder(orderData); // Pass data to payment flow
		}
	};



	return (
		<div className="bg-gray-50">
			<div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
				<div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
					<div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
						<div className="mt-5 md:mt-0 md:col-span-2">
							<Formik
								initialValues={{
									firstName: user?.user?.given_name,
									lastName: user?.user?.family_name,
									email: user?.user?.email,
									phoneNumber: user?.user?.phone_number,
									address: user?.user?.address,
								}}
								validationSchema={SignupSchema}
								onSubmit={(values, { setSubmitting }) => {
									console.log('Submitting:', values);
									onchangeSubmit(values);
									setSubmitting(false);
								}}
							>
								{({ errors, touched, onchangeSubmit }) => {
									return (
										<Form>
											<div>
												<h2 className="font-semibold  text-base text-gray-700 pb-3">
													01. Personal Details
												</h2>
												<div className="grid grid-cols-6 gap-6">
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="firstName"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															First Name
														</label>
														<div className="relative">
															<Field
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg:white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
																id="firstName"
																name="firstName"
																placeholder="Samet"
															/>
														</div>
														{errors.firstName && touched.firstName && (
															<span className="text-red-400 text-sm mt-2">
																{errors.firstName}
															</span>
														)}
													</div>
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="lastName"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Last Name
														</label>
														<div className="relative">
															<Field
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg:white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
																id="lastName"
																name="lastName"
																placeholder="Kaya"
															/>
														</div>
														{errors.lastName && touched.lastName && (
															<span className="text-red-400 text-sm mt-2">
																{errors.lastName}
															</span>
														)}
													</div>
													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="email"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Email Address
														</label>
														<div className="relative">
															<Field
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg:white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
																id="email"
																name="email"
																placeholder="info@gmail.com"
															/>
														</div>
														{errors.email && touched.email && (
															<span className="text-red-400 text-sm mt-2">
																{errors.email}
															</span>
														)}
													</div>

													<div className="col-span-6 sm:col-span-3">
														<label
															htmlFor="phoneNumber"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Phone Number
														</label>
														<div className="relative">
															<Field
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg:white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
																id="phoneNumber"
																name="phoneNumber"
																placeholder="+977-9812345678"
															/>
														</div>
														{errors.phoneNumber && touched.phoneNumber && (
															<span className="text-red-400 text-sm mt-2">
																{errors.phoneNumber}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="mt-12">
												<h2 className="font-semibold  text-base text-gray-700 pb-3">
													02. Shipping Details
												</h2>
												<div className="grid grid-cols-6 gap-6 mb-8">
													<div className="col-span-4 ">
														<label
															htmlFor="address"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															Street Address
														</label>
														<div className="relative">
															<Field
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg:white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
																id="address"
																name="address"
																placeholder="Newroad - 12, Pokhara, Nepal"
															/>
														</div>
														{errors.streetAddress && touched.streetAddress && (
															<span className="text-red-400 text-sm mt-2">
																{errors.streetAddress}
															</span>
														)}
													</div>
													<div className="col-span-6 sm:col-span-6 lg:col-span-2">
														<label
															htmlFor="city"
															className="block text-gray-500 font-medium text-sm leading-none mb-2"
														>
															City
														</label>
														<div className="relative">
															<Field
																className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg:white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
																id="city"
																name="city"
																placeholder="Pokhara"
															/>
														</div>
														{errors.city && touched.city && (
															<span className="text-red-400 text-sm mt-2">
																{errors.city}
															</span>
														)}
													</div>
												</div>

											</div>

											<div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
												<div className="col-span-6 sm:col-span-3">
													<Link
														className="bg-indigo-50 border !no-underline border-indigo-100 rounded py-3 text-center text-sm font-medium !text-gray-700  hover:!text-gray-800 hover:border-gray-300 transition-all flex justify-center w-full"
														to="/"
													>
														<span className="text-xl mr-2">
															<svg
																stroke="currentColor"
																fill="currentColor"
																strokeWidth="0"
																viewBox="0 0 512 512"
																height="1em"
																width="1em"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fill="none"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="32"
																	d="M112 160l-64 64 64 64"
																></path>
																<path
																	fill="none"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="32"
																	d="M64 224h294c58.76 0 106 49.33 106 108v20"
																></path>
															</svg>
														</span>
														Continue Shopping
													</Link>
												</div>
												<div className="col-span-6 sm:col-span-3">
													<button
														type="submit"
														disabled={isloading}

														className="bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 transition-all rounded py-3 text-center text-sm  font-medium text-white flex justify-center w-full"
													>
														Confirm Order{' '}
														<span className="text-xl ml-2">
															{' '}
															<svg
																stroke="currentColor"
																fill="currentColor"
																strokeWidth="0"
																viewBox="0 0 512 512"
																height="1em"
																width="1em"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fill="none"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="48"
																	d="M268 112l144 144-144 144m124-144H100"
																></path>
															</svg>
														</span>
													</button>
												</div>
											</div>
										</Form>
									);
								}}

							</Formik>
						</div>
					</div>
					<OrderSummary />
				</div>
			</div>
			{/* <Payment isOpen={isPayment} setIsPayment={setIsPayment} order={order} /> */}
		</div >
	);
}

export default Checkout;
