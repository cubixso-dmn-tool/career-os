import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailManager {
  private static transporter: nodemailer.Transporter | null = null;
  private static readonly VERIFICATION_TOKEN_EXPIRY = '24h';

  static configure(config?: EmailConfig) {
    if (config) {
      this.transporter = nodemailer.createTransport(config);
    } else if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Use environment variables
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Use development test account
      console.log("📧 Using Ethereal test email account for development");
      this.createTestAccount();
    }
  }

  private static async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`📧 Test email credentials: ${testAccount.user} / ${testAccount.pass}`);
    } catch (error) {
      console.error('Failed to create test email account:', error);
    }
  }

  // Generate email verification token
  static generateVerificationToken(userId: number, email: string): string {
    const payload = {
      userId,
      email,
      type: 'email_verification',
      timestamp: Date.now()
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: this.VERIFICATION_TOKEN_EXPIRY
    });
  }

  // Verify email verification token
  static verifyEmailToken(token: string): { userId: number; email: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
      
      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid token type');
      }

      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      console.error('Email verification token invalid:', error);
      return null;
    }
  }

  // Send verification email
  static async sendVerificationEmail(
    email: string, 
    username: string, 
    verificationToken: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@careeros.com',
      to: email,
      subject: 'Verify your CareerOS account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { 
              display: inline-block; 
              background: #2563eb; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CareerOS!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>Thank you for creating your CareerOS account. Please verify your email address to get started with personalized career development.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
              
              <p><strong>This link expires in 24 hours.</strong></p>
              
              <p>If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 CareerOS. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', info.messageId);
      
      // Log preview URL for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      return false;
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(
    email: string, 
    username: string, 
    resetToken: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@careeros.com',
      to: email,
      subject: 'Reset your CareerOS password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { 
              display: inline-block; 
              background: #dc2626; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>We received a request to reset the password for your CareerOS account.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
              
              <p><strong>This link expires in 1 hour.</strong></p>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>For security, this request was made from IP: ${this.getClientIP()}</p>
            </div>
            <div class="footer">
              <p>© 2024 CareerOS. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', info.messageId);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return false;
    }
  }

  // Send admin notification email
  static async sendAdminNotification(
    subject: string,
    message: string,
    severity: 'info' | 'warning' | 'error' = 'info'
  ): Promise<boolean> {
    if (!this.transporter || !process.env.ADMIN_EMAIL) {
      return false;
    }

    const colors = {
      info: '#2563eb',
      warning: '#f59e0b',
      error: '#dc2626'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'system@careeros.com',
      to: process.env.ADMIN_EMAIL,
      subject: `[CareerOS ${severity.toUpperCase()}] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${colors[severity]}; color: white; padding: 20px;">
            <h2>${subject}</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <p>${message}</p>
            <p style="color: #666; font-size: 12px;">
              Timestamp: ${new Date().toISOString()}<br>
              Environment: ${process.env.NODE_ENV || 'development'}
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification sent: ${subject}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
      return false;
    }
  }

  private static getClientIP(): string {
    // This would be populated from request in actual usage
    return 'N/A';
  }

  // Check if email service is configured
  static isConfigured(): boolean {
    return this.transporter !== null;
  }
}

// Initialize email service
EmailManager.configure();