
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';

function Payment() {
    const navigate = useNavigate();

    // Paystack configuration
    const config = {
        reference: new Date().getTime().toString(), 
        email: 'delightvincent487@gmail.com',
        amount: 50000, 
        publicKey: 'pk_test_ef545c8d586d88daee8f055eb3f3f42d136d4865', 
    };

    // Initialize Paystack payment
    const initializePayment = usePaystackPayment(config);

    // Handle payment success
    const onSuccess = (reference) => {
        alert('Payment successful!', reference); 
        if (reference) {
            navigate('/')
        } 
        
    };

    // Handle payment failure
    const onClose = () => {
        console.log('Payment closed');
        // Show a message or handle the closure
        alert('Payment was not completed.');
    };

    return (
        <section className='flex justify-center items-center  h-full'>
            <div className="hidden lg:block h-full w-3/5">
                <img
                    src="/image/young-people-working-from-modern-place 1.png"
                    className="h-full w-full object-cover"
                    alt=""
                />
                <div onClick={() => navigate('/')} className="absolute top-4">
                    <img src="/image/LogoAyth.png" className="w-40" alt="" />
                </div>
            </div>

            <div className='flex flex-col h-full  w-11/12 lg:w-2/5 justify-center items-center'>
            <div onClick={() => navigate('/')} className=" block lg:hidden bg-black py-2 px-2">
                    <img src="/image/LogoAyth.png" className="w-40" alt="" />
                </div>

                <div className='w-[300px] lg:w-[400px]'>
                    <h1 className=' text-3xl lg:text-[40px] font-medium'>Make Payment</h1>
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
                        className='mt-4 w-full h-10 lg:h-14 rounded-lg cursor-pointer text-white bg-customOrange'>
                        Continue to Payment
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Payment;