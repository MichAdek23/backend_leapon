import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Step4() {
    const { handleDecreament } = useContext(GlobalContext);
    const [textarea, setTextarea] = useState('');
    const [socialMedia, setSocialMedia] = useState('');
    const [profession, setProfession] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = () => {
        const newErrors = {};
        if (!socialMedia) newErrors.socialMedia = 'Social media link is required';
        if (!profession) newErrors.profession = 'Profession is required';
        if (!textarea) newErrors.textarea = 'Introduction is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            navigate('/payMent');
        }
    };

    return (
        <div className=' text-center lg:text-start w-[300px] lg:w-[470px]'>
            {/* Back Button */}
            <div onClick={handleDecreament}>
                <button className="w-10 flex justify-center items-center text-slate-200 h-10 bg-slate-400 rounded-full">
                    <FontAwesomeIcon className="text-2xl" icon={faArrowLeft} />
                </button>
            </div>
            <p className='text-base text-center font-medium mt-3 lg:mt-6'>STEP 4 of 4</p>

            <progress className='bg-customOrange h-2' value="100" max="100"></progress>

            <h1 className='mt-7 mb-12 text-xl lg:text-[36px] font-medium'>Tell us About yourself</h1>

            {/* Social Media Input Field */}
            <div className='border-2 relative w-full rounded-xl mb-4'>
                <input
                    type="text"
                    className='relative outline-none p-4 w-full rounded-xl'
                    placeholder='E.g @Linkdin'
                    value={socialMedia}
                    onChange={(e) => setSocialMedia(e.target.value)}
                />
                <p className='absolute -top-3 left-4 bg-white px-2 text-base font-bold text-slate-400'>
                   Social media link
                </p>
                {errors.socialMedia && <p className='text-red-500'>{errors.socialMedia}</p>}
            </div>

            <div className='border-2 relative w-full rounded-xl mb-4'>
                <input
                    type="text"
                    className='relative outline-none p-4 w-full rounded-xl'
                    placeholder='E.g Computer Science'
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                />
                <p className='absolute -top-3 left-4 bg-white px-2 text-base font-bold text-slate-400'>
                    Profession
                </p>
                {errors.profession && <p className='text-red-500'>{errors.profession}</p>}
            </div>

            <div className='border-2 relative w-full rounded-xl mb-4'>
                <textarea
                    className='relative outline-none p-4 w-full h-40 rounded-xl'
                    placeholder='Introduce yourself to your mentees, let them know about you'
                    value={textarea}
                    onChange={(e) => setTextarea(e.target.value)}
                />
                <p className='absolute -top-3 left-4 bg-white px-2 text-base font-bold text-slate-400'>
                Tell us about your Self
                </p>
                {errors.textarea && <p className='text-red-500'>{errors.textarea}</p>}
            </div>

            {/* Continue Button */}
            <button onClick={handleSubmit} className='mt-4 w-full h-11 lg:h-14 rounded-lg cursor-pointer text-white bg-customOrange'>
                Continue
            </button>
        </div>
    );
}

export default Step4;