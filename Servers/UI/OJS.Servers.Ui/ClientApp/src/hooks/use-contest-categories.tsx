const categoriesFlat = useMemo(
    () => flattenWith(categories, (c) => c.children || null),
    [ categories ],
);

const value = useMemo(
    () => ({
        state: {
            categories,
            isLoaded: categories.length > 0 && isSuccess,
            categoriesFlat,
        },
        actions: { load },
    }),
    [ categories, isSuccess, load, categoriesFlat ],
);

return (
    <ContestCategoriesContext.Provider value={value}>
        {children}
    </ContestCategoriesContext.Provider>
);
};

const useContestCategories = () => useContext(ContestCategoriesContext);

export default ContestCategoriesProvider;

export {
    useContestCategories,
};