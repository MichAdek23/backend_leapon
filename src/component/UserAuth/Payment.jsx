import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useState, useEffect } from 'react';

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    // Check if user is logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Handle error parameters from verification
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const error = searchParams.get('error');
        
        if (error) {
            switch (error) {
                case 'verification_failed':
                    setError('Payment verification failed. Please try again.');
                    break;
                case 'no_reference':
                    setError('No payment reference found. Please try again.');
                    break;
                default:
                    setError('An error occurred during payment. Please try again.');
            }
        }
    }, [location]);

    // Handle payment initialization
    const handlePayment = async () => {
        try {
            setLoading(true);
            setError('');
            setPaymentStatus('initializing');

            // Initialize payment with backend
            const response = await fetch('https://leapon.onrender.com/api/payments/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: user.email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to initialize payment');
            }

            setPaymentStatus('redirecting');
            
            // Redirect to Paystack payment page
            window.location.href = data.authorizationUrl;
        } catch (err) {
            setError('Failed to initialize payment. Please try again.');
            setPaymentStatus('failed');
            console.error('Payment initialization error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Show payment status message
    const getStatusMessage = () => {
        switch (paymentStatus) {
            case 'initializing':
                return 'Initializing payment...';
            case 'redirecting':
                return 'Redirecting to payment page...';
            case 'failed':
                return 'Payment failed. Please try again.';
            default:
                return '';
        }
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

                    {paymentStatus && (
                        <div className={`mt-4 p-3 rounded-lg ${
                            paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {getStatusMessage()}
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
                        onClick={handlePayment}
                        disabled={loading || paymentStatus === 'redirecting'}
                        className={`mt-4 w-full h-10 lg:h-14 rounded-lg cursor-pointer text-white bg-customOrange hover:bg-orange-600 transition-colors ${
                            (loading || paymentStatus === 'redirecting') 
                            ? 'opacity-50 cursor-not-allowed' 
                            : ''
                        }`}
                    >
                        {loading ? 'Processing...' : 'Continue to Payment'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Payment;