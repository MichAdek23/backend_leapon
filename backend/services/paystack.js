import https from 'https';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PAYSTACK_SECRET_KEY = 'sk_live_d80d3befb2d52bbd7b950e07145a5f904bb7c458';
const PAYSTACK_PUBLIC_KEY = 'pk_live_9014455da6f8af7f59c7ca7718691d9353ef17eb';

const paystack = {
    // Initialize transaction
    initializeTransaction: async (email, amount, reference) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transaction/initialize',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            };

            const params = JSON.stringify({
                email,
                amount: amount * 100, // Convert to kobo
                reference,
                callback_url: 'https://leap-on-mentorship-program-xkjq.vercel.app/payment/verify'
            });

            const req = https.request(options, res => {
                let data = '';

                res.on('data', (chunk) => { data += chunk });
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            });

            req.on('error', error => {
                reject(error);
            });

            req.write(params);
            req.end();
        });
    },

    // Verify transaction
    verifyTransaction: async (reference) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/transaction/verify/${reference}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, res => {
                let data = '';

                res.on('data', (chunk) => { data += chunk });
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            });

            req.on('error', error => {
                reject(error);
            });

            req.end();
        });
    }
};

export default paystack; 