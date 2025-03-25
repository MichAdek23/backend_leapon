import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function StepOne() {
  const { handleIncreament, formData, setFormData } = useContext(GlobalContext);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [gender, setGender] = useState('');

  const uploadToCloudinary = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // You can create a specific upload preset in Cloudinary

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dxuxxhoza/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      // Save image URL to formData
      setFormData(prev => ({ ...prev, profilePicture: data.secure_url }));
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadToCloudinary(file);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleGenderChange = (value) => {
    setGender(value);
    setFormData(prev => ({ ...prev, gender: value }));
  };

  return (
    <div className='text-center lg:text-start w-[300px] lg:w-[400px]'>
      <p className='text-base font-medium mt-3 lg:mt-6'>STEP 1 of 4</p>

      {/* Progress Bar */}
      <progress className="progress-bar h-2" value="30" max="100"></progress>

      <h1 className='mt-7 text-xl lg:text-[36px] font-medium'>Complete Profile Details</h1>

      {/* Upload Image */}
      <div>
        <p className='mt-5 text-lg font-medium text-cyan-600'>Upload profile photo*</p>

        <div className='flex flex-col lg:flex-row items-center mt-5 gap-3'>
          <div className='h-[75px] w-[75px] rounded-full flex justify-center items-center bg-slate-600 font-medium text-blue-950'>
            {imageUrl ? <img src={imageUrl} className='h-full w-full rounded-full' alt="Profile" /> : <p className='text-4xl'>M</p>}
          </div>
          <div>
            <input 
              type="file" 
              name="image" 
              className='bg-transparent' 
              onChange={handleImageUpload} 
              accept="image/*"
              disabled={uploading}
            />
            <p>{uploading ? 'Uploading...' : 'Make sure the file is below 12MB'}</p>
          </div>
        </div>
      </div>

      {/* Select Gender */}
      <div className='relative border-2 rounded-lg mt-6 border-gray-300'>
        <Select onValueChange={handleGenderChange} value={gender}>
          <SelectTrigger className=" w-[300px] lg:w-[400px] h-12 lg:h-[60px] border-0">
            <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
        <p className='absolute left-3 bottom-10 lg:bottom-12 bg-white text-base font-bold text-slate-400'>Select Gender</p>
      </div>

      {/* Continue Button */}
      <button onClick={handleIncreament} className='mt-4 w-full h-11 lg:h-14 rounded-lg cursor-pointer text-white bg-customOrange'>
        Continue
      </button>
    </div>
  );
}

export default StepOne;
