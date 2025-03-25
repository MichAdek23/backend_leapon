import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentVerify() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        const verifyPayment = async () => {
            const searchParams = new URLSearchParams(location.search);
            const reference = searchParams.get('reference');
            const trxref = searchParams.get('trxref');
            const status = searchParams.get('status');

            // Use either reference or trxref, preferring reference
            const paymentReference = reference || trxref;

            if (!paymentReference) {
                setError('No payment reference found');
                setVerificationStatus('failed');
                setLoading(false);
                navigate('/payment?error=no_reference');
                return;
            }

            try {
                // Verify payment with backend
                const response = await fetch(`https://leapon.onrender.com/api/payments/verify/${paymentReference}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Payment verification failed');
                }

                setVerificationStatus('success');
                
                // Clear all stored data
                localStorage.removeItem('userData');
                localStorage.removeItem('formData');
                localStorage.removeItem('loginFormData');
                localStorage.removeItem('token');

                // Wait for 2 seconds to show success message
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (err) {
                setError('Payment verification failed. Please contact support.');
                setVerificationStatus('failed');
                console.error('Payment verification error:', err);
                navigate('/payment?error=verification_failed');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [location, navigate]);

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
                    <h1 className='text-3xl lg:text-[40px] font-medium'>Verifying Payment</h1>
                    
                    {loading ? (
                        <div className="mt-8 p-4 bg-blue-100 text-blue-700 rounded-lg">
                            Please wait while we verify your payment...
                        </div>
                    ) : error ? (
                        <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    ) : verificationStatus === 'success' ? (
                        <div className="mt-8 p-4 bg-green-100 text-green-700 rounded-lg">
                            Payment verified successfully! Redirecting to sign-in...
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default PaymentVerify; 