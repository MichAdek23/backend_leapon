import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function GetOtp() {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const OtpData = watch();

  useEffect(() => {
    localStorage.setItem('OtpData', JSON.stringify(OtpData));
  }, [OtpData]);

  useEffect(() => {
    const savedFormData = localStorage.getItem('loginFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('otp1', parsedFormData.otp1);
      setValue('otp2', parsedFormData.otp2);
      setValue('otp3', parsedFormData.otp3);
      setValue('otp4', parsedFormData.otp4);
      setValue('otp5', parsedFormData.otp5);
    }
  }, [setValue]);

  const onSubmit = () => {
    // Handle form submission
    navigate('/ChangePassword')
  };

 
  const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    if (value.length > 1) {
      e.target.value = value.slice(0, 1); 
    }
    setValue(fieldName, e.target.value); 
  };

  return (
    <section className="relative flex h-full">
      <div className="hidden lg:block h-full w-3/5">
        <img src="image/young-people-working-from-modern-place 1.png" className="h-full w-full object-cover" alt="" />
        <div onClick={()=> navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" className=" w-40" alt="" />
        </div>
      </div>

      <div className="flex items-center w-full lg:w-2/5 justify-center">
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className="text-2xl font-bold lg:text-[40px] text-customDarkBlue"> Verify OTP</h1>
          <p className="text-slate-400 text-sm mt-2">Welcome back! Please enter your details</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex  items-center gap-3 mt-4">
              <input
                {...register('otp1', { required: 'This field is required', maxLength: { value: 1 } })}
                type="text"
                inputMode="numeric"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                onChange={(e) => handleInputChange(e, 'otp1')}
              />
              <input
                {...register('otp2', { required: 'This field is required', maxLength: { value: 1 } })}
                type="text"
                inputMode="numeric"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                onChange={(e) => handleInputChange(e, 'otp2')}
              />
              <input
                {...register('otp3', { required: 'This field is required', maxLength: { value: 1 } })}
                type="text"
                inputMode="numeric"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                onChange={(e) => handleInputChange(e, 'otp3')}
              />

             <input
                {...register('otp4', { required: 'This field is required', maxLength: { value: 1 } })}
                type="text"
                inputMode="numeric"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                onChange={(e) => handleInputChange(e, 'otp3')}
              />

              <input
                {...register('otp5', { required: 'This field is required', maxLength: { value: 1 } })}
                type="text"
                inputMode="numeric"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                onChange={(e) => handleInputChange(e, 'otp3')}
              />
            </div>
            {errors.otp1 && <p className="text-red-500 text-sm mt-1">{errors.otp1.message}</p>}
            {errors.otp2 && <p className="text-red-500 text-sm mt-1">{errors.otp2.message}</p>}
            {errors.otp3 && <p className="text-red-500 text-sm mt-1">{errors.otp3.message}</p>}

            <div className="mt-4">
              <button  type="submit" className="text-white bg-customOrange w-full h-14 rounded-lg cursor-pointer">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default GetOtp;