import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './components/contacts-container';
import EmptyContainer from './components/empty-container';
import ChatContainer from './components/chat-container';

function Chat() {
  const {
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
    userInfo ,
    selectedChatType
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast('Please setup profile to continue.');
      navigate("/profile")
    }
  }, [userInfo, navigate])
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {
        isUploading && 
(        <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
  <h5 className='text-5xl animate-pulse'>Uploading File</h5>
  {fileUploadProgress}%
</div>)
      }
            {
        isDownloading && 
(        <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
  <h5 className='text-5xl animate-pulse'>Downloading File</h5>
  {fileDownloadProgress}%
</div>)
      }
      <ContactsContainer/>
      {
        selectedChatType === undefined ? <EmptyContainer/> : <ChatContainer/>
      }
      </div>
  )
}

export default Chat