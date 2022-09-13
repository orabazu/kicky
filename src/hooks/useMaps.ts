import useMapContext from './useMapsContext';

const useMaps = () => {
  const { google } = useMapContext();

  return {
    google,
  };
};

export default useMaps;
