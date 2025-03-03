import React from 'react';
import { Button } from '@/components/ui/button';

interface PurchasedProductProps {
    avatar: string;
    title: string;
    description: string;
}

const PurchasedProduct: React.FC<PurchasedProductProps> = ({ avatar, title, description }) => {
  return (
    <div className="bg-white flex font-[Inter] flex-col w-[471px] h-[402px] rounded-[12px] border border-[#E4E4E7] py-6 px-6">
      <div className="flex flex-col flex-grow">
        <div className="mt-6 flex-grow">
          <div className="flex justify-between items-start">
            {avatar && <img src={avatar} alt="company logo" className="w-[40px] h-[40px]" />}
          </div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[16px]">{title}</h4>
          </div>
          <p className="font-normal text-[14px] opacity-55">{description}</p>
        </div>
        <div className="w-[100%] h-[1px] bg-[#E4E4E7]"></div>
      </div>
      <div className="mt-4 flex justify-between items-center w-full">
        <div className="flex flex-col text-[14px]">
          <span className="font-semibold">Active till</span>
          <span className="font-normal text-[#71717A]">01.01.2025</span>
        </div>
        <div className="flex gap-1">
          <Button variant={"default"}>Connect #1</Button>
          <Button variant={"default"}>Connect #2</Button>
        </div>
      </div>
    </div>
  );
};

export default PurchasedProduct;