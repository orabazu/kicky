import { google, Loader, LoaderOptions } from 'google-maps';
import React, { createContext, useEffect, useState } from 'react';

type Maps = google;

type MapsProviderProps = {
  children: React.ReactNode;
  writeKey?: string;
};

type MapsContextProps = {
  gmaps: Maps | undefined;
};

const defaultMapsContext = {
  gmaps: undefined,
};

export const MapsContext = createContext<MapsContextProps>(defaultMapsContext);

export const MapsProvider = ({ children, writeKey }: MapsProviderProps): JSX.Element => {
  const [gmaps, setGmaps] = useState<Maps | undefined>(undefined);

  const loadMaps = async () => {
    if (!writeKey || gmaps) {
      return;
    }

    // add enviroment local to test it locally
    if (writeKey) {
      const options: LoaderOptions = {};
      const loader = new Loader(writeKey, options);

      const gmaps = await loader.load();
      setGmaps(gmaps);
    }
  };

  useEffect(() => {
    loadMaps();
  }, [writeKey]);

  return <MapsContext.Provider value={{ gmaps }}>{children}</MapsContext.Provider>;
};
