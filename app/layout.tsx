'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from './header'
import initFirebase from '@/firebase/clientApp'
import { getAuth } from 'firebase/auth'
import { FirebaseAuthContext } from './contexts/FirebaseAuthContext'
import { FirebaseFunctionsContext } from './contexts/FirebaseFunctionsContext'
import { getFunctions } from 'firebase/functions'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IMSA Tutoring',
}

const app = initFirebase();
const auth = getAuth();
const functions = getFunctions(app);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <FirebaseAuthContext.Provider value={auth}>
          <Header />
          <FirebaseFunctionsContext.Provider value={functions}>
            {children}
          </FirebaseFunctionsContext.Provider>
        </FirebaseAuthContext.Provider>
      </body>
    </html>
  )
}
