"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, FilePenLine } from "lucide-react";

interface ItemProps {
  picture: string;
  description: string;
  name: string;
  link: string;
  price: number;
  onDelete: () => void;
  onEdit: () => void;
}

export default function ProductCard({
  picture,
  description,
  name,
  link,
  price,
  onDelete,
  onEdit,
}: ItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Image
        src={picture}
        alt={description}
        width={500}
        height={500}
        className="w-full h-48 rounded-t-lg object-cover border"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-black">{name}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="flex justify-between items-center mt-6">
          <Link href={link} legacyBehavior>
            <a className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <span className="text-lg">{`R$ ${price}`}</span>
            </a>
          </Link>
          <div className="flex space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              onClick={onEdit}
              aria-label="Edit item"
            >
              <FilePenLine size={14} /> Editar
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              onClick={onDelete}
              aria-label="Delete item"
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
