<script setup lang="ts">
  import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import { telemetryService } from "@/services/telemetry.service";
  import { Telemetry } from "@/types/telemetry";
  import { ref, onMounted, watch } from "vue"

  const mapRef = ref<HTMLDivElement | null>(null)
  const mapError = ref(false);
  let map: google.maps.Map;
  let vehicleMarker: google.maps.Marker;

  const vehicleId = 1;

  const vehicleTelemetry = ref<Telemetry>();

  function formatTimestamp(ts: string) {
    const date = new Date(ts)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  async function updateVehiclePosition() {
    const res = await telemetryService.getLastByVehicleId(vehicleId);
    const latest = res.data[0];
    vehicleTelemetry.value = latest;
    if (!latest) return;

    const pos = {
      lat: Number(latest.latitude),
      lng: Number(latest.longitude)
    };

    vehicleMarker.setPosition(pos);
    map.panTo(pos);
  }

  onMounted(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`
    script.async = true
    script.defer = true
    script.onload = initMap;
    script.onerror = () => {
      mapError.value = true
      console.error("Erro ao carregar Google Maps API")
    }
    document.head.appendChild(script);

    async function initMap() {
      const res = await telemetryService.getLastByVehicleId(vehicleId);
      vehicleTelemetry.value = res.data[0];
      map = new google.maps.Map(mapRef.value!, {
        center: { lat: -18.8910, lng: -48.2850 },
        zoom: 18,
      })

      vehicleMarker = new google.maps.Marker({
        position: { lat: -18.8910, lng: -48.2850 },
        map,
        title: `Veículo ${vehicleId}`,
      });

      setInterval(updateVehiclePosition, 1000);
    }
  });
</script>

<template>
    <div class="space-y-6">
    <h1 class="text-2xl font-bold">Map</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ vehicleTelemetry?.speed || 0 }} Km/h</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ vehicleTelemetry?.fuel || 0 }} %</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Telemetry</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ vehicleTelemetry?.timestamp ? formatTimestamp(vehicleTelemetry?.timestamp) : formatTimestamp(new Date().toDateString()) }}</div>
        </CardContent>
      </Card>
    </div>

    <div v-if="mapError" class="p-6 text-center text-red-500 border rounded-lg">
      Erro ao carregar o mapa. Verifique sua conexão ou a chave da API.
    </div>

    <div v-else ref="mapRef" class="map"></div>
  </div>
</template>

<style>
  .map {
    width: 100%;
    height: 70vh;
  }
</style>
