import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import Copy from "@/assets/images/svg/Copy.svg";

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Affiliate link');
  const [affiliateLink, setAffiliateLink] = useState("https://xxxx.xxx/?r={user_id_number}"); // Состояние для хранения ссылки

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink)
  };

  const sentences = [
    "We are excited to introduce our affiliate program!",
    "Invite users through your referral link and earn up to 30% from the deposits made by the users you attract.",
    "We offer 10% to all users immediately after registration and up to 20% for verified partners*.",
    "*To become a verified partner, please contact our support team and provide details about your traffic sources. Once verified, you will receive an increased percentage.",
    "To register a new user, share your affiliate link. By clicking on it, they will be able to sign up.",
    "Please note: Creating multiple accounts to inflate affiliate rewards is strictly prohibited. If such activity is detected, the account will be blocked, or the reward percentage will be reduced to 0%.",
    "Funds earned through the affiliate program can be used for any services on our platform. Additionally, you can withdraw your earnings to Yandex.Money or QIWI (minimum withdrawal amount is 50 USD).",
    "Join our affiliate program today and start earning!"
  ];

  return (
    <section className="container1 font-[Inter] font-normal text-[#18181B]">
      <div className="container1 pt-[55px]">
        <div className="w-full flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Affiliate program</h1>
          <div>
            <Link to={"/help-ticket-create"}>
              <Button variant={"default"} className="ml-auto">
                <span>
                  <img src={Chat} alt="icon" />
                </span>
                <span>Submit new ticket</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex h-screen text-[Inter]">
          <aside className="w-1/5 flex flex-col text-[14px]">
            <button 
              className="button-sidebar" 
              onClick={() => handleTabClick('Affiliate link')}
            >
              Affiliate link
            </button>
            <button 
              className="button-sidebar" 
              onClick={() => handleTabClick('Earning statistics')}
            >
              Earning statistics
            </button>
          </aside>
          <div className="w-4/5">
            {activeTab === 'Affiliate link' && (
              <div className='bg-white rounded-[8px] border border-[#E4E4E7] p-6'>
                <div className='flex flex-col gap-1 border-b border-[#E4E4E7] pb-6'>
                  <h2 className='font-semibold text-[20px]'>Earn up to 30% on every purchase from your link</h2>
                  <p className='text-[14px] text-[#71717A]'>Some text here…</p>
                </div>
                <div className='flex flex-col gap-1 border-b border-[#E4E4E7] py-6'>
                  <h4 className='font-semibold text-[14px]'>Your Affiliate link</h4>
                  <div className='mt-2 flex gap-1.5'>
                    <Input 
                      placeholder='write your link' 
                      value={affiliateLink} // Используем состояние для значения
                      onChange={(e) => setAffiliateLink(e.target.value)} // Обновляем состояние при изменении
                    />
                    <Button variant={"gray"} onClick={copyToClipboard}>
                      <span>
                        <img src={Copy} alt="copy icon" />
                      </span>
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
                <div className='flex flex-col gap-1 py-6'>
                  <h4 className='font-semibold text-[14px]'>Rules</h4>
                  <div className='flex flex-col gap-5'>
                    {sentences.map((sentence, index) => {
                      if (sentence.includes("Please note:")) {
                        return (
                          <p key={index} className="text-red-500">
                            <span className="font-semibold">Please note:</span> 
                            {" Creating multiple accounts to inflate affiliate rewards is strictly prohibited. If such activity is detected, the account will be blocked, or the reward percentage will be reduced to 0%."}
                          </p>
                        );
                      }
                      if (sentence.includes("*To become a verified partner,")) {
                        return (
                          <p key={index} className="text-[#71717A] italic">
                            <span className="font-normal">{sentence}</span>
                          </p>
                        );
                      }
                      return (
                        <p key={index} className="text-[#71717A]">
                          {sentence}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Earning statistics' && (
              <div className='bg-white rounded-[8px] border border-[#E4E4E7] p-6'>
                <div className='border-b border-[#E4E4E7] pb-6'>
                  <h2 className='font-semibold text-[20px]'>Earning statistics</h2>
                  <p className='text-[14px] text-[#71717A]'>Some text here…</p>
                </div>
                <div className='mt-4'>
                  <div className='flex p-3 border-b pt-4 items-center border-[#E4E4E7] hover:bg-[#F4F4F5] ease-in-out duration-200 pb-4 justify-between'>
                    <span className="text-[14px]">Visits</span>
                    <span className="text-[14px]">0</span>
                  </div>
                  <div className='flex p-3 border-b pt-4 items-center border-[#E4E4E7] hover:bg-[#F4F4F5] ease-in-out duration-200 pb-4 justify-between'>
                    <span className="text-[14px]">Registrations</span>
                    <span className="text-[14px]">0</span>
                  </div>
                  <div className='flex p-3 border-b pt-4 items-center border-[#E4E4E7] hover:bg-[#F4F4F5] ease-in-out duration-200 pb-4 justify-between'>
                    <span className="text-[14px]">Total Earnings</span>
                    <span className="text-[14px]">0$</span>
                  </div>
                  <div className='flex p-3 border-b pt-4 items-center border-[#E4E4E7] hover:bg-[#F4F4F5] ease-in-out duration-200 pb-4 justify-between'>
                    <span className="text-[14px]">Paid Out</span>
                    <span className="text-[14px]">0$</span>
                  </div>
                  <div className='flex p-3 border-b pt-4 items-center border-[#E4E4E7] hover:bg-[#F4F4F5] ease-in-out duration-200 pb-4 justify-between'>
                    <span className="text-[14px]">Pending Payout</span>
                    <span className="text-[14px]">0$</span>
                  </div>
                  <div className='flex p-3 border-b pt-4 items-center border-[#E4E4E7] hover:bg-[#F4F4F5] ease-in-out duration-200 pb-4 justify-between'>
                    <span className="text-[14px]">Available for Payout and Orders</span>
                    <span className="text-[14px]">0$</span>
                  </div>
                </div>
                <div className='flex justify-center items-center text-center'>
                  <p className='text-[14px] w-[520px] text-[#71717A] pt-4'>
                    To withdraw funds, please specify USDT TRC-20 wallet number in your <a href="/profile" className='underline'>profile</a>. To withdraw please open a new ticket at Helpdesk section.
                    <br /><br />
                    PS: you can also use your earnings to pay for subscription at Callaboo.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;
