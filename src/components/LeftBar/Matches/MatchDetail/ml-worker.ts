/* eslint-disable no-undef */
import KMeans from 'tf-kmeans';
import { DataFrame } from 'danfojs/dist/danfojs-browser/src';

import '@tensorflow/tfjs-backend-webgl';

self.onmessage = ({ data }) => {
  const homeTrainData = new DataFrame(data.home);
  const awayTrainData = new DataFrame(data.away);

  const kmeans = new KMeans({
    k: 7,
    maxIter: 20,
    distanceFunction: KMeans.EuclideanDistance,
  });
  const predictionsHome = kmeans.Train(homeTrainData.tensor);
  const predictionsAway = kmeans.Train(awayTrainData.tensor);

  self.postMessage({
    predictionsHome: predictionsHome.arraySync(),
    predictionsAway: predictionsAway.arraySync(),
  });
};

export default null;
