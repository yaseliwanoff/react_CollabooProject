import Successful from "@/assets/images/svg/successful.png";

export default function PaymentSuccessful() {
    return (
        <div className="flex flex-col mt-[16px] h-[404px] font-[Inter] rounded-[6px] p-[16px] text-[#09090B] bg-[#F4F4F5]">
            <div className="flex flex-col justify-center items-center">
                <img width={269} height={236} src={Successful} alt="ocklock" />
                <h5 className="mt-2 font-medium text-[24px]">Payment successful</h5>
                <p className="text-center sm:w-auto md:w-[344px] mt-1 font-[16px] text-[#71717A]">Your subscription is now activated</p>
            </div>
        </div>
    )
}
