import https from 'https';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!PAYSTACK_SECRET_KEY || !PAYSTACK_PUBLIC_KEY) {
    throw new Error('Paystack API keys are not configured. Please check your environment variables.');
}

if (!FRONTEND_URL) {
    throw new Error('Frontend URL is not configured. Please check your environment variables.');
}

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
                callback_url: `${FRONTEND_URL}/payment?reference=${reference}`
            });

            const req = https.request(options, res => {
                let data = '';

                res.on('data', (chunk) => { data += chunk });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (!response.status) {
                            reject(new Error(response.message || 'Failed to initialize transaction'));
                        } else {
                            resolve(response);
                        }
                    } catch (parseError) {
                        console.error('Failed to parse Paystack response:', parseError);
                        reject(new Error('Failed to parse Paystack response'));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Failed to connect to Paystack API:', error);
                reject(new Error('Failed to connect to Paystack API'));
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
                    try {
                        const response = JSON.parse(data);
                        if (!response.status) {
                            reject(new Error(response.message || 'Failed to verify transaction'));
                        } else {
                            resolve(response);
                        }
                    } catch (parseError) {
                        console.error('Failed to parse Paystack response:', parseError);
                        reject(new Error('Failed to parse Paystack response'));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Failed to connect to Paystack API:', error);
                reject(new Error('Failed to connect to Paystack API'));
            });

            req.end();
        });
    }
};

export default paystack; 