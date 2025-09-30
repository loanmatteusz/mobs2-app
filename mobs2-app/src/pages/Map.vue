<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue"
  import Card from "@/components/ui/card/Card.vue";
  import CardContent from "@/components/ui/card/CardContent.vue";
  import CardHeader from "@/components/ui/card/CardHeader.vue";
  import CardTitle from "@/components/ui/card/CardTitle.vue";
  import { telemetryService } from "@/services/telemetry.service";
  import { Telemetry } from "@/types/telemetry";

  const mapRef = ref<HTMLDivElement | null>(null)
  const mapError = ref(false);
  const vehicleMarkers = ref<Record<string, google.maps.Marker>>({});
  
  let map: google.maps.Map;
  let interval: number;

  const vehicleTelemetry = ref<Telemetry | null>(null);
  const vehicles = ref<Telemetry[]>([]);

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

  function upsertMarkers(telemetries: Telemetry[]) {
    telemetries.forEach((telemetry) => {

      const position = { lat: Number(telemetry.latitude), lng: Number(telemetry.longitude) };
      let marker = vehicleMarkers.value[telemetry.vehicleId];

      const content = `
        <div style="font-size:14px; color:black;">
          <strong>Veículo:</strong> ${telemetry.vehiclePlate || '-'}<br/>
          <strong>Velocidade:</strong> ${telemetry.speed ?? '-'} km/h<br/>
          <strong>Combustível:</strong> ${telemetry.fuel ?? '-'}%<br/>
          <strong>Última atualização:</strong> ${telemetry.timestamp ? new Date(telemetry.timestamp).toLocaleString("pt-BR") : '-'}
        </div>
      `;

      if (marker) {
        marker.setPosition(position);
        (marker as any).infoWindow.setContent(content);
      } else {
        marker = new google.maps.Marker({
          position,
          map,
          title: `Veículo ${telemetry.vehiclePlate}`,
        });

        const infoWindow = new google.maps.InfoWindow({ content });

        marker.addListener("mouseover", () => {
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });

        marker.addListener("mouseout", () => {
          infoWindow.close();
        });

        (marker as any).infoWindow = infoWindow;

        vehicleMarkers.value[telemetry.vehicleId] = marker;
      }
    });
  }

  async function updateVehiclePosition() {
    const response = await telemetryService.lastestVehicleTelemetry({ limit: 10 });
    vehicleTelemetry.value = response.data[0];
    vehicles.value = response.data;
    upsertMarkers(vehicles.value);
  }


  onMounted(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        mapError.value = true
        console.error("Erro ao carregar Google Maps API")
      }
      document.head.appendChild(script);
    } else {
      initMap();
    }

    async function initMap() {
      try {
        const response = await telemetryService.lastestVehicleTelemetry({ limit: 10 });
        vehicleTelemetry.value = response.data[0];
        vehicles.value = response.data;

        map = new google.maps.Map(mapRef.value!, {
          center: { lat: -18.905528, lng: -48.276083 },
          zoom: 14,
          // styles: [
          //   {
          //     elementType: "geometry",
          //     stylers: [{ color: "#242f3e" }]
          //   },
          //   {
          //     elementType: "labels.text.stroke",
          //     stylers: [{ color: "#242f3e" }]
          //   },
          //   {
          //     elementType: "labels.text.fill",
          //     stylers: [{ color: "#746855" }]
          //   },
          //   {
          //     featureType: "road",
          //     elementType: "geometry",
          //     stylers: [{ color: "#38414e" }]
          //   },
          //   {
          //     featureType: "water",
          //     elementType: "geometry",
          //     stylers: [{ color: "#17263c" }]
          //   }
          // ],
        });
  
        upsertMarkers(vehicles.value);
  
        interval = setInterval(updateVehiclePosition, 5000);
      } catch (err) {
        mapError.value = true;
      }
    }
  });

  onUnmounted(() => {
    clearInterval(interval);
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
