<template>
  <div id="app">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
  // eslint-disable-next-line no-undef
  const mapboxgl = require('mapbox-gl')
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { WindLayer, ScalarFill } from '@sakitam-gis/mapbox-wind'
  import axios from 'axios'
  const china = require('./data/china.json')
  // import * as turf from '@turf/turf'

  export default {
    name: 'App',
    data() {
      return {}
    },
    created() {},
    mounted() {
      mapboxgl.accessToken =
        'pk.eyJ1Ijoiam9hbm9vciIsImEiOiJja2toa2Y2cTQxMHpvMm5wZWZ1aGp6ZzQ2In0.5DNXy7ne3w_OLc-w6djbVA'
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/joanoor/ckkhkotu41c4g17nzfu5gr3sa',
        center: [117.226021, 31.834259], // 合肥洪岗
        zoom: 4, // starting zoom 地图初始的拉伸比例
      })

      const color = {
        temp: [
          [203, [115, 70, 105, 255]],
          [218, [202, 172, 195, 255]],
          [233, [162, 70, 145, 255]],
          [248, [143, 89, 169, 255]],
          [258, [157, 219, 217, 255]],
          [265, [106, 191, 181, 255]],
          [269, [100, 166, 189, 255]],
          [273.15, [93, 133, 198, 255]],
          [274, [68, 125, 99, 255]],
          [283, [128, 147, 24, 255]],
          [294, [243, 183, 4, 255]],
          [303, [232, 83, 25, 255]],
          [320, [71, 14, 0, 255]],
        ],
        wind: [
          [0, [98, 113, 183, 255]],
          [1, [57, 97, 159, 255]],
          [3, [74, 148, 169, 255]],
          [5, [77, 141, 123, 255]],
          [7, [83, 165, 83, 255]],
          [9, [53, 159, 53, 255]],
          [11, [167, 157, 81, 255]],
          [13, [159, 127, 58, 255]],
          [15, [161, 108, 92, 255]],
          [17, [129, 58, 78, 255]],
          [19, [175, 80, 136, 255]],
          [21, [117, 74, 147, 255]],
          [24, [109, 97, 163, 255]],
          [27, [68, 105, 141, 255]],
          [29, [92, 144, 152, 255]],
          [36, [125, 68, 165, 255]],
          [46, [231, 215, 215, 255]],
          [51, [219, 212, 135, 255]],
          [77, [205, 202, 112, 255]],
          [104, [128, 128, 128, 255]],
        ],
      }

      map.on('load', function() {
        axios
          .get('https://sakitam-fdd.github.io/wind-layer/data/wind.json')
          .then(res => {
            let data = res.data.map((item, idx) => {
              item.header = Object.assign(item.header, {
                parameterCategory: 1,
                parameterNumber: idx === 0 ? 2 : 3,
              })
              return item
            })

            const windInterpolateColor = color.wind.reduce(
              (result, item, key) =>
                result.concat(item[0], 'rgba(' + item[1].join(',') + ')'),
              []
            )
            const tempInterpolateColor = color.temp.reduce(
              (result, item, key) =>
                result.concat(
                  item[0] - 273.15,
                  'rgba(' + item[1].join(',') + ')'
                ),
              []
            )

            const fillLayer = new ScalarFill(
              'wind',
              {
                // "type": "jsonArray",
                // "data": data,
                type: 'image',
                url: './data/var_tmp.png',
                // 'extent': [
                //   [data[0]['header'].lo1, data[0]['header'].la1],
                //   [data[0]['header'].lo1, data[0]['header'].la2],
                //   [data[0]['header'].lo2, data[0]['header'].la1],
                //   [data[0]['header'].lo2, data[0]['header'].la2],
                // ],
                extent: [
                  [-180, 85.051129],
                  [-180, -85.051129],
                  [180, 85.051129],
                  [180, -85.051129],
                ],
                width: 1440,
                height: 720,
                // "width": data[0]['header']['nx'],
                // "height": data[0]['header']['ny'] - 1,
                min: -50.84996643066404,
                max: 42.25002441406252,
                // "uMin": data[0]['header']['min'],
                // "uMax": data[0]['header']['max'],
                // "vMin": data[1]['header']['min'],
                // "vMax": data[1]['header']['max'],
                uMin: -21.34380340576172,
                uMax: 30.7261962890625,
                vMin: -23.916271209716797,
                vMax: 24.693727493286133,
              },
              {
                styleSpec: {
                  'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'value'],
                    ...tempInterpolateColor,
                  ],
                  opacity: [
                    'interpolate',
                    ['exponential', 0.5],
                    ['zoom'],
                    5,
                    1,
                    8,
                    1,
                  ],
                },
                renderForm: 'r',
              }
            )
            console.log(map, fillLayer)
            map.addLayer(fillLayer)

            window.windLayer = new WindLayer('wind', data, {
              windOptions: {
                // colorScale: (m) => {
                //   // console.log(m);
                //   return '#fff';
                // },
                // colorScale: [
                //   "rgb(36,104, 180)",
                //   "rgb(60,157, 194)",
                //   "rgb(128,205,193 )",
                //   "rgb(151,218,168 )",
                //   "rgb(198,231,181)",
                //   "rgb(238,247,217)",
                //   "rgb(255,238,159)",
                //   "rgb(252,217,125)",
                //   "rgb(255,182,100)",
                //   "rgb(252,150,75)",
                //   "rgb(250,112,52)",
                //   "rgb(245,64,32)",
                //   "rgb(237,45,28)",
                //   "rgb(220,24,32)",
                //   "rgb(180,0,35)"
                // ],
                // velocityScale: 1 / 20,
                // paths: 5000,
                frameRate: 16,
                maxAge: 60,
                globalAlpha: 0.9,
                velocityScale: 0.01,
                // paths: 10000,
                paths: 3782,
              },
            })

            // map.addLayer(window.windLayer);
            window.windLayer.addTo(map)

            map.addSource
          })
        // axios
        //   .get('https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json')
        //   .then(res => {
        //     console.log(res)
        map
          .addSource('chinadata', {
            type: 'geojson',
            data: china,
          })
          .addLayer({
            id: 'administration',
            source: 'chinadata',
            type: 'line',
          })
      })
      // })
      map.on('click', e => {
        console.log(e)
      })
      map.on('mousemove', 'administration', e => {
        console.log('mouse', e)
      })
    },
    methods: {
      // initMap() {
      //   mapboxgl.accessToken =
      //     'pk.eyJ1Ijoiam9hbm9vciIsImEiOiJja2toa2Y2cTQxMHpvMm5wZWZ1aGp6ZzQ2In0.5DNXy7ne3w_OLc-w6djbVA'
      //   this.map = new mapboxgl.Map({
      //     container: 'map',
      //     style: 'mapbox://styles/joanoor/ckkhkotu41c4g17nzfu5gr3sa',
      //     center: [117.226021, 31.834259], // 合肥洪岗
      //     zoom: 14, // starting zoom 地图初始的拉伸比例
      //   })
      //   this.map.on('load', () => {
      //     // eslint-disable-next-line no-undef
      //     const data = require('./data/wind.json')
      //     // const windInterpolateColor = color.wind.reduce((result, item) => result.concat(item[0], 'rgba(' + item[1].join(',') + ')'), []);
      //     window.windLayer = new WindLayer('wind', data, {
      //       windOptions: {
      //         frameRate: 16,
      //         maxAge: 60,
      //         globalAlpha: 0.9,
      //         velocityScale: 0.01,
      //         paths: 3782,
      //       },
      //     })
      //     window.windLayer.addTo(this.map)
      //   })
      // },
    },
  }
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
    .map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background: #202020;
    }
  }
  .mapboxgl-control-container {
    display: none;
  }
</style>
