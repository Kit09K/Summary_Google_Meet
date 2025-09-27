"use client";

import React, { useState } from 'react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { Card, CardContent } from '../ui/Card';
import { signIn } from 'next-auth/react';


export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('Google sign-in initiated');
    setIsLoading(true);
    try {
    //   NextAuth Google OAuth integration
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true
      });
      console.log('Google sign-in initiated');
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MeetSummary</h1>
        <p className="text-gray-600">สรุปการประชุมอัจฉริยะด้วย AI</p>
      </div>

      {/* Login Card */}
      <Card>
        <CardContent>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
            <p className="text-gray-600">เชื่อมต่อกับ Google Account ของคุณ</p>
          </div>

          <GoogleAuthButton 
            onSignIn={handleGoogleSignIn}
            isLoading={isLoading}
          />

          {/* Features List */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-4 text-center">คุณสมบัติที่คุณจะได้รับ:</p>
            <div className="space-y-2">
              <FeatureItem text="เข้าถึงไฟล์บันทึก Google Meet" />
              <FeatureItem text="สรุปการประชุมอัตโนมัติด้วย AI" />
              <FeatureItem text="จัดการและแชร์การสรุปได้ง่าย" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          โดยการเข้าสู่ระบบ คุณยอมรับ{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">เงื่อนไขการใช้งาน</a> และ{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">นโยบายความเป็นส่วนตัว</a>
        </p>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center text-sm text-gray-600">
    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    {text}
  </div>
);