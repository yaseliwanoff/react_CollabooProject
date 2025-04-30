import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { userProfile: userProfileFromApi, loading } = useUserProfile(token);
  const [username, setUsername] = useState(userProfileFromApi?.username || "");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [trc20Address, setTrc20Address] = useState(userProfileFromApi?.trc20_address || "");
  const [userProfile, setUserProfile] = useState<{ username: string, image_url: string } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(AvatarImg);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState<string>('');
  // const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
  const [savingPassword] = useState(false);
  const [passwordStatusMessage] = useState<string | null>(null);

  // Обработчик для изменения текущего пароля
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  // Обработчик для изменения нового пароля
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);

    // Проверка длины пароля
    if (e.target.value.length < 8) {
      setError('Your password must contain at least 8 characters');
    } else {
      setError('');
    }
  };

  // Обработчик для отправки запроса на сервер
  const handleChangePassword = async () => {
    // Проверка, что новый пароль и его подтверждение совпадают
    console.log("Current password:", currentPassword);
    console.log("New password:", newPassword);
  
    // Проверка, что новый пароль не пустой
    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    // Если текущий пароль не заполнен
    if (currentPassword.length < 8) {
      setError("Current password must be at least 8 characters.");
      return;
    }
  
    try {
      // Отправляем запрос на сервер для смены пароля
      const response = await axios.post(
        "https://collaboo.co/api-user/api/v1/user/refresh-password-auth",
        {
          password_old: currentPassword,
          password_new: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setError(null);
        setStatusMessage("Password successfully changed");
      } else {
        setError("Failed to change password");
      }
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError("An error occurred while changing the password");
    }
  };

  const handleSave = async () => {
    if (!token) return;

    const lowerUsername = username.trim().toLowerCase();

    if (reservedUsernames.includes(lowerUsername)) {
      setStatusMessage("This username is reserved and cannot be used.");
      return;
    }

    try {
      setSaving(true);

      // Сначала загружаем аватар, если он есть
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
      
        try {
          const response = await fetch("https://collaboo.co/api-user/api/v1/user/image", {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const data = await response.json();

          if (response.ok && data.filepath) {
            console.log("Аватар загружен:", data.filepath);
            setAvatarPreview(data.filepath);

            setUserProfile((prevProfile) => {
              if (!prevProfile) return null;
              return {
                ...prevProfile,
                image_url: data.filepath,
              };
            });
          } else {
            console.error("Ошибка при загрузке:", data);
            setStatusMessage("Failed to upload avatar");
            return;
          }
        } catch (error) {
          console.error("Ошибка сети при загрузке аватара:", error);
          setStatusMessage("Failed to upload avatar");
          return;
        }
      }

      // Затем сохраняем username, даже если он пустой
      const response = await axios.put(
        "https://collaboo.co/api-user/api/v1/user/",
        { username: username.trim(), trc20_address: trc20Address.trim(), },
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
      console.error("Error updating profile:", err);
      if (err.response?.status === 409) {
        setStatusMessage("This username is already taken");
      } else {
        setStatusMessage("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (userProfileFromApi?.image_url) {
      setAvatarPreview(userProfileFromApi.image_url);
    }
    if (userProfileFromApi?.username) {
      setUsername(userProfileFromApi.username);
    }
    if (userProfileFromApi?.trc20_address) {
      setTrc20Address(userProfileFromApi.trc20_address);
    }
  }, [userProfileFromApi]);  

  useEffect(() => {
    if (userProfileFromApi?.image_url) {
      setAvatarPreview(userProfileFromApi.image_url);
    }
    if (userProfileFromApi?.username) {
      setUsername(userProfileFromApi.username);
    }
  }, [userProfileFromApi]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setNewPassword(value);

  //   // Проверка длины пароля
  //   if (value.length < 8) {
  //     setError('Your password must contain at least 8 characters');
  //   } else {
  //     setError('');
  //     // Тут можно реализовать логику замену пароля
  //   }
  // };

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
                        placeholder={userProfileFromApi?.username || ""} 
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
                        <img width={36} height={36} src={avatarPreview} alt="avatar" />
                      </Avatar>
                      <Button variant={"light"} onClick={() => fileInputRef.current?.click()}>
                        <span><img src={Drag} alt="icon" /></span>
                        <span>Upload</span>
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                          const maxSizeMB = 5;
                          const maxSizeBytes = maxSizeMB * 1024 * 1024;

                          if (!allowedTypes.includes(file.type)) {
                            setStatusMessage("❌ Only JPEG and PNG images are allowed.");
                            return;
                          }

                          if (file.size > maxSizeBytes) {
                            setStatusMessage(`❌ Image size must be less than ${maxSizeMB}MB.`);
                            return;
                          }

                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                          setStatusMessage(null); // очищаем ошибку
                        }}
                        className="hidden"
                      />
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
                      <Input
                        className="w-full"
                        placeholder={userProfileFromApi?.email || 'sample@mail.com'}
                        disabled
                      />
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
                      <Input
                        className="w-full"
                        placeholder='Enter USDT TRC-20 address…'
                        value={trc20Address}
                        onChange={(e) => setTrc20Address(e.target.value)}
                        disabled={loading || saving}
                      />
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
                          <h2 className='text-[14px] font-semibold'>Current password</h2>
                          <button className='underline hidden md:flex font-normal text-[14px] text-[#71717A]'>Forgot your password?</button>
                        </div>
                        <div>
                          <Input
                            className='mt-1'
                            type='password'
                            placeholder='Enter current password…'
                            value={currentPassword} // Привязываем к состоянию
                            onChange={handleCurrentPasswordChange} // Обработчик для обновления состояния
                          />
                          <button className='underline mt-1 float-right flex md:hidden font-normal text-[14px] text-[#71717A]'>Forgot your password?</button>
                        </div>
                      </div>
                      <div>
                        <div className='flex justify-between'>
                          <h2 className='text-[14px] font-semibold'>New password</h2>
                        </div>
                        <div>
                          <Input
                            type='password'
                            className={`mt-1 ${error ? 'border-red-500' : ''}`}
                            placeholder='Confirm new password…' 
                            value={newPassword}  // Bind the value to the state
                            onChange={handleNewPasswordChange}  // Update state on change
                          />
                          {error && <p className="text-[#71717A] mt-1 text-sm">{error}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {passwordStatusMessage && (
                  <p
                    className={`mt-2 text-sm ${passwordStatusMessage.includes("successfully") ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordStatusMessage}
                  </p>
                )}
                <div className='flex mt-6 justify-end'>
                  <Button onClick={handleChangePassword} disabled={savingPassword}>
                    {savingPassword ? "Saving..." : "Save"}
                  </Button>
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
