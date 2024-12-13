import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Upload from '@/components/Upload';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import {
  PaperClipIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { usePostUpdate } from '@/components/PostUpdater'

type ReplyingTo = {
  address: string;
  url: string;
};

interface Props {
  onSubmit?: (event: Event) => void;
  replyingTo?: ReplyingTo;
  placeholder?: string;
}

type UploadedFile = {
  url: string;
  name: string;
  fileType: string;
  // fileType: 'image' | 'video';
};

const NewPostForm: React.FC<Props & { onClose?: () => void }> = ({
  onSubmit,
  replyingTo,
  placeholder,
  onClose
}) => {
  const { data: session } = useSession() || {};
  const [postText, setPostText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { triggerFetch } = usePostUpdate();

  const handlePostTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFiles([...uploadedFiles, file]);
  };

  const handleRemoveFile = (url: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.url !== url)
    );
  };

  const handleSubmit = async () => {
    setIsPosting(true);
    setUploadError('');
  
    try {
      const currentImage = uploadedFiles[0] ? uploadedFiles[0].url : null;
      console.log("Current Image: ", currentImage)
  
      // if (!currentImage) {
      //   throw new Error("No image to upload");
      // }
  
      const postData = {
        content: postText,
        files: uploadedFiles,
        ...(replyingTo && { replyingTo }),
      };
  
      const postRequest = await fetch('/api/post/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postData }),
      });
  
      if (!postRequest.ok) {
        throw new Error("Failed to submit post");
      }
  
      const postResponse = await postRequest.json();
      console.log("POST DATA: ", postResponse);
  
      if (postResponse.success) {
        console.log('Successfully posted:', postResponse.postCreationData.cid);

        setPostText('');
        setUploadedFiles([]);
        triggerFetch();
        onClose?.();
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadError((error as any).message);
    } finally {
      setIsPosting(false);
    }
  };  

  const myAddress = (session?.user as any)?.address || '';

  return (
    <>
      <div className="flex items-start">
        <div className="flex-grow">
          <Textarea
            value={postText}
            onChange={handlePostTextChange}
            placeholder={placeholder || "What's on your mind?"}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-start items-center space-x-2">
          <Upload
            onFileUpload={handleFileUpload}
            onError={(e) => setUploadError(e)}
          >
            <button
              className="btn btn-ghost btn-circle"
              onClick={(e) => e.preventDefault()}
            >
              <PaperClipIcon width={24} />
            </button>
          </Upload>
          {uploadedFiles.map((file) => (
            <div key={file.url} className="flex items-center space-x-1">
              {file.fileType === 'image' ? (
                <PhotoIcon width={20} />
              ) : (
                <VideoCameraIcon width={20} />
              )}
              <span className="text-sm">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(file.url)}
                className="text-purple-500 hover:text-purple-600"
              >
                <XMarkIcon width={14} />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isPosting || (postText.length === 0 && uploadedFiles.length === 0)}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </Button>
      </div>
      {uploadError && <p className="text-red-500">{uploadError}</p>}
    </>
  );
};

export default NewPostForm;
