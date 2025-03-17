import Oclock from "@/assets/images/png/Oclock.png"

export default function PaymentsOutdated() {
    return (
        <div className="flex flex-col mt-[16px] font-[Inter] rounded-[6px] p-[16px] text-[#09090B] bg-[#F4F4F5]">
            <div className="flex flex-col justify-center items-center">
                <img width={269} height={236} src={Oclock} alt="ocklock" className="mt-[40px]" />
                <h5 className="text-center mt-2 font-medium text-[24px]">The credentials are outdated</h5>
                <p className="text-center sm:w-auto md:w-[344px] mt-1 font-[16px] text-[#71717A]">Please select a subscription plan again and make a payment</p>
            </div>
        </div>
    )
}
