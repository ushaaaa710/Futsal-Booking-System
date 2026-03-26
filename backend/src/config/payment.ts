// eSewa and Khalti payment gateway API configurations
// Placeholder - to be implemented when payment integration is needed

export const paymentConfig = {
  esewa: {
    merchantId: process.env.ESEWA_MERCHANT_ID || "",
    apiUrl: process.env.ESEWA_API_URL || "https://uat.esewa.com.np",
  },
  khalti: {
    secretKey: process.env.KHALTI_SECRET_KEY || "",
    apiUrl: process.env.KHALTI_API_URL || "https://a.khalti.com/api/v2",
  },
};

export default paymentConfig;
