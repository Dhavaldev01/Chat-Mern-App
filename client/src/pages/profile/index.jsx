import { useAppStore } from '@/store';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { colors, getColor } from '@/lib/utils';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants';

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);



  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color)
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`)
    }
  }, [userInfo])

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.")
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.")
      return false;
    }
    return true;

  }

  const saveChanges = async () => {
    if (validateProfile()) {
      // alert("Move forwad")
      try {

        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({
            ...response.data,
            // lastName: response.data.lastName || lastName 
          });
          // console.log("Updated User Info:", { ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat")
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };


  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate('/chat')
    } else {
      toast.error("Please setup Profile .")
    }
  }


  const handleFileInputClick = () => {
    // alert("hello")
    fileInputRef.current.click();
  }

  const handleImageChange = async (event) => {

    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully.")
      }
      const reder = new FileReader();
      reder.onload = () => {
        setImage(reder.result);
      };
      reder.readAsDataURL(file);
    }
  }

  const handelDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image Remove successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='h-screen flex items-center justify-center flex-col gap-10 bg-gray-100'>
      <div
        style={{ borderRadius: '20px' }}
        className='flex flex-col gap-10 w-[80vw] md:w-[60vw] lg:w-[40vw] shadow-xl via-black p-6 bg-white'>
        <div onClick={handleNavigate}>
          <IoArrowBack className='text-4xl lg:text-6xl text-black cursor-pointer' onClick={() => navigate(-1)} />
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div
            className='h-48 w-48 md:w-56 md:h-56 relative flex items-center justify-center'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-48 w-48 md:w-56 md:h-56 rounded-full overflow-hidden border border-gray-300">
              {
                image
                  ? <AvatarImage
                    src={image}
                    alt="profile"
                    className='object-cover w-full h-full rounded-full'
                  />
                  : <div className={`uppercase h-full w-full flex items-center justify-center text-7xl ${getColor(selectedColor)}`}>
                    {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                  </div>
              }
            </Avatar>
            {hovered && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer'
                onClick={image ? handelDeleteImage : handleFileInputClick}>
                {image
                  ? <FaTrash className='text-white text-3xl cursor-pointer' onClick={() => setImage(null)} />
                  : <FaPlus className='text-white text-3xl cursor-pointer' onClick={() => {/* Implement image upload logic */ }} />
                }
              </div>
            )}
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={handleImageChange}
              name="profile-image" accept='.png ,.jpg ,.jpeg ,.svg ,.webp' />
          </div>
          <div className='flex flex-col gap-5 text-black items-center'>
            <input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="rounded-lg p-4 bg-transparent border border-gray-300 text-black font-semibold w-full"
            />
            <input
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              className="rounded-lg p-4 bg-transparent border border-gray-300 text-black font-semibold w-full"
            />
            <input
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              className="rounded-lg p-4 bg-transparent border border-gray-300 text-black font-semibold w-full"
            />
            <div className='flex gap-3'>
              {
                colors.map((color, index) =>
                  <div
                    className={`${color} h-8 w-8 rounded-md cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-black/50 outline-1" : ""}`}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                )
              }
            </div>
          </div>
        </div>
        <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 rounded-lg shadow-lg" onClick={saveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default Profile;
