import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../../lib/AuthContext';
import { useState } from 'react';

function Payment() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Paystack configuration
    const config = {
        reference: new Date().getTime().toString(),
        email: user?.email || '',
        amount: 50000, // Amount in kobo (₦500)
        publicKey: 'pk_test_ef545c8d586d88daee8f055eb3f3f42d136d4865',
    };

    // Initialize Paystack payment
    const initializePayment = usePaystackPayment(config);

    // Handle payment success
    const onSuccess = async (reference) => {
        try {
            setLoading(true);
            setError('');
            
            // Verify payment with backend
            const response = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ reference: reference.reference })
            });

            if (!response.ok) {
                throw new Error('Payment verification failed');
            }

            // Redirect based on user role
            if (user?.role === 'mentor') {
                navigate('/mentor-dashboard');
            } else if (user?.role === 'student') {
                navigate('/mentee-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle payment failure
    const onClose = () => {
        setError('Payment was not completed.');
    };

    return (
        <section className='flex justify-center items-center h-full'>
            <div className="hidden lg:block h-full w-3/5">
                <img
                    src="/image/young-people-working-from-modern-place 1.png"
                    className="h-full w-full object-cover"
                    alt=""
                    loading="lazy"
                />
                <div onClick={() => navigate('/')} className="absolute top-4">
                    <img src="/image/LogoAyth.png" loading="lazy" className="w-40" alt="" />
                </div>
            </div>

            <div className='flex flex-col h-full w-11/12 lg:w-2/5 justify-center items-center'>
                <div onClick={() => navigate('/')} className="block lg:hidden bg-black py-2 px-2">
                    <img src="/image/LogoAyth.png" loading="lazy" className="w-40" alt="" />
                </div>

                <div className='w-[300px] lg:w-[400px]'>
                    <h1 className='text-3xl lg:text-[40px] font-medium'>Make Payment</h1>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className='flex justify-between mt-8'>
                        <h1 className='text-slate-500'>Product Name</h1>
                        <p className='text-slate-800 font-semibold'>Mentorship</p>
                    </div>

                    <div className='flex justify-between mt-8'>
                        <h1 className='text-slate-500'>Price/Amount</h1>
                        <p className='text-slate-800 font-semibold'>
                            ₦5,000
                        </p>
                    </div>

                    <div className='flex justify-between mt-8'>
                        <h1 className='text-slate-500'>Use 90% Discount code</h1>
                        <p className='text-slate-800 font-semibold'>
                            <del> ₦5,000</del> ₦500
                        </p>
                    </div>

                    <button
                        onClick={() => initializePayment(onSuccess, onClose)}
                        disabled={loading}
                        className={`mt-4 w-full h-10 lg:h-14 rounded-lg cursor-pointer text-white bg-customOrange hover:bg-orange-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Continue to Payment'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Payment;