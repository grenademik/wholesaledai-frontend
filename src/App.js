import './App.css';
import Header from './components/header/Header';
import Navigation from './components/navigation/Navigation';
import About from './pages/About';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Footer from './components/footer/Footer';
import MobileApp from './components/mobileApp/MobileApp';
import Product from './components/product/Product';
import Checkout from './components/checkout/Checkout';
import Order from './components/order/Order';
import FooterHeader from './components/footerHeader/FooterHeader';
import SideBar from './components/sideBar/SideBar';
import DrawerCart from './components/drawer/Drawer';
import Search from './components/search/Search';
import Login from './components/login/Login';
import Register from './components/register/Register';
import ForgetPassword from './components/forgetPassword/ForgetPassword';
import ResetPassword from './components/forgetPassword/ResetPassword';
import ChangePassword from './components/forgetPassword/ChangePassword';
import VerifyOtp from './components/verifyOtp/VerifyOtp';
import { Fragment, useState } from 'react';
import User from './components/user/User';
import Dashboard from './components/dashboard/Dashboard';
import MyOrders from './components/myOrders/MyOrders';
// import Paypal from './components/paypal/Paypal';
import UpdateProfile from './components/updateProfile/UpdateProfile';
import UpdatePassword from './components/updatePassword/UpdatePassword';
import Offers from './pages/Offers';
import Layout from './Layout';
import ProtectedRoutes from './context/ProtectedRoutes';
import { useUserFromLocalStorage } from './store/reducers/userSlice';

function App() {
	let [isOpenRegister, setIsOpenRegister] = useState(false);
	useUserFromLocalStorage();
	return (
		<Fragment>
			{/* <Header /> */}
			<Navigation />
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route element={<ProtectedRoutes />}>
						<Route path="/" element={<Home />} />
						<Route path="about-us" element={<About />} />
						<Route path="contact-us" element={<Contact />} />
						<Route path={'product/:productTitle'} element={<Product />} />
						<Route path="search" element={<Search />} />
						<Route path={'order/:id'} element={<Order />} />
						<Route
							path={'forget-password'}
							element={<ForgetPassword setIsOpenRegister={setIsOpenRegister} />}
						/>
						<Route
							path={'reset-password/:token'}
							element={<ResetPassword setIsOpenRegister={setIsOpenRegister} />}
						/>
						<Route path={'verify-otp/:token/:email'} element={<VerifyOtp />} />
						<Route path="change-password/:token" element={<ChangePassword />} />

						<Route path="checkout" element={<Checkout />} />
						<Route path="offer" element={<Offers />} />
						<Route path="user" element={<User />}>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="my-orders" element={<MyOrders />} />
							<Route path="update-profile" element={<UpdateProfile />} />
							<Route path="update-password" element={<UpdatePassword />} />
						</Route>
					</Route>
					<Route path="*" element={<Home />} />
				</Route>
			</Routes>
			<div>
				<FooterHeader />
			</div>
			<div>
				<SideBar />
				<DrawerCart />
				<Login setIsOpenRegister={setIsOpenRegister} />
				<Register
					isOpen={isOpenRegister}
					setIsOpenRegister={setIsOpenRegister}
				/>
			</div>
			<div className="w-full">
				<MobileApp />
				<Footer />
			</div>
		</Fragment>
	);
}

export default App;
