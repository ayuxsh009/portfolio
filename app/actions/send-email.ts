"use server"

import nodemailer from "nodemailer"

// Types for our form data
export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendEmail(formData: ContactFormData) {
  try {
    // Create a transporter with your email service settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Create email message
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: formData.email,
      subject: `Portfolio Contact: ${formData.subject}`,
      text: `
        Name: ${formData.name}
        Email: ${formData.email}
        
        Message:
        ${formData.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #3b82f6;">New Portfolio Contact Message</h2>
          <p><strong>From:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    return { success: true, message: "Email sent successfully!" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to send email. Please try again later." }
  }
}
