import { useContext } from 'react';

import { MapsContext } from '../contexts/mapContext';

const useMapContext = () => useContext(MapsContext);
export default useMapContext;
