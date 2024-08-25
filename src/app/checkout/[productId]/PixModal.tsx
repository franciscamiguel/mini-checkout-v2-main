"use client";
import axios from "axios";
import { CircleXIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrcode: string;
  paymentLink: string; 
  productId: string
  orderId: string
  paymentId: string
}

const PixModal: React.FC<PixModalProps> = ({
  isOpen,
  onClose,
  qrcode,
  paymentLink, 
  productId,orderId,paymentId
}) => {

  const handleClose = async () => {
    try {
      await axios.get("/api/webhook", {
        params: {
         orderId,
          productId,
          paymentId
        },
      });
    } catch (error) {
      console.error("Failed to send webhook:", error);
    } finally {
      onClose();
    }
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    alert("Link copiado para a área de transferência");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <CircleXIcon />
        </button>
        <h2 className="text-lg font-bold mb-4">Pay via Pix</h2>
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 mb-4 flex justify-center items-center">
          {qrcode ? (
            <Image
              src={`data:image/png;base64,${qrcode}`}
              alt="QR Code"
              width={300}
              height={300}
            />
          ) : (
            <p className="text-gray-500">QR CODE</p>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-2">Pix copy and paste</p>
        <div className="flex items-center border-dashed border-2 border-gray-300 rounded-lg p-2 mb-4">
          <input
            type="text"
            value={paymentLink}
            readOnly
            className="w-full text-blue-500 focus:outline-none"
            aria-label="Pix Payment Link"
          />
        </div>
        <button
          onClick={handleCopy}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center focus:outline-none focus:shadow-outline"
          aria-label="Copy Payment Link"
        >
          <CopyIcon className="mr-2" /> Copy
        </button>
      </div>
    </div>
  );
};

export default PixModal;
