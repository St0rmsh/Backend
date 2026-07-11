import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    createProductReview, 
    fetchAllPublicProducts, 
    fetchPublicProductById, 
    getProductReviews, 
    getSellerReviews, 
    updateReview, 
    deleteReview, 
    addProductVariant, 
    deleteProductVariant, 
    fetchCompleteTheLook,
    joinRestockWaitlist
} from "../services/product.service";
import { 
    setProducts, 
    setPagination, 
    setProduct, 
    setLoading, 
    setError, 
    removeProduct, 
    updateProductState 
} from "../state/product.slice";

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = useCallback(async (formData) => {
        try {
            dispatch(setLoading(true));
            const response = await createProduct(formData);
            dispatch(setProduct(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetAllProducts = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await getAllProducts();
            dispatch(setProducts(data.products))
            return data.products;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetProductById = useCallback(async (productId) => {
        try {
            dispatch(setLoading(true));
            const response = await getProductById(productId);
            dispatch(setProduct(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const handleUpdateProduct = useCallback(async (productId, data) => {
        try {
            dispatch(setLoading(true));
            const response = await updateProduct(productId, data);
            dispatch(updateProductState(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteProduct = useCallback(async (productId) => {
        try {
            dispatch(setLoading(true));
            await deleteProduct(productId);
            dispatch(removeProduct(productId));
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleAddProductVariant = useCallback(async (productId, data) => {
        try {
            dispatch(setLoading(true));
            const response = await addProductVariant(productId, data);
            dispatch(updateProductState(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteProductVariant = useCallback(async (productId, variantId) => {
        try {
            dispatch(setLoading(true));
            const response = await deleteProductVariant(productId, variantId);
            dispatch(updateProductState(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleAddReview = useCallback(async (productId, reviewData) => {
        try {
            dispatch(setLoading(true));
            const response = await createProductReview(productId, reviewData);
            dispatch(setProduct(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ─── PUBLIC HANDLERS ────────────────────────────────

    const handleFetchAllPublicProducts = useCallback(async (params = {}) => {
        try {
            dispatch(setLoading(true));
            const data = await fetchAllPublicProducts(params);
            dispatch(setProducts(data.products));
            if (data.pagination) {
                dispatch(setPagination({
                    total: data.pagination.total,
                    pages: data.pagination.pages
                }));
            }
            return data;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleFetchPublicProductById = useCallback(async (productId) => {
        try {
            dispatch(setLoading(true));
            const data = await fetchPublicProductById(productId);
            dispatch(setProduct(data.product));
            return data.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ─── REVIEW CRUD HANDLERS ───────────────────────────

    const handleGetReviews = useCallback(async (productId) => {
        try {
            const data = await getProductReviews(productId);
            return data;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            throw formattedError;
        }
    }, []);

    const handleGetSellerReviews = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await getSellerReviews();
            return data;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateReview = useCallback(async (productId, reviewId, data) => {
        try {
            dispatch(setLoading(true));
            const response = await updateReview(productId, reviewId, data);
            dispatch(setProduct(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteReview = useCallback(async (productId, reviewId) => {
        try {
            dispatch(setLoading(true));
            const response = await deleteReview(productId, reviewId);
            dispatch(setProduct(response.product));
            return response.product;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            dispatch(setError(formattedError));
            throw formattedError;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);


    const handleJoinRestockWaitlist = useCallback(async (productId, variantId) => {
        try {
            const data = await joinRestockWaitlist(productId, variantId);
            return data;
        } catch (error) {
            const formattedError = { message: error.response?.data?.message || error.message };
            throw formattedError;
        }
    }, []);

    const handleFetchCompleteTheLook = useCallback(async (productId) => {
        try {
            const data = await fetchCompleteTheLook(productId);
            return data.suggestions || [];
        } catch (error) {
            console.error("Complete the look fetch failed", error);
            return [];
        }
    }, []);

    return {
        handleCreateProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleUpdateProduct,
        handleDeleteProduct,
        handleAddReview,
        handleFetchAllPublicProducts,
        handleFetchPublicProductById,
        handleGetReviews,
        handleUpdateReview,
        handleDeleteReview,
        handleGetSellerReviews,
        handleAddProductVariant,
        handleDeleteProductVariant,
        handleJoinRestockWaitlist,
        handleFetchCompleteTheLook,
    };
}