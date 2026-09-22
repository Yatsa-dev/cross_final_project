// Slippy-map maths: converts geographic coordinates into OpenStreetMap tile
// space. The formulas are the standard Web Mercator projection used by every
// raster tile server, so no mapping library is needed for a single pin.
export const TILE_SIZE = 256;

export const lonToTileX = (longitude, zoom) => ((longitude + 180) / 360) * 2 ** zoom;

export const latToTileY = (latitude, zoom) => {
  const radians = (latitude * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) * 2 ** zoom;
};

export const tileUrl = (x, y, zoom) => `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
