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
      0.0000085 +
    bottomRightX;
  const convertedY =
    (-pixelX * Math.sin(rotationinRadians) + pixelY * Math.cos(rotationinRadians)) *
      -0.00001 +
    bottomRightY;
  return [convertedX, convertedY];
};

// calculate rotation angle
function getAngle(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1);
}
