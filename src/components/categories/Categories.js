import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { getCategoriesData } from "../../fakeData/CategoriesData";
import { searchAction } from "../../store/reducers/searchSlice";
import useFetch from "../../utils/useFetch";
import convertToQueryParams from "../../utils/convertToQueryParams";
import useFilters from "../../hooks/useFilters";


function Categories() {

  const Api = `inventory/categories/`
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = (value) => {
    navigate("/search?Category=" + value);
    // const category =
    //   value.includes("--") === true
    //     ? value.split("--").join(" ")
    //     : value.split("-").join(" ");

    dispatch(searchAction({ value: value, path: "Category" }));
  };

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


  console.log(data)
  return (
    <div className="bg-gray-100 lg:py-16 py-10">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="mb-10 flex justify-center">
          <div className="text-center w-full lg:w-2/5">
            <h2 className="text-xl lg:text-2xl mb-2  font-semibold">
              Featured Categories
            </h2>
            <p className="text-base font-sans text-gray-600 leading-6">
              Choose your necessary products from this feature categories.
            </p>
          </div>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error.message}</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2">
            {data?.results.map((category, index) => {
              return (
                <li className="group" key={index}>
                  <Link to={"/search?Category=" + category.id} className="flex h-full w-full !no-underline border border-gray-100 rounded-lg capitalize shadow-sm bg-white p-4 cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-lg">
                    <div className="flex flex-row w-full justify-center items-center">
                      <div className="text-center">
                        <h3 className="text-sm font-medium leading-tight line-clamp-1  !text-gray-600 group-hover:!text-emerald-500">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Categories;
