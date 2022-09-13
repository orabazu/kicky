import { google, Loader, LoaderOptions } from 'google-maps';
import React, { createContext, useEffect, useState } from 'react';

type Maps = any;

type MapsProviderProps = {
  children: React.ReactNode;
  writeKey?: string;
};

type MapsContextProps = {
  google: Maps | undefined;
};

const defaultMapsContext = {
  google: undefined,
};

export const MapsContext = createContext<MapsContextProps>(defaultMapsContext);

export const MapsProvider = ({ children, writeKey }: MapsProviderProps): JSX.Element => {
  const [google, setGoogle] = useState<google | undefined>(undefined);

  const loadMaps = async () => {
    if (!writeKey || google) {
      return;
    }

    // add enviroment local to test it locally
    if (writeKey) {
      const options: LoaderOptions = {};
      const loader = new Loader(writeKey, options);

      const google = await loader.load();
      setGoogle(google);
    }
  };

  useEffect(() => {
    loadMaps();
  }, [writeKey]);

  return <MapsContext.Provider value={{ google }}>{children}</MapsContext.Provider>;
};
