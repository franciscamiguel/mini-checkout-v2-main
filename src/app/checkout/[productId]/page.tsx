"use client";

import React, { useState } from "react";
import PixModal from "./PixModal";
import Image from "next/image";
import lock from "../../../../public/images/lock.png";
import shield from "../../../../public/images/shield.png";
import pix from "../../../../public/images/pix.png";
import axios from "axios";
import InputField from "@/app/components/InputField";
import SectionHeader from "@/app/components/SectionHeader";

export default function CheckoutPage({
  params,
}: {
  params: { productId: string };
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCPF, setCustomerCPF] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
 

  const handleCheckout = async () => {
    
    const response = await axios.post("/api/checkout", {
      productId: params.productId,
      customerName,
      customerPhone,
      customerCPF,
      customerEmail,
    });    

    const payment = response.data.payment.point_of_interaction.transaction_data;

    const qrcodeString = payment.qr_code_base64;

    setQrcode(qrcodeString); // Set the QR code state

    setPaymentLink(payment.qr_code);

    setIsPixModalOpen(true); // Open the modal

    setOrderId(response.data.orderId);
    setPaymentId(response.data.payment.id);

    
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 p-6">
      <div className="w-full md:w-1/2">
        <div className="border rounded-lg p-6">
          <SectionHeader
            step={1}
            title="Registration Data"
            description="Complete your registration details"
          />

          <InputField
            id="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <InputField
            id="email"
            label="Email"
            placeholder="email@email.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <InputField
            id="cpf"
            label="CPF"
            placeholder="000.000.000-00"
            value={customerCPF}
            onChange={(e) => setCustomerCPF(e.target.value)}
          />
          <InputField
            id="phone"
            label="Phone"
            placeholder="00 00000-0000"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="border rounded-lg p-6">
          <SectionHeader
            step={2}
            title="Payment Details"
            description="Complete your payment details"
          />

          <div className="mb-4">
            <h3 className="text-xl font-medium mb-2">Price</h3>
            <p className="text-gray-700 text-2xl">$19.90</p>
          </div>
          <div className="mb-4 flex items-center">
            <Image
              src={pix}
              alt="Pix payment"
              width={25}
              height={25}
              className="mr-2"
            />
            <span className="text-gray-600 text-sm">Pix</span>
          </div>
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            onClick={handleCheckout}
          >
            Buy Now
          </button>
          <p className="text-gray-600 text-sm mt-4">
            100% secure and encrypted environment.
          </p>
          <div className="flex items-center">
            <Image
              src={lock}
              alt="Secure purchase"
              width={147}
              height={64}
              className="mr-2"
            />
            <Image
              src={shield}
              alt="Data protected"
              width={147}
              height={64}
              className="mr-2"
            />
          </div>
        </div>
      </div>

      <PixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        qrcode={qrcode}
        paymentLink={paymentLink}
        productId={params.productId}
        orderId={orderId}
        paymentId={paymentId}
      />
    </div>
  );
}
