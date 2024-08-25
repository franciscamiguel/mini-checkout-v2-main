"use client";

import { useState, useEffect } from "react";

import ProductModal from "./ProductModal";

import axios from "axios";

import { FilePlus2 } from "lucide-react";

import ProductCard from "./ProductCard";

interface Product {
  id: string;

  name: string;

  description: string;

  image: string;

  price: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");

        setProducts(data);

        setIsLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/products?id=${id}`);

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-48 w-48 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <h1 className="text-3xl font-bold text-black">Products</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
              aria-label="Add New Product"
            >
              <FilePlus2 size={20} />
              <span className="text-lg">New Product</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                picture={product.image}
                description={product.description}
                name={product.name}
                price={product.price}
                link={`/checkout/${product.id}`}
                onDelete={() => handleDelete(product.id)}
                onEdit={() => handleEdit(product)}
              />
            ))}
          </div>
        </>
      )}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
