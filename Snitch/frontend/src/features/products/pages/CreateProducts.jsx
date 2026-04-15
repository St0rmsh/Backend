import React from 'react'
import { useProduct } from '../hook/useProduct'
import { useSelector } from 'react-redux';
import { useState } from 'react';

const CreateProducts = () => {
    const {handleCreateProduct} = useProduct();
    const {loading,error} = useSelector((state) => state.product);

    const [formData,setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: []
    })
  return (
    <div>CreateProducts</div>
  )
}

export default CreateProducts