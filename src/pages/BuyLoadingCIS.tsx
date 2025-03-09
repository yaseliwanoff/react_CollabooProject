import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MobbinAvatar from "@/assets/images/svg/mobbin-avatar.svg";
import { Button } from "@/components/ui/button";
import Copy from "@/assets/images/svg/Copy.svg";
import Warning from "@/assets/images/svg/CircleAlert.svg";

export default function BuyLoading() {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900);
  const [progressColor, setProgressColor] = useState("#2A9D90");
  const phoneNumber = "+7 916 222 22 22";
  const amount = "336 RUB";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (timeLeft > 600) {
      setProgressColor("#2A9D90"); // Зеленый
    } else if (timeLeft > 300) {
      setProgressColor("#FBBF24"); // Желтый
    } else {
      setProgressColor("#DC2626"); // Красный
    }
  }, [timeLeft]);

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error("Failed to copy: ", err);
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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
          {loading ? (
            <>
              <div className="w-[500px] h-[1px] bg-[#E4E4E7] mt-4"></div>
              <div className="flex justify-center items-center h-[500px]">
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div className="loader"></div> 
                  <div>
                    <p>Receiving credentials</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-[468px]">
              <div className="flex flex-col mt-[16px] rounded-[6px] p-[16px] bg-[#F4F4F5]">
                <div className="flex flex-col border-b border-b-[#E4E4E7] pb-[16px]">
                  <span className="text-[#71717A] text-[14px]">Payment method</span>
                  <span className="font-medium text-[16px]">SBP transfer 🇷🇺</span>
                </div>
                <div className="flex justify-between items-center border-b pt-[16px] border-b-[#E4E4E7] pb-[16px]">
                  <div className="flex flex-col">
                    <span className="text-[#71717A] text-[14px]">Phone number</span>
                    <span className="font-medium text-[16px]">{phoneNumber}</span>
                  </div>
                  <div>
                    <Button variant={"light"} onClick={() => copyToClipboard(phoneNumber)}>
                      <span>
                        <img src={Copy} alt="copy" />
                      </span>
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pt-[16px] border-b-[#E4E4E7] pb-[16px]">
                  <div className="flex flex-col">
                    <span className="text-[#71717A] text-[14px]">Amount</span>
                    <span className="font-medium text-[16px]">{amount}</span>
                  </div>
                  <div>
                    <Button variant={"light"} onClick={() => copyToClipboard(amount)}>
                      <span>
                        <img src={Copy} alt="copy" />
                      </span>
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col pt-[16px] border-b border-b-[#E4E4E7] pb-[16px]">
                  <span className="text-[#71717A] text-[14px]">Bank</span>
                  <span className="font-medium text-[16px]">mts</span>
                </div>
                <div className="flex flex-col pt-[16px] border-b border-b-[#E4E4E7] pb-[16px]">
                  <span className="text-[#71717A] text-[14px]">Recipient</span>
                  <span className="font-medium text-[16px]">Сергей 3</span>
                </div>
                <div className="flex flex-col pt-[16px] pb-[16px]">
                  <span className="text-[#71717A] text-[14px]">Comment</span>
                  <span className="font-medium text-[16px]">Don’t write anything in comments!</span>
                </div>
                <div className="pb-[16px]">
                  <div className="border border-[#DC2626] p-[15px] bg-white text-[#DC2626] rounded-[8px]">
                    <div className="flex items-start justify-between">
                      <div>
                        <img className="w-4 h-4 mt-1" width={16} height={16} src={Warning} alt="warning" style={{ width: '16px', height: '16px' }} />
                      </div>
                      <div>
                        <h5 className="font-medium text-[16px]">Transfer the exact amount in RUB</h5>
                        <p className="w-[376px] font-normal text-[14px]">Please note that you must make a single transfer of the exact amount of RUB in the next 15 minutes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-6 gap-6 justify-center flex flex-col items-center bg-white rounded-[6px] border border-[#E4E4E7] p-6">
                <h5 className="font-semibold text-[16px]">Awaiting for your payment</h5>
                <p className="font-normal text-[24px]">{formatTime(timeLeft)}</p>
                <div className="bg-[progressColor] w-full h-4 rounded-full" style={{ backgroundColor: progressColor }}></div>
              </div>
              <Button className="mt-6" variant={"full_dark"}>I made a payment</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
