import Warning from "@/assets/images/svg/CircleAlert.svg";

export default function PaymentsError() {
    return (
        <div className="flex flex-col mt-[16px] font-[Inter] rounded-[6px] p-[16px] bg-[#F4F4F5]">
            <div className="border border-[#DC2626] p-[15px] bg-white text-[#DC2626] rounded-[8px]">
                    <div className="flex items-start justify-between">
                      <div>
                        <img className="w-4 h-4 mt-1" width={16} height={16} src={Warning} alt="warning" style={{ width: '16px', height: '16px' }} />
                      </div>
                      <div>
                        <h5 className="font-medium text-[16px]">Error in receiving credentials</h5>
                        <p className="w-[376px] font-normal text-[14px]">Looks like we have a problem with processing your payment. Try using a different payment method.</p>
                      </div>
                    </div>
            </div>
        </div>
    )
}
