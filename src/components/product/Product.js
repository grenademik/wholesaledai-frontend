import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Informations from "../informations/Informations";
import SocialNetwork from "../socialNetwork/SocialNetwork";
import { addByIncrement } from "../../store/reducers/cartSlice";
import useFetch from "../../utils/useFetch";
import "./product.css";
import CustomGallery from "../customGallery/CustomGallery";


function Product() {
  const [total, setTotal] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [filteredInventory, setFilteredInventory] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { productTitle } = useParams();
  const Api = `inventory/products`;
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, loading, error } = useFetch(`${Api}/${productTitle}/`);

  useEffect(() => {
    if (data && data.inventories_details) {
      const filtered = data.inventories_details.filter((inventory) => {
        return (
          Object.values(selectedAttributes).some((value) => value) &&
          Object.entries(selectedAttributes).every(
            ([key, value]) => !value || inventory.attributes[key] === value
          )
        );
      });
      setCurrentIndex(0);
      setFilteredInventory(filtered);
    }
  }, [selectedAttributes, data]);

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleAddToCart = (inventory) => {
    if (inventory && inventory.length > 0) {
      const product = inventory[0]; // Extract the single product from the array
      console.log(product); // Log the single product object
      dispatch(addByIncrement({ product, cartQuantity: total }));
    }
  };


  const galleryImages = [
    data?.thumbnail_image,
    ...(Array.isArray(data?.inventories_details)
      ? data?.inventories_details.flatMap(item => [
        item.thumbnail_image,
        ...(item.extra_images || [])
          .filter(image => image.is_active)
          .map(image => image.image)
      ])
      : [])
  ];

  const images = filteredInventory?.length > 0
    ? filteredInventory.flatMap((inventory) => [
      inventory.thumbnail_image,
      ...(Array.isArray(inventory.extra_images)
        ? inventory.extra_images
          .filter((image) => image.is_active)
          .map((image) => image.image)
        : [])
    ])
    : galleryImages;

  return (
    <div className="bg-gray-50">
      {loading ? <div>Loading...</div> : error ? <div>Error: {error.message}</div> : (
        <div className="px-0 py-10 lg:py-10">
          <div className="mx-auto px-3 lg:px-10 max-w-screen-2xl">
            <div className="flex items-center pb-4">
              <ol className="flex items-center w-full overflow-hidden">
                <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer  font-semibold">
                  <Link
                    className="!no-underline !text-black hover:!text-emerald-500"
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-sm mt-[1px]">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
                <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-emerald-500 font-semibold">
                  {/* <Link
                    className="!no-underline !text-black hover:!text-emerald-500"
                    to={`/search?category=${data.children
                      .toLowerCase()
                      .split(" ")
                      .join("-")}`}
                  >
                    {data.children}
                  </Link> */}
                </li>
                <li className="text-sm mt-[1px]">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
                <li className="text-sm px-1 transition duration-200 ease-in ">
                  {data?.name}
                </li>
              </ol>
            </div>
            <div className="w-full rounded-lg p-3 lg:p-12 bg-white">
              <div className="flex flex-col xl:flex-row">
                <div className="flex-shrink-0 xl:pr-10 lg:block w-full mx-auto md:w-6/12 lg:w-5-12 xl:w-4/12">
                  {/* {data.discount === 0 ? "" : (
                    <span className=" text-dark text-sm bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 right-4 top-4">
                      {Math.ceil(data.discount)}% Off
                    </span>
                  )} */}
                  <CustomGallery
                    width="100%"
                    className="w-full h-auto"
                    images={images}
                    initialIndex={currentIndex}
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row">
                    <div className="w-full md:w-7/12 md:pr-4 lg:pr-4 xl:pr-12">
                      <div className="mb-2">
                        <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold text-gray-800 capitalize">
                          {data?.name}
                        </h1>
                      </div>
                      <div className="font-bold">
                        <span className="inline-block text-xl">
                          {filteredInventory?.length > 0
                            ? filteredInventory.length > 1
                              ? `Rs. ${Math.min(...filteredInventory.map(item => parseFloat(item.price)))} - Rs. ${Math.max(...filteredInventory.map(item => parseFloat(item.price)))}`
                              : `Rs. ${filteredInventory[0].price}`
                            : `Rs. ${data?.properties?.price_range?.lowest_price} - ${data?.properties?.price_range?.highest_price}`
                          }
                        </span>
                        {data?.originalPrice === data.price ? "" : (
                          <del className="text-lg font-normal text-gray-400 ml-1">
                            Rs. {data.originalPrice}
                          </del>
                        )}
                      </div>
                      <div className="mb-4">
                        <p
                          className={`text-sm leading-6 text-gray-500 md:leading-7 mb-2 ${!isExpanded ? "line-clamp-3" : ""
                            }`}
                        >
                          {data.description}
                        </p>
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-blue-500"
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      </div>

                      <div>

                        <div>
                          {Object.keys(data.attributes).map((attributeKey) => (
                            <div key={attributeKey}>
                              <label className="capitalize text-xs font-bold">{attributeKey}:</label>
                              <div className="flex space-x-1">
                                {data.attributes[attributeKey].map((value) => {
                                  const isDisabled = !data.inventories_details.some(
                                    (inventory) =>
                                      inventory.attributes[attributeKey] === value &&
                                      Object.entries(selectedAttributes).every(
                                        ([key, selectedValue]) =>
                                          key === attributeKey ||
                                          !selectedValue ||
                                          inventory.attributes[key] === selectedValue
                                      )
                                  );
                                  return (
                                    <button
                                      key={value}
                                      className={`px-3 py-1 rounded mb-4 text-xs ${selectedAttributes[attributeKey] === value
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gray-200 text-black"
                                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                      onClick={() =>
                                        !isDisabled && handleAttributeChange(attributeKey, value)
                                      }
                                      disabled={isDisabled}
                                    >
                                      {value}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {filteredInventory ? (
                          <div>
                            <p>SKU: {filteredInventory.sku}</p>
                            <div className="flex items-center mt-4">
                              <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                                <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 md:h-12 border-gray-300">
                                  <button
                                    onClick={() => setTotal(total - 1)}
                                    disabled={total <= 1 ? true : false}
                                    className="flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-e border-gray-300 hover:text-gray-500"
                                  >
                                    <span className="text-dark text-base">
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                    </span>
                                  </button>
                                  <p className="font-semibold flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-heading w-8 md:w-20 xl:w-24">
                                    {total}
                                  </p>
                                  <button
                                    disabled={data.quantity === 0 ? true : false}
                                    onClick={() => {

                                      setTotal(total + 1)
                                    }} className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-s border-gray-300 hover:text-gray-500">
                                    <span className="text-dark text-base">
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                    </span>
                                  </button>
                                </div>

                                <button disabled={data.quantity === 0 ? true : false} onClick={() => handleAddToCart(filteredInventory)} className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-4 ml-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white bg-emerald-500 hover:bg-emerald-600 w-full h-12">
                                  Add To Cart
                                </button>
                              </div>

                            </div>
                            <div className="mb-4 md:mb-5 block">
                              {filteredInventory.stock !== 0 && (
                                <span className="bg-emerald-100 text-emerald-600 rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold mt-2 ">
                                  In Stock
                                </span>
                              )}
                              {filteredInventory.stock === 0 && (
                                <span className="bg-red-100 text-red-600 rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold  mt-2">
                                  Stock Out
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-red-500">Select the attributes.</p>
                        )}
                        <div className="flex flex-col mt-4">
                          <span className=" font-semibold py-1 text-sm d-block">
                            <span className="text-gray-700">Category: </span>
                            <span className="text-gray-500">
                              {data.children}
                            </span>
                          </span>
                          <div className="flex flex-row">
                            {data?.tags
                              ?.split(' ')
                              .map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-50 mr-2 border-0 text-gray-600 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-semibold mt-2"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                          <SocialNetwork />
                        </div>
                      </div>
                    </div>
                    <Informations />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-10 llg:pt-20 lg:pb-10">
              <h3 className="leading-7 text-lg lg:text-xl mb-3 font-semibold  hover:text-gray-600">
                Related Products
              </h3>
              <div className="flex">
                <div className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ">
                    {/* {RelatedProduct.map((data, index) => (
                      <Card key={index} data={data} />
                    ))} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )};
    </div>
  );
}

export default Product;
