import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Drag from "@/assets/images/svg/Drag.svg";
import AvatarImg from "@/assets/images/png/avatar.png";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import axios from "axios";

const reservedUsernames = ["admin", "administrator", "moderator", "support"];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();
  const { userProfile, loading } = useUserProfile(token);
  const [username, setUsername] = useState(userProfile?.username || "");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!token) return;
    if (!username.trim()) {
      setStatusMessage("❌ Username cannot be empty");
      return;
    }

    const lowerUsername = username.trim().toLowerCase();

    if (reservedUsernames.includes(lowerUsername)) {
      setStatusMessage("❌ This username is reserved and cannot be used.");
      return;
    }

    try {
      setSaving(true);
      const response = await axios.put(
        "https://collaboo.co/api-user/api/v1/user/",
        { username: username.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStatusMessage("Username successfully updated");
      } else {
        setStatusMessage("Failed to update username");
      }
    } catch (err: any) {
      console.error("Error updating username:", err);
      if (err.response?.status === 409) {
        setStatusMessage("This username is already taken");
      } else {
        setStatusMessage("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };


  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    // Проверка длины пароля
    if (value.length < 8) {
      setError('Your password must contain at least 8 characters');
    } else {
      setError('');
      // Тут можно реализовать логику замену пароля
    }
  };

  return (
    <section className="container font-[Inter] font-normal text-[#18181B]">
      <div className="pt-[55px]">
        <div className="w-full pt-10 mb-8">
          <h1 className="font-semibold text-[30px]">Settings</h1>
        </div>
        <div className="lg:flex h-screen text-[Inter]">
          <aside className="w-1/5 hidden lg:flex flex-col text-[14px]">
            <button 
              className="button-sidebar" 
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className="button-sidebar" 
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </aside>
          <aside className="flex lg:hidden">
            <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all" onClick={() => setActiveTab("profile")}>Profile</TabsTrigger>
                      <TabsTrigger value="active" onClick={() => setActiveTab("security")}>Security</TabsTrigger>
                    </TabsList>
                  </Tabs>
          </aside>
          <div className="lg:w-4/5">
            {activeTab === 'profile' && (
              <div className='w-full p-6 bg-white border border-[#E4E4E7] rounded-[8px]'>
                <div className='border-b pb-6 border-[#E4E4E7]'>
                  <h2 className='text-[20px] font-semibold'>Profile</h2>
                  <p className='text-[#71717A] text-[14px]'>Set up out your profile</p>
                </div>
                <div className='border-b pb-6 mt-6 border-[#E4E4E7]'>
                  <div className='md:flex items-center gap-2 justify-between w-full'>
                    <div className='md:w-1/2 mb-3 md:mb-0'>
                      <h2 className='text-[14px] font-semibold'>Username</h2>
                      <p className='text-[#71717A] text-[14px]'>Used when you contact support team</p>
                    </div>
                    <div className='md:w-1/2'>
                      <Input
                        className="w-full"
                        placeholder={userProfile?.username || ""} 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading || saving}
                      />
                    </div>
                  </div>
                </div>
                <div className='border-b pb-6 mt-6 border-[#E4E4E7]'>
                  <div className='md:flex items-center gap-2 justify-between w-full'>
                    <div className='md:w-1/2 mb-2 md:mb-0'>
                      <h2 className='text-[14px] font-semibold'>Your avatar</h2>
                      <p className='text-[#71717A] text-[14px]'>This will be displayed on your profile</p>
                    </div>
                    <div className='md:w-1/2 flex items-center gap-2.5'>
                      <Avatar>
                        <img width={36} height={36} src={AvatarImg} alt="avatar" />
                      </Avatar>
                      <Button variant={"light"}>
                        <span>
                          <img src={Drag} alt="icon" />
                        </span>
                        <span>Upload</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='border-b pb-6 mt-6 border-[#E4E4E7]'>
                  <div className='md:flex items-center gap-2 justify-between w-full'>
                    <div className='md:w-1/2 mb-2 md:mb-0'>
                      <h2 className='text-[14px] font-semibold'>Email</h2>
                      <p className='text-[#71717A] text-[14px]'>Used to login to the service (can’t be changed)</p>
                    </div>
                    <div className='md:w-1/2'>
                      <Input className="w-full" placeholder='sample@mail.com' disabled />
                    </div>
                  </div>
                </div>
                <div className='border-b pb-6 mt-6 border-[#E4E4E7]'>
                  <div className='md:flex items-center gap-2 justify-between w-full'>
                    <div className='md:w-1/2 mb-2 md:mb-0'>
                      <h2 className='text-[14px] font-semibold'>USDT (TRC-20) address</h2>
                      <p className='text-[#71717A] text-[14px]'>Used for payouts from referral program</p>
                    </div>
                    <div className='md:w-1/2'>
                      <Input className="w-full" placeholder='Enter USDT TRC-20 address…' />
                    </div>
                  </div>
                </div>
                {statusMessage && (
                  <p className="mt-2 text-sm text-gray-700">{statusMessage}</p>
                )}
                <div className='flex mt-6 justify-end'>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'security' && (
              <div className='w-full p-6 bg-white border border-[#E4E4E7] rounded-[8px]'>
                <div className='border-b pb-6 border-[#E4E4E7]'>
                  <h2 className='text-[20px] font-semibold'>Security</h2>
                  <p className='text-[#71717A] text-[14px]'>Update your account password</p>
                </div>
                <div className='border-b pb-6 mt-6 border-[#E4E4E7]'>
                  <div className='md:flex items-center gap-2 justify-between w-full'>
                    <div className='md:w-1/2'>
                      <h2 className='text-[14px] font-semibold'>Change password</h2>
                      <p className='text-[#71717A] text-[14px] w-auto md:w-[400px]'>Enter your current password followed by a new secure password</p>
                    </div>
                    <div className='md:w-1/2 flex flex-col gap-5 mt-4 md:mt-0'>
                      <div>
                        <div className='flex justify-between'>
                          <h2 className='text-[14px] font-semibold'>Change password</h2>
                          <button className='underline hidden md:flex font-normal text-[14px] text-[#71717A]'>Forgot your password?</button>
                        </div>
                        <div>
                          <Input className='mt-1' placeholder='Enter password…' />
                          <button className='underline mt-1 float-right flex md:hidden font-normal text-[14px] text-[#71717A]'>Forgot your password?</button>
                        </div>
                      </div>
                      <div>
                        <div className='flex justify-between'>
                          <h2 className='text-[14px] font-semibold'>New password</h2>
                        </div>
                        <div>
                          <Input 
                            className={`mt-1 ${error ? 'border-red-500' : ''}`}
                            placeholder='Enter new password…' 
                            value={newPassword} 
                            onChange={handleNewPasswordChange} 
                          />
                          {error && <p className='text-[#71717A] mt-1 text-sm'>{error}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex mt-6 justify-end'>
                  <Button variant={"default"}>Save</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
