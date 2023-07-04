"use client"
import initFirebase from '@/firebase/clientApp';
import { Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import Image from 'next/image'

export default function Hello() {
  initFirebase();
  const auth = getAuth();
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <p>Hello World!</p>
      <Button onClick={() => auth.signOut()}>Sign Out</Button>
    </main>
  )
}
