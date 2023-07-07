import { Functions } from 'firebase/functions';
import { createContext } from 'react';

export const FirebaseFunctionsContext = createContext<Functions>(null!);