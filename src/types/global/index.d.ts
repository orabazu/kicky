import { Environment } from 'types/common';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_GOOGLE_MAPS_KEY: string;
    }
  }
}
