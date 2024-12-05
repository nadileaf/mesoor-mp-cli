<script lang="ts">
export default { name: 'StaticMap', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';

type Props = {
  longitude: number;
  latitude: number;
  width?: number;
  height?: number;
  zoom?: number;
  city?: string;
  address?: string;
};
const props = defineProps<Props>();

const router = useRouter();

const mapUrl = computed(
  () =>
    `https://restapi.amap.com/v3/staticmap?key=${import.meta.env.VITE_AMAP_KEY}&location=${props.longitude},${props.latitude}&zoom=${
      props.zoom || 14
    }&size=${props.width || 375}*${
      props.height || 211
    }&scale=2&markers=-1,https://cdn-fe.mesoor.com/custom/wanda/assets/map-poi-marker.png,0:${props.longitude},${props.latitude}`
);

function openMap() {
  router.push('/packages/common/map', {
    query: {
      longitude: props.longitude.toString(),
      latitude: props.latitude.toString(),
      city: props.city,
      address: props.address
    }
  });
}
</script>

<template>
  <image
    class="rounded-xl"
    :src="mapUrl"
    mode="widthFix"
    :style="{
      width: props.width || '100vw',
      height: props.height || 'calc(100vw / 21 * 9)'
    }"
    @click="openMap"
  />
</template>

<style lang="scss" scoped></style>
