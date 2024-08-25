"use client";
import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; // Optional, default to "text"
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text", // Default type is "text"
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-lg font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
