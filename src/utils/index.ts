//@ts-ignore
import * as UTM from 'utm-latlng';

import { stadiums } from '../const/stadiumCoords';

export const getGeoCoords = (pixelX: number, pixelY: number, stadiumId: number) => {
  const homeStadium = stadiums.find((stadium) => stadium.id === stadiumId);
  const { bottomLeft, bottomRight } = homeStadium!.coords;

  const [bottomRightX, bottomRightY] = bottomRight;
  const [bottomLeftX, bottomLeftY] = bottomLeft;

  const rotationinRadians = getAngle(
    bottomLeftX,
    bottomLeftY,
    bottomRightX,
    bottomRightY,
  );
  const convertedX =
    (pixelX * Math.cos(rotationinRadians) + pixelY * Math.sin(rotationinRadians)) *
      -0.000009 +
    bottomRightX;
  const convertedY =
    (pixelX * -Math.sin(rotationinRadians) + pixelY * Math.cos(rotationinRadians)) *
      0.000014 +
    bottomRightY;

  return [convertedX, convertedY];
};

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
