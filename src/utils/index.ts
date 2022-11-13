//@ts-ignore
import * as UTM from 'utm-latlng';

import { stadiums } from '../const/stadiumCoords';

export enum ShotOutcome {
  'Goal' = 97,
}

export enum PassTechnique {
  Inswinging = 104,
  Outswinging = 105,
  Straight = 107,
  ThroughBall = 108,
}

// export const getGeoCoords = (pixelX: number, pixelY: number, stadiumId: number) => {
//   const homeStadium = stadiums.find((stadium) => stadium.id === stadiumId);
//   const { bottomLeft, bottomRight } = homeStadium!.coords;

//   const [bottomRightX, bottomRightY] = bottomRight;
//   const [bottomLeftX, bottomLeftY] = bottomLeft;

//   const rotationinRadians = getAngle(
//     bottomLeftX,
//     bottomLeftY,
//     bottomRightX,
//     bottomRightY,
//   );
//   const convertedX =
//     (pixelX * Math.cos(rotationinRadians) + pixelY * Math.sin(rotationinRadians)) *
//       -0.000009 +
//     bottomRightX;
//   const convertedY =
//     (pixelX * -Math.sin(rotationinRadians) + pixelY * Math.cos(rotationinRadians)) *
//       0.000014 +
//     bottomRightY;

//   return [convertedX, convertedY];
// };

export const getGeoCoordsFromUTM = (
  pixelX: number,
  pixelY: number,
  stadiumId: number,
) => {
  const homeStadium = stadiums.find((stadium) => stadium.id === stadiumId);
  const utm = new UTM();

  const { upperLeftInUTM, upperRightInUTM } = homeStadium!.coords;
  const [northingUpperLeft, eastingUpperLeft] = upperLeftInUTM!;
  const [northingUpperRight, eastingUpperRight] = upperRightInUTM!;

  const normalizedPixelX = (105 * pixelX) / 120;
  const normalizedPixelY = (68 * pixelY) / 80; //todo find Y distance

  let rotationinRadians = getAngle(
    eastingUpperLeft,
    northingUpperLeft,
    eastingUpperRight,
    northingUpperRight,
  );

  const rotationinDegrees = (rotationinRadians * 180) / Math.PI;

  if (rotationinDegrees <= 0) {
    rotationinRadians = rotationinRadians + Math.PI / 2;
  } else {
    rotationinRadians = Math.PI / 2 - rotationinRadians;
  }

  // convert radians to degrees
  const convertedXUTM =
    normalizedPixelX * Math.cos(rotationinRadians) +
    normalizedPixelY * -Math.sin(rotationinRadians) +
    northingUpperLeft;
  const convertedYUTM =
    normalizedPixelX * Math.sin(rotationinRadians) +
    normalizedPixelY * Math.cos(rotationinRadians) +
    eastingUpperLeft;

  const { lat, lng } = utm.convertUtmToLatLng(convertedYUTM, convertedXUTM, '30', 'N');

  return [lat, lng];
};

// calculate rotation angle
function getAngle(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1);
}

// radian to degree
export function radToDeg(rad: number) {
  return rad * (180 / Math.PI);
}

//rgb to hex
export function rgbToHex(colorArr?: number[]) {
  const [r, g, b] = colorArr!;
  if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
  return `#${((r << 16) | (g << 8) | b).toString(16)}`;
}

export function rgbToArray(color: string) {
  const rgb = color.replace(/^rgb\(|\s+|\)$/g, '').split(',');
  return rgb.map((num) => Number(num));
}

export const getClusterColor = (cluster: number) => {
  if (cluster === 0) {
    return [228, 26, 28];
  } else if (cluster === 1) {
    return [55, 126, 184];
  } else if (cluster === 2) {
    return [77, 175, 74];
  } else if (cluster === 3) {
    return [152, 78, 163];
  } else if (cluster === 4) {
    return [255, 127, 0];
  } else if (cluster === 5) {
    return [255, 255, 51];
  } else if (cluster === 6) {
    return [166, 86, 40];
  } else if (cluster === 7) {
    return [247, 129, 191];
  } else {
    return [128, 128, 128];
  }
};

export const getWeightedColor = (weight: number) => {
  const hue = ((weight - 1) * 120).toString(10);
  return ['hsl(', hue, ',100%,50%)'].join('');
};
