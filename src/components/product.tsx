import React from 'react';
import Link from "@/assets/images/svg/link.svg";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";

interface PriceOption {
  price: string;
  count: string;
}

interface ProductProps {
  avatar: string;
  title: string;
  description: string;
  active: boolean;
  priceOptions: PriceOption[];
  onOrderClick: (product: any) => void;
}

const Product: React.FC<ProductProps> = ({ avatar, title, description, active, priceOptions, onOrderClick }) => {
  return (
    <div className="bg-white flex font-[Inter] flex-col w-[310px] h-[478px] rounded-[12px] border border-[#E4E4E7] py-6 px-6">
      <div className='flex flex-col flex-grow'>
        <div className='flex justify-between items-start'>
          <img src={avatar} alt="company logo" />
          <button className='cursor-pointer pl-[30px] pb-[30px]'>
            <img width={14} height={14} src={Link} alt="icon" />
          </button>
        </div>
        <div className='mt-6 flex-grow'>
          <div className='flex items-center gap-2'>
            <h4 className='font-semibold text-[16px]'>{title}</h4>
            {!active && <Badge variant={"warning"}>Inactive</Badge>}
          </div>
          <p className='font-normal text-[14px] opacity-55'>{description}</p>
        </div>
        <div className='w-[100%] h-[1px] bg-[#E4E4E7]'></div>
        <div className='flex flex-col mt-4'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='font-semibold'>Price</div>
            <div className='font-semibold'>Period</div>
            {priceOptions.map((option, index) => (
              <React.Fragment key={index}>
                <div className='border-t border-[#E4E4E7] pt-2'>{option.price}$</div>
                <div className='border-t border-[#E4E4E7] pt-2'>{option.count} months</div>
              </React.Fragment>
            ))}
          </div>
          <div className='border-t border-[#E4E4E7] mt-2 pt-2'></div>
        </div>
      </div>
      <div className='mt-4'>
        <Button variant={"full"} onClick={() => onOrderClick({ title, description, avatar })}>Order</Button>
      </div>
    </div>
  );
}

export default Product;
