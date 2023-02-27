const twilio = require('twilio');
const client = twilio(accountSid, authToken);

const accountSid = 'AC7d8d9464fb84137786f94c7284aab43b';
const authToken = '96e86343bbfed5db1e2b4082d6b91924';

const sendPhoneMsg = async (num) => {
  try {
    const message = await client.messages.create({
      body: 'Su pedido se ha recibido y se encuentra en proceso',
      from: '+12708175580',
      to: `+${num}`,
    });
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

const sendWhatsAppMsg = async (body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5491124559072',
    });
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendPhoneMsg, sendWhatsAppMsg };
