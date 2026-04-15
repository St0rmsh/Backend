import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getProductById } from "../services/product.service";
import { setProducts, setProduct, setLoading, setError } from "../state/product.slice";



export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
        try {
            dispatch(setLoading(true));
            const response = await createProduct(formData);
            dispatch(setProduct(response.data));
            dispatch(setLoading(false));
            return response.data;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetAllProducts = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getAllProducts();
            dispatch(setProducts(response.data));
            dispatch(setLoading(false));
            return response.data;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetProductById = async (productId) => {
        try {
            dispatch(setLoading(true));
            const response = await getProductById(productId);
            dispatch(setProduct(response.data));
            dispatch(setLoading(false));
            return response.data;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    };

    return {
        handleCreateProduct,
        handleGetAllProducts,
        handleGetProductById
    };
}