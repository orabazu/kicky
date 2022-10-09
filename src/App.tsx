import './App.less';

import { Header } from 'components/Header';
import { DataSets } from 'components/LeftBar/DataSets/DataSets';
import { MatchDetail } from 'components/LeftBar/Matches/MatchDetail';
import { Matches } from 'components/LeftBar/Matches/Matches';
import React from 'react';
import { /*Link, Outlet,*/ Route, Routes } from 'react-router-dom';

import { Analytics } from './components/Analytics';

function App() {
  return (
    <>
      <Header />

      {/* <nav>
        <Link to="/analytics">Analytics</Link>
        <Link to="/user">User</Link>
      </nav> */}
      <Routes>
        <Route index element={<Analytics />} />
        <Route path="analytics" element={<Analytics />}>
          <Route path="dataset" element={<DataSets />}></Route>
          <Route path="dataset/:datasetId/matches" element={<Matches />} />
          <Route path="dataset/:datasetId/matches/:matchId" element={<MatchDetail />} />
          <Route path="map" element={'<Map />'} />
        </Route>
        {/* <Route path="user" element={<User />} /> */}

        <Route path="*" element={`<NoMatch />`} />
      </Routes>
    </>
  );
}

export default App;

// const User = () => {
//   return (
//     <>
//       <h1>User</h1>

//       <nav>
//         <Link to="profile">Profile</Link>
//         <Link to="account">Account</Link>
//       </nav>

//       <Outlet />
//     </>
//   );
// };
