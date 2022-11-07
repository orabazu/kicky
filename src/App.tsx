import './App.less';

import { Header } from 'components/Header';
import { DataSets } from 'components/LeftBar/DataSets/DataSets';
import { MatchDetail } from 'components/LeftBar/Matches/MatchDetail';
import { Matches } from 'components/LeftBar/Matches/Matches';
import { Loading } from 'components/Loading';
import React, { useEffect } from 'react';
import { /*Link, Outlet,*/ Navigate, Route, Routes } from 'react-router-dom';

import { Analytics } from './components/Analytics';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500);
  });
  return (
    <>
      {showSplash && <Loading />}
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/analytics/dataset" />} />
        <Route path="analytics" element={<Analytics />}>
          <Route path="dataset">
            <Route element={<DataSets />} index />
            <Route path="" element={<DataSets />} />
            <Route path=":datasetId/matches" element={<Matches />} />
            <Route path=":datasetId/matches/:matchId" element={<MatchDetail />} />
          </Route>

          <Route path="map" element={'<Map />'} />
        </Route>

        <Route path="*" element={`<NoMatch />`} />
      </Routes>
    </>
  );
}

export default App;
