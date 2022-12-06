import './App.less';

import { Header } from 'components/Header';
import { Loading } from 'components/Loading';
import React, { useEffect, Suspense } from 'react';

const DataSets = React.lazy(() => import('components/LeftBar/DataSets/DataSets'));
const Analytics = React.lazy(() => import('components/Analytics/Analytics'));
const Matches = React.lazy(() => import('components/LeftBar/Matches/Matches'));
const MatchDetail = React.lazy(() => import('components/LeftBar/Matches/MatchDetail/MatchDetail'));
import { Navigate, Route, Routes } from 'react-router-dom';

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

        <Route
          path="analytics"
          element={
            <Suspense>
              <Analytics />
            </Suspense>
          }
        >
          <Route path="dataset">
            <Route
              element={
                <Suspense fallback={<>Lazy loading</>}>
                  <DataSets />
                </Suspense>
              }
            />
            <Route
              path=""
              element={
                <Suspense fallback={<>Lazy loading</>}>
                  <DataSets />
                </Suspense>
              }
            />
            <Route
              path=":datasetId/matches"
              element={
                <Suspense>
                  <Matches />
                </Suspense>
              }
            />
            <Route
              path=":datasetId/matches/:matchId"
              element={
                <Suspense>
                  {' '}
                  <MatchDetail />
                </Suspense>
              }
            />
          </Route>

          <Route path="map" element={'Powered by google maps'} />
        </Route>

        <Route path="*" element={`<NoMatch />`} />
      </Routes>
    </>
  );
}

export default App;
