import { request } from '.';
import { isArray } from 'lodash-es';
const MAP_REQUEST_URL = 'https://restapi.amap.com/v3';
const MAP_KEY = import.meta.env.VITE_AMAP_KEY;

export const mapService = {
  async getLocation() {
    try {
      return uni.getLocation({
        type: 'gcj02'
      });
    } catch (error) {
      // 默认返回北京CBD万达广场
      return { longitude: 116.470314, latitude: 39.910742 };
    }
  },
  /** 地理编码 https://lbs.amap.com/api/webservice/guide/api/georegeo#geo */
  async getGeo(params: { city?: string }) {
    const { geocodes } = await request.get<{
      geocodes: {
        location: string;
      }[];
    }>(
      `${MAP_REQUEST_URL}/geocode/geo`,
      {
        city: params.city,
        address: params.city,
        key: MAP_KEY,
        output: 'json'
      },
      { handleResponseData: false }
    );

    return geocodes[0].location;
  },

  // 逆地理编码
  async getRegeo(params: { longitude: number; latitude: number; poitype?: string }) {
    const { regeocode } = await request.get<{
      regeocode: {
        formatted_address: string;
        addressComponent: {
          city: string | string[];
          district: string;
          province: string;
        };
      };
    }>(
      `${MAP_REQUEST_URL}/geocode/regeo`,
      {
        location: `${params.longitude},${params.latitude}`,
        key: MAP_KEY,
        extensions: 'base',
        poitype: params.poitype,
        radius: 1000,
        output: 'json'
      },
      { handleResponseData: false }
    );

    if (isArray(regeocode.addressComponent.city)) {
      regeocode.addressComponent.city = regeocode.addressComponent.province;
    }

    return regeocode;
  }
};
