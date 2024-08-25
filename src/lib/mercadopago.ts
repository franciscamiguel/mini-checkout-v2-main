import { MercadoPagoConfig, Payment } from "mercadopago";

const token = process.env.ACCESS_TOKEN_MP
if (!token) {
  throw new Error("Mercado Pago access token is not set");
}



const client = new MercadoPagoConfig({
  accessToken: token,
});


export const payment = new Payment(client);