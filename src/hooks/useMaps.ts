import useMapContext from './useMapsContext';

const useMaps = () => {
  const { gmaps } = useMapContext();

  return {
    gmaps,
  };
};

export default useMaps;
