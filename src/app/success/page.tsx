"use client";
import Image from "next/image";
import okIcon from "../../../public/images/ok.png";

export default function SuccessPage() {

  //set timeout 5 seg e redirecionar para products
  
  return (
    <div className="flex items-center justify-center p-24">
      <Image src={okIcon} alt="ok" layout="fixed" width={300} height={300} />
    </div>
  );
}