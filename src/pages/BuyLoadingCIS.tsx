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
import PaymentsDetails from "@/components/PaymentsDetails";
import PaymentsOutdated from "@/components/PaymentsOutdated";
import PaymentsSuccessful from "@/components/PaymentsSuccessful";
import PaymentsError from "@/components/PaymentsError";
import File from "@/assets/images/svg/file.svg";
import Drag from "@/assets/images/svg/drag.svg";
import { Link } from "react-router-dom";

export default function BuyLoading() {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900);
  const [progressColor, setProgressColor] = useState("#2A9D90");
  const [paymentMade, setPaymentMade] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [receiptSent, setReceiptSent] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

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
      setProgressColor("#2A9D90");
    } else if (timeLeft > 300) {
      setProgressColor("#FBBF24");
    } else {
      setProgressColor("#DC2626");
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePaymentMade = () => {
    setPaymentMade(true);
    setTimeout(() => {
      setVerificationComplete(true);
    }, 5000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSendReceipt = () => {
    setReceiptSent(true);

    setTimeout(() => {
      setPaymentError(true);
    }, 3000);
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
          ) : paymentMade ? (
            verificationComplete ? (
              paymentError ? (
                <div className="w-[468px]">
                  <PaymentsError />
                  <div className="mt-4">
                    <Link to={"/"}>
                      <Button variant={"full_dark"}>Go to main page</Button>
                    </Link>
                  </div>
                </div>
              ) : receiptSent ? (
                <div className="w-[468px]">
                  <PaymentsSuccessful />
                  <div className="mt-4">
                    <Link to={"/"}>
                      <Button variant={"full_dark"}>Go to my subscriptions</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="w-[468px]">
                  <PaymentsOutdated />
                  <div className="w-full mt-6 gap-6 justify-center flex flex-col items-center bg-white rounded-[6px] border border-[#E4E4E7] p-4">
                    <p className="w-[420px] text-center">
                      If you have made the payments and see this page, attach the receipt <span className="font-medium">in PDF format</span> to the payment approval.
                    </p>
                    <div
                      className="border-dashed border-1 border-[#E4E4E7] w-full h-[100px] p-4 rounded-[6px] flex items-center justify-between"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div>
                        <button className="flex flex-col items-center gap-1">
                          <span>
                            <img src={Drag} alt="icon" />
                          </span>
                          <span className="text-[15px]">Drag-n-drop file</span>
                        </button>
                      </div>
                      <div className="flex justify-center items-center">
                        <span className="relative text-[#71717A] z-20 p-2 bg-white">or</span>
                        <div className="bg-[#E4E4E7] w-[1px] h-16 absolute"></div>
                      </div>
                      <div>
                        <Button variant={"light"} onClick={() => document.getElementById('fileInput')?.click()}>
                          <span>
                            <img src={File} alt="icon" />
                          </span>
                          <span>Select file</span>
                        </Button>
                        <input
                          type="file"
                          id="fileInput"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    {selectedFile && (
                      <p className="mt-2 text-center">Selected file: {selectedFile.name}</p>
                    )}
                    <Button 
                      variant={"full_dark"} 
                      onClick={handleSendReceipt} 
                      disabled={!selectedFile}
                    >
                      Send receipt
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="w-[468px]">
                <PaymentsDetails />
                <div className="w-full mt-6 bg-white rounded-[6px] border border-[#E4E4E7] p-6">
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <div className="loader"></div>
                    <h5 className="font-semibold text-[16px]">Checking your payment</h5>
                    <p className="font-normal text-[14px] text-center text-[#71717A] w-[230px]">Please don’t leave that page until the payment is confirmed</p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="w-[468px]">
              <PaymentsDetails />
              <div className="w-full mt-6 gap-6 justify-center flex flex-col items-center bg-white rounded-[6px] border border-[#E4E4E7] p-6">
                <h5 className="font-semibold text-[16px]">Awaiting your payment</h5>
                <p className="font-normal text-[24px]">{formatTime(timeLeft)}</p>
                <div className="relative w-full h-4 bg-[#E4E4E7] rounded-full">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      width: `${(timeLeft / 900) * 100}%`,
                      backgroundColor: timeLeft > 600 ? "#2A9D90" : timeLeft > 300 ? "#FBBF24" : "#DC2626",
                      transition: 'width 1s linear'
                    }}
                  />
                </div>
              </div>
              <Button className="mt-6" variant={"full_dark"} onClick={handlePaymentMade}>I made a payment</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
