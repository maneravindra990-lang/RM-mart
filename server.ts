import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = express();
  app.use(express.json());

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  const ai = new (await import('@google/genai')).GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // API Route: Send Order Email
  app.post('/api/orders/notify', async (req, res) => {
    const { order, ownerEmail } = req.body;
    try {
      if (!resend) {
        console.warn('RESEND_API_KEY not set. Skipping email notification.');
        return res.status(200).json({ success: true, message: 'Email skipped' });
      }

      await resend.emails.send({
        from: 'RM Mart <orders@resend.dev>',
        to: ownerEmail || 'maneravindra990@gmail.com',
        subject: `New Order Received - RM Mart #${order.id}`,
        html: `
          <h1>New Order #${order.id}</h1>
          <p><strong>Customer:</strong> ${order.customerDetails.fullName}</p>
          <p><strong>Phone:</strong> ${order.customerDetails.mobile}</p>
          <p><strong>Address:</strong> ${order.customerDetails.address}, ${order.customerDetails.city}, ${order.customerDetails.state} - ${order.customerDetails.pinCode}</p>
          <h2>Items:</h2>
          <ul>
            ${order.items.map((item: any) => `<li>${item.name} x ${item.quantity} - ₹${item.price}</li>`).join('')}
          </ul>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        `
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error('Email error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: AI Support Chatbot
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    try {
      // @ts-ignore
      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          { role: 'user', parts: [{ text: `System: You are the RM Mart Shopping Assistant. Help customers find products, explain shipping (free above ₹500), and guide them. Be polite and helpful. Context: RM Mart sells Fashion, Electronics, and Clothing. Current message: ${message}` }] },
          ...history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          }))
        ],
        config: {
          systemInstruction: "You are a professional, helpful Indian e-commerce assistant for RM Mart. Use a friendly tone. Mention RM Mart's tagline 'Everything You Need, All in One Place'."
        }
      });
      res.json({ response: result.text });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    const fs = await import('fs');
    const path = await import('path');

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const path = await import('path');
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

bootstrap();
