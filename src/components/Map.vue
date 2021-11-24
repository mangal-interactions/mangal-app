<template>
  <div id="mangalMap"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import _ from "lodash";
import { mapGetters } from "vuex";
import Popup from "./Popup";
import Vue from "vue";
import store from "../store";

export default {
  components: {
    Popup
  },
  methods: {
    updateNetworks(networks) {
      this.$store.dispatch("setNet", networks[0].id);
      this.$store.dispatch("setNetCollection", networks);
    },
    setNet(id) {
      this.$store.dispatch("setNet", id);
    },
    getNetworksAtLocation(group) {
      return this.getMapCollection[group];
    }
  },
  data() {
    return {
      networksAtLocation: null
    };
  },
  computed: {
    ...mapGetters(["getNetCollection", "getMapCollection"])
  },
  mounted() {
    let vm = this;

    // Init map
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic3RldmV2aXNzIiwiYSI6ImNpaG53N2RsczBwOTZ0dGx6c3JqdXBoYzMifQ.w3eEV_jVfAo7d46D1i55BA";
    // eslint-disable-next-line
    let map = new mapboxgl.Map({
      container: "mangalMap", // container id
      style: "mapbox://styles/steveviss/cjxnk6wv62tkm1doc2f3lopv0", // stylesheet location
      zoom: 1 // starting zoom
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-left");

    this.$store
      .dispatch("loadNetworks")
      .then(() => {
        this.$store.dispatch("loadNetworksCollection").then(mapCollection => {
          // Add a layer showing the places.
          let features = _.values(mapCollection).map(netGroup => {
            return {
              type: "Feature",
              properties: {
                group: netGroup[0].group
              },
              geometry: {
                type: netGroup[0].geom.type,
                coordinates: netGroup[0].geom.coordinates
              }
            };
          });

          map.on("load", function() {
            map.addSource("netLocations", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features
              },
              generateId: true
            });
            map.addLayer({
              id: "netPolys",
              type: "fill",
              source: "netLocations",
              paint: {
                "fill-color": [
                  "case",
                  ["boolean", ["feature-state", "select"], false],
                  "#ce0058",
                  "#004e6b"
                ],
                "fill-opacity": [
                  "case",
                  ["boolean", ["feature-state", "select"], false],
                  1,
                  0.7
                ]
              },
              filter: ["==", "$type", "Polygon"]
            });
            map.addLayer({
              id: "netPolyBorder",
              type: "line",
              source: "netLocations",
              paint: {
                "line-color": "rgb(255, 255, 255)",
                "line-width": 1
              },
              filter: ["==", "$type", "Polygon"]
            });
            map.addLayer({
              id: "netPoints",
              type: "circle",
              source: "netLocations",
              paint: {
                "circle-opacity": [
                  "case",
                  ["boolean", ["feature-state", "select"], false],
                  1,
                  0.7
                ],
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
                "circle-color": [
                  "case",
                  ["boolean", ["feature-state", "select"], false],
                  "#ce0058",
                  "#004e6b"
                ]
              },
              filter: ["==", "$type", "Point"]
            });
          });
        });
      })
      .then(() => {
        this.$store.dispatch("openStatePane", true);
        // Init popup
        vm.networksAtLocation = vm.getNetworksAtLocation(
          vm.getNetCollection[0].group
        );

        let popup = new Vue({
          ...Popup,
          store: store,
          propsData: {
            networksData: vm.networksAtLocation
          }
        }).$mount();

        popup.$on("updateNet", id => {
          vm.setNet(id);
        });

        // Init select store
        let hoveredStateId;

        let ePoint = vm.getNetCollection[0].geom.coordinates;

        new mapboxgl.Popup()
          .setLngLat(ePoint)
          .setDOMContent(popup.$el)
          .addTo(map);

        // set event
        map.on("click", function(e) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["netPoints", "netPolys"]
          });

          if (features.length > 0) {
            ePoint = e.lngLat;
            if (hoveredStateId) {
              map.setFeatureState(
                { source: "netLocations", id: hoveredStateId },
                { select: false }
              );
            }
            hoveredStateId = features[0].id;
            map.setFeatureState(
              { source: "netLocations", id: hoveredStateId },
              { select: true }
            );

            vm.networksAtLocation = vm.getNetworksAtLocation(
              features[0].properties.group
            );

            vm.updateNetworks(vm.networksAtLocation);
          }

          popup = new Vue({
            ...Popup,
            store: store,
            propsData: {
              networksData: vm.networksAtLocation
            }
          }).$mount();

          popup.$on("updateNet", id => {
            vm.setNet(id);
          });

          // Populate the popup and set its coordinates
          // based on the feature found.
          // eslint-disable-next-line
          if (features.length > 0 && features[0].geometry.type == "Point") {
            ePoint = features[0].geometry.coordinates;
            new mapboxgl.Popup()
              .setLngLat(ePoint)
              .setDOMContent(popup.$el)
              .addTo(map);
          } else {
            new mapboxgl.Popup()
              .setLngLat(ePoint)
              .setDOMContent(popup.$el)
              .addTo(map);
          }
        });

        map.on("mousemove", function(e) {
          // get the network feature underneath the mouse
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["netPoints", "netPolys"]
          });
          // if there's a point under our mouse, then do the following.
          if (features.length > 0) {
            map.getCanvas().style.cursor =
              features[0].properties.Name !== null ? "pointer" : "";
          } else {
            map.getCanvas().style.cursor = "";
          }
        });
      });
  }
};
</script>

<style>
#mangalMap {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.mapboxgl-popup-content {
  max-height: 200px;
  overflow-y: auto;
}
</style>
