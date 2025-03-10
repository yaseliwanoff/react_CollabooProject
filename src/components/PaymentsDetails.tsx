import { Button } from "@/components/ui/button";
import Copy from "@/assets/images/svg/Copy.svg";
import Warning from "@/assets/images/svg/CircleAlert.svg";

export default function PaymentsDetails() {
    const phoneNumber = "+7 916 222 22 22";
    const amount = "336 RUB";

    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text).catch(err => {
          console.error("Failed to copy: ", err);
        });
    };

    return (
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
    )
}
