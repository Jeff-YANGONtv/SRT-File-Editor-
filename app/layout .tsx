import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react' // ဒီ Line လေး ထည့်ထားရင် ပိုစိတ်ချရပါတယ်

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Yangon TV Subtitle Editor',
  description: 'Internal Subtitle Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> 
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
