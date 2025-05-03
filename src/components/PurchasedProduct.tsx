import React from 'react';
import { Button } from '@/components/ui/button';

interface PurchasedProductProps {
  avatar: string;
  title: string;
  description: string;
  date_end: string;
  links: { href: string }[];
}

const PurchasedProduct: React.FC<PurchasedProductProps> = ({ avatar, title, description, date_end, links }) => {
  return (
    <div className="bg-white flex font-[Inter] flex-col w-[471px] h-[402px] rounded-[12px] border border-[#E4E4E7] py-6 px-6">
      <div className="flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            {avatar && <img src={avatar} alt="company logo" className="w-[40px] h-[40px]" />}
          </div>
          <div className="flex mt-4 items-center gap-2">
            <h4 className="font-semibold text-[16px]">{title}</h4>
          </div>
          <p className="font-normal text-[14px] opacity-55 whitespace-pre-line">{description}</p>
        </div>
        <div className="w-[100%] h-[1px] bg-[#E4E4E7]"></div>
      </div>
      <div className="mt-4 flex justify-between items-center w-full">
        <div className="flex flex-col text-[14px]">
          <span className="font-semibold">Active till</span>
          <span className="font-normal text-[#71717A]">{date_end}</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {links.map((link, idx) => (
            <Button
              key={idx}
              variant={"default"}
              onClick={() => window.open(link.href, "_blank")}
            >
              Connect #{idx + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchasedProduct;
