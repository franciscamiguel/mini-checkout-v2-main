// src/app/products/ProductModal.tsx
import axios from "axios";
import { ChangeEvent, useState, useEffect } from "react";

interface ProductModalProps {
  product?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productThumbnail, setProductThumbnail] = useState<File | null>(null);
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(product.price.toString());
    }
  }, [product]);

  const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
  };

  const handleProductDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProductDescription(event.target.value);
  };

  const handleProductThumbnailChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setProductThumbnail(event.target.files[0]);
    }
  };

  const handleProductPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductPrice(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = product?.image || "";

      if (productThumbnail) {
        // Generate a filename for the image
        const filename = `${Date.now()}_${productThumbnail.name}`;

        // Upload the file to the server
        const uploadResponse = await axios.post(
          `/api/upload?filename=${encodeURIComponent(filename)}`,
          productThumbnail, // Send the file directly as the request body
          {
            headers: {
              "Content-Type": productThumbnail.type, // Set the correct content type
            },
          }
        );

        imageUrl = uploadResponse.data.url;
      }

      const productData = {
        name: productName,
        description: productDescription,
        image: imageUrl,
        price: parseFloat(productPrice),
      };

      if (product) {
        // Update product
        await axios.put(`/api/products?id=${product.id}`, productData);
      } else {
        // Create new product
        await axios.post("/api/products", productData);
      }

      onSubmit();
      onClose();
    } catch (error: any) {
      console.error(
        "Error creating/updating product:",
        error.response?.data || error.message
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4 text-center">
            {product ? "Edit Product" : "Create Product"}
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={productName}
                onChange={handleProductNameChange}
                aria-label="Product Name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productDescription"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="productDescription"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={productDescription}
                onChange={handleProductDescriptionChange}
                aria-label="Product Description"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productThumbnail"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Thumbnail
              </label>
              <input
                type="file"
                id="productThumbnail"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleProductThumbnailChange}
                aria-label="Product Thumbnail"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productPrice"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Price
              </label>
              <input
                type="number"
                id="productPrice"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={productPrice}
                onChange={handleProductPriceChange}
                aria-label="Product Price"
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center space-x-2 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                aria-label={product ? "Update Product" : "Create Product"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>{product ? "Update Product" : "Create Product"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
