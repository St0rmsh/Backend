import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, createProductReview } from "../services/product.service";
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
            // Updating the active product state with the returned product
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
        handleAddReview
    };
}