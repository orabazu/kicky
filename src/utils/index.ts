export const getRotatedCoords = (passNetworkData: any) => {
  const rotationinRadians = 89 * (Math.PI / 180);
  // const X = x * Math.cos(0.5) +  y * Math.sin(0.5);
  // const Y = -x * Math.sin(0.5) + y * Math.cos(0.5);
  const rotatedPassdata = passNetworkData.map((d) => ({
    ...d,
    startX:
      (d.startX * Math.cos(rotationinRadians) + d.startY * Math.sin(rotationinRadians)) *
        0.0000085 +
      51.5556764,
    startY:
      (-d.startX * Math.sin(rotationinRadians) + d.startY * Math.cos(rotationinRadians)) *
        -0.00001 -
      0.2803755,
    endX:
      (d.endX * Math.cos(rotationinRadians) + d.endY * Math.sin(rotationinRadians)) *
        0.0000085 +
      51.5556764,
    endY:
      (-d.endX * Math.sin(rotationinRadians) + d.endY * Math.cos(rotationinRadians)) *
        -0.00001 -
      0.2803755,
  }));
  console.log(rotatedPassdata);
};

// // converts image coordinates to lat long
// export const getLatLong = (x: number, y: number) => {
//   const rotationinRadians = 89 * (Math.PI / 180);
//   const lat = (x * Math.cos(rotationinRadians) + y * Math.sin(rotationinRadians)) * 0.0000085 + 51.5556764;
//   const long = (-x * Math.sin(rotationinRadians) + y * Math.cos(rotationinRadians)) * -0.00001 - 0.2803755;
//   return { lat, long };
// }
