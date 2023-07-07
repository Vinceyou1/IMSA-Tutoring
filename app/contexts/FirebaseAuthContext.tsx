import { Auth } from 'firebase/auth';
import { createContext } from 'react';

export const FirebaseAuthContext = createContext<Auth>(null!);