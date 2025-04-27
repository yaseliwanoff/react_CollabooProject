import React, { useState, useEffect } from 'react';
import LinkIcon from "@/assets/images/svg/link.svg";
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
  site: string;
  priceOptions: PriceOption[];
  onOrderClick: (product: any) => void;
}

const Product: React.FC<ProductProps> = ({ avatar, title, description, active, priceOptions, site, onOrderClick }) => {
  const [avatarValid, setAvatarValid] = useState(true);
  const [siteValid, setSiteValid] = useState(true);

  useEffect(() => {
    try {
      new URL(site);
      setSiteValid(true);
    } catch {
      setSiteValid(false);
    }
  }, [site]);

  return (
    <div className="bg-white flex font-[Inter] flex-col sm:w-full md:w-[295px] lg:w-[310px] h-auto rounded-[12px] border border-[#E4E4E7] py-6 px-6">
      <div className='flex flex-col flex-grow'>
        <div className='flex justify-between items-start'>
          {avatarValid ? (
            <img
              src={avatar}
              alt="company logo"
              width={40}
              height={40}
              className={active ? "" : "opacity-50"}
              onError={() => setAvatarValid(false)}
            />
          ) : (
            <div className="text-sm text-red-500">Image not loaded</div>
          )}

          {siteValid && (
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className='cursor-pointer pl-[30px] pb-[30px]'
            >
              <img width={14} height={14} src={LinkIcon} alt="link icon" />
            </a>
          )}
        </div>

        <div className='mt-6 flex-grow'>
          <div className='flex items-center gap-2'>
            <h4 className='font-semibold text-[16px]'>{title}</h4>
            {!active && <Badge variant={"warning"}>Inactive</Badge>}
          </div>
          <p className='font-normal text-[14px] opacity-55 mb-6'>{description}</p>
        </div>

        <div className='w-full h-[1px] bg-[#E4E4E7] mb-6'></div>

        <div className='flex flex-col'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='font-semibold text-[14px]'>Price</div>
            <div className='font-semibold text-[14px]'>Period</div>
            {priceOptions.map((option, index) => (
              <React.Fragment key={index}>
                <div className='border-t border-[#E4E4E7] pt-2 text-[14px]'>{option.price}$</div>
                <div className='border-t border-[#E4E4E7] pt-2 text-[14px]'>{option.count}</div>
              </React.Fragment>
            ))}
          </div>
          <div className='border-t border-[#E4E4E7] mt-2 pt-2'></div>
        </div>
      </div>

      <div className='mt-4'>
        <Button
          variant={"full_dark"}
          onClick={() => onOrderClick({ title, description, avatar, priceOptions })}
          className={!active ? "opacity-50 cursor-not-allowed" : ""}
          disabled={!active}
        >
          Order
        </Button>
      </div>
    </div>
  );
};

export default Product;
