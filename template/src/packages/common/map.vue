<script lang="ts" setup>
import { mapService } from '@/services/map';
type Props = {
  longitude?: number;
  latitude?: number;
  city?: string;
  address?: string;
};

const props = defineProps<Props>();

type MapMarker = {
  id: number;
  longitude: number;
  latitude: number;
  iconPath: string;
  width?: number;
  height?: number;
};

const longitude = ref(props.longitude ? Number(props.longitude) : undefined);
const latitude = ref(props.latitude ? Number(props.latitude) : undefined);
const markers = ref<MapMarker[]>([]);

const address = ref(`${decodeURIComponent(props.city ?? '')}${decodeURIComponent(props.address ?? '')}`);

onMounted(() => initMap());

async function initMap() {
  await initLocation();
  await initMarker();
  await initAddress();
}

async function initLocation() {
  if (!longitude.value || !latitude.value) {
    const loc = await uni.getLocation({
      type: 'gcj02'
    });
    longitude.value = loc.longitude;
    latitude.value = loc.latitude;
  }
}

async function initMarker() {
  markers.value = [
    {
      id: 1,
      longitude: longitude.value ?? 0,
      latitude: latitude.value ?? 0,
      iconPath: 'https://cdn-fe.mesoor.com/custom/wanda/assets/map-poi-marker.png'
    }
  ];
}
async function initAddress() {
  if (!address.value) {
    const res = await mapService.getRegeo({
      longitude: longitude.value ?? 0,
      latitude: latitude.value ?? 0,
      poitype: '商场'
    });
    address.value = res.formatted_address;
  }
  uni.setNavigationBarTitle({
    title: address.value ?? ''
  });
}

function handleOpenLocation() {
  uni.openLocation({
    longitude: longitude.value ?? 0,
    latitude: latitude.value ?? 0,
    address: address.value ?? ''
  });
}
</script>

<template>
  <view class="w-full h-100vh">
    <map class="w-full h-100vh" :longitude="longitude" :latitude="latitude" :scale="14" show-location :markers="markers"></map>
    <view class="map-bottom">
      <view class="flex-1 truncate">{{ address }}</view>
      <image
        class="ml-20px w-30px h-30px"
        src="https://cdn-fe.mesoor.com/custom/wanda/assets/map-navigation.png"
        mode="aspectFit"
        @click="handleOpenLocation"
      ></image>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.map-bottom {
  @apply fixed bottom-0 left-0 z-10 w-full flex items-center justify-between bg-white py-15px px-20px;
}
</style>
