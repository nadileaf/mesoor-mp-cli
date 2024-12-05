import { mapService } from '@/services/map';
import { defineStore } from 'pinia';

type Addr = {
  city?: string;
  district?: string;
  province?: string;
};
interface State {
  version?: string;
  location?: {
    longitude: number;
    latitude: number;
    addr?: Addr;
  };
  needEnableLocation?: boolean;
  /** 小程序导航栏高度 */
  miniAppNavHeight: number;
  /** 小程序右上角胶囊按钮尺寸 */
  menuButtonInfo: UniApp.GetMenuButtonBoundingClientRectRes;
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    version: uni.getStorageSync('version'),
    location: undefined,
    needEnableLocation: false,
    miniAppNavHeight: 44,
    menuButtonInfo: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    }
  }),
  getters: {},
  actions: {
    async initLocation() {
      try {
        this.location = await uni.getLocation({
          type: 'gcj02'
        });
      } catch (error) {
        this.location = { longitude: 116.470314, latitude: 39.910742 };
      }

      console.log('this.location', this.location);
      this.location = await mapService.getLocation();
      const regeocode = await mapService.getRegeo(this.location);
      this.location.addr = regeocode.addressComponent as Addr;
    },
    initAppLayoutInfo() {
      this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    }
  }
});
