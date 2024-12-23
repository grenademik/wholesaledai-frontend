import React from "react";
import useFetch from "../../utils/useFetch";
import convertToQueryParams from "../../utils/convertToQueryParams";
import useFilters from "../../hooks/useFilters";
import Card from "../card/Card";

function PopularProduct() {
  const Api = `inventory/products/`;

  const {
    filters,
    setFilters,
    handleTagsChange,
    handlePageChange,
    clearFilters,
  } = useFilters({
    ordering: null,
    is_active: null,
    page: 1,
    size: 20,
    search: null,
    tags: null,
  });

  const { data, loading, error } = useFetch(`${Api}${convertToQueryParams(filters)}`);

  return (
    <div
      id="discount"
      className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
    >
      <div className="mb-10 flex justify-center">
        <div className="text-center w-full lg:w-2/5">
          <h2 className="text-xl lg:text-2xl mb-2 text-black font-semibold">
            Popular Products for Daily Shopping
          </h2>
          <p className="text-base text-gray-600 leading-6">
            See all our popular products in this week. You can choose your daily
            needs products from this list and get some special offer with free
            shipping.
          </p>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : (
        <div className="flex">
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ">
              {data?.results.map((product, index) => (
                <Card key={index} data={
                  product
                } />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopularProduct;
