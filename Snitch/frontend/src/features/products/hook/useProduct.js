import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, createProductReview, fetchAllPublicProducts, fetchPublicProductById, getProductReviews, updateReview, deleteReview } from "../services/product.service";
import { setProducts, setProduct, setLoading, setError, removeProduct, updateProductState } from "../state/product.slice";



export const useProduct = () => {

    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
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
    };

    const handleGetAllProducts = async () => {
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
    };

    const handleGetProductById = async (productId) => {
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
    };

    const handleUpdateProduct = async (productId, data) => {
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
    };

    const handleDeleteProduct = async (productId) => {
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
    };

    const handleAddReview = async (productId, reviewData) => {
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
    };

    // ─── PUBLIC HANDLERS ────────────────────────────────

    const handleFetchAllPublicProducts = async () => {
        try {
            dispatch(setLoading(true));
            const data = await fetchAllPublicProducts();
            dispatch(setProducts(data.products));
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
    };

    const handleFetchPublicProductById = async (productId) => {
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
    };

    // ─── REVIEW CRUD HANDLERS ───────────────────────────

    const handleGetReviews = async (productId) => {
        try {
            const data = await getProductReviews(productId);
            return data.reviews;
        } catch (error) {
            const formattedError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            };
            throw formattedError;
        }
    };

    const handleUpdateReview = async (productId, reviewId, data) => {
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
    };

    const handleDeleteReview = async (productId, reviewId) => {
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
    };

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
    };
}