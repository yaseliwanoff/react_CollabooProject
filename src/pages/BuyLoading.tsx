import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MobbinAvatar from "@/assets/images/svg/mobbin-avatar.svg";

export default function BuyLoading() {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const productId = queryParams.get('productId');

  return (
    <section className="container1 font-[Inter] font-normal text-[#18181B] h-screen flex flex-col">
      <div className="pt-24">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Payments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#p1502251 Mobbin - 1 month</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex-grow mt-[80px] flex flex-col justify-center items-center">
        <div className="max-w-[896px] w-full mx-auto flex flex-col items-center">
          <div className="flex gap-3 items-center">
            <div>
              <img src={MobbinAvatar} alt="product image" />
            </div>
            <div>
              <h4 className="text-[18px] font-semibold">Mobbin - 1 month subscription</h4>
              <p className="text-[14px] opacity-60">Sample description text with text for 1-2-3-4 rows of text.</p>
            </div>
          </div>
          <div className="w-[500px] h-[1px] bg-[#E4E4E7] mt-4"></div>
          <div className="flex justify-center items-center h-[500px]">
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="loader"></div> 
              <div>
                <p>Receiving credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
