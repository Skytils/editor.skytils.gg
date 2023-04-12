import { decToHex, hexToDec } from 'hex2dec';
import { gunzip } from 'zlib';

import type { ApiResponseCategory, WaypointCategory } from '@/types';

const hexToDecimal = (hex: string) => hexToDec(hex.replaceAll('#', '')) || 0;
const decimalToHex = (decimal?: number) => {
  if (!decimal) return '#ff0000';
  return `#${decToHex(decimal.toString(), { prefix: false })}`;
};

const convertWaypointOptionsToHex = (
  response: ApiResponseCategory[],
): WaypointCategory[] => {
  return response.map((category) => {
    return {
      ...category,
      waypoints: category.waypoints.map((waypoint) => {
        return {
          ...waypoint,
          color: decimalToHex(waypoint.color),
        };
      }),
    };
  });
};

const convertWaypointOptionsToDecimal = (
  data: WaypointCategory[],
): ApiResponseCategory[] => {
  return data.map((category) => {
    return {
      ...category,
      waypoints: category.waypoints.map((waypoint) => {
        return {
          ...waypoint,
          color: parseInt(hexToDecimal(waypoint.color) || '0'),
        };
      }),
    };
  });
};

const decompress = (data: string) => {
  if (data.startsWith(`<Skytils-Waypoint-Data>(V`)) {
    const version = parseInt(
      data.split(`<Skytils-Waypoint-Data>(V`)[1].split(')')[0],
    );
    const content = data.split(`:`)[1];
    if (version !== 1) throw new Error(`Invalid version: ${version}!`);
    let decompressed;
    gunzip(Buffer.from(content, 'base64'), (err, uncompressed) => {
      if (err) throw err;
      decompressed = JSON.parse(uncompressed.toString());
      console.log(decompressed);
    });
    return decompressed;
  }
};

export {
  convertWaypointOptionsToDecimal,
  convertWaypointOptionsToHex,
  decimalToHex,
  hexToDecimal,
};
