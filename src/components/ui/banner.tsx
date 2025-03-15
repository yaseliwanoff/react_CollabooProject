import React from 'react';
import { Button } from '@/components/ui/button';
import WarningImg from "@/assets/images/svg/warning.svg";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ButtonProps {
  label: string;
  image: React.ReactElement;
}

interface BannerProps {
  title: string;
  text: string;
  button1: ButtonProps;
  button2: ButtonProps;
}

const Banner: React.FC<BannerProps> = ({ title, text, button1, button2 }) => {
  return (
    <div className="w-full flex py-6 px-6 bg-[#18181B] font-[Inter] text-[#FFFFFF] rounded-[8px]">
      <div className='flex-1 block md:flex items-center justify-between'>
        <div>
          <h1 className="text-[18px] font-semibold">{title}</h1>
          <p className="text-[14px] opacity-80">{text}</p>
        </div>
        <div className="block md:flex pt-4 md:pt-0 space-x-4">
          <HoverCard>
            <HoverCardTrigger asChild>
            <Button variant="outline2" className="flex items-center button">
              {button1.label} 
              <div className='icon'>
                {React.isValidElement(button1.image) && React.cloneElement(button1.image)}
              </div>
            </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[480px]">
              <div className="flex items-start space-x-4">
                <img src={WarningImg} width={16} height={16} className='mt-1' alt="warning icon" />
                <div className="space-y-1 items-start flex flex-col">
                  <p className="text-sm">How to activate coupon</p>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground w-[227px] md:w-full">
                      Select the subscription you need, go to payment page and enter the coupon you have.
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <Button variant="secondary" className="mt-3 md:mt-0 flex items-center">
            {button2.label} 
            {React.isValidElement(button2.image) && React.cloneElement(button2.image)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
