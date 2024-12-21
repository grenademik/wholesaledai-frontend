import { useState } from "react";

const useFilters = (initialFilters) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleTagsChange = (selectedID) => {
        if (!selectedID) {
            selectedID = null;
        }

        setFilters((prevFilters) => {
            let updatedTags;
            if (prevFilters.tags) {
                const tagsArray = prevFilters.tags.split(',');
                const tagIndex = tagsArray.indexOf(selectedID.toString());
                if (tagIndex !== -1) {
                    tagsArray.splice(tagIndex, 1);
                    updatedTags = tagsArray.length > 0 ? tagsArray.join(',') : null;
                } else {
                    updatedTags = `${prevFilters.tags},${selectedID}`;
                }
            } else {
                updatedTags = selectedID === '' ? null : selectedID.toString();
            }
            return {
                ...prevFilters,
                tags: updatedTags,
                page: 1,
            };
        });
    };

    const handlePageChange = (selectedPage) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            page: selectedPage,
        }));
    };

    const clearFilters = () => {
        setFilters({
            ordering: null,
            page: 1,
            size: 4,
            search: null,
            tags: null,
        });
    };

    return {
        filters,
        setFilters,
        handleTagsChange,
        handlePageChange,
        clearFilters,
    };
};

export default useFilters;