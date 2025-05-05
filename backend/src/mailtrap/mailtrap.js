// src/mailtrap/email.js
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com", // must be authorized in your Mailtrap inbox
  name: "Patel MernStack",
};