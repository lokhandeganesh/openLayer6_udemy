window.onload = init

function init(){
  const options = {
    // Required: API key
    key: 'nOvfHgPrO3TUSt90zdE9pFKnC7Gt8kjL', // REPLACE WITH YOUR KEY !!!
  
    // Put additional console output
    verbose: false,
  
    // Optional: Initial state of the map
    lat: 80.024,
    lon: 21.596,
    zoom: 5,
  };
  
  // Initialize Windy API
  windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff
  
    const { map } = windyAPI;
    // .map is instance of Leaflet map
  
    L.popup()
      .setLatLng([21.596, 80.024])
      .setContent('Hello World')
      .openOn(map);
  });
}

Highcharts.chart('container', {
  chart: {
      zoomType: 'xy'
  },
  title: {
      text: 'Weather Forecast of {DistrictName}',
      align: 'left'
  },
  subtitle: {
      text: 'For Date:{start_date} to {end_date} ',
      align: 'left'
  },
  xAxis: [{
      categories: ['11Oct2023', '12Oct2023', '13Oct2023', '14Oct2023', '15Oct2023'],
      crosshair: true
  }],
  yAxis: [{ // Primary yAxis
      labels: {
          format: '{value}°C',
          style: {
              color: Highcharts.getOptions().colors[1]
          }
      },
      title: {
          text: 'Temperature',
          style: {
              color: Highcharts.getOptions().colors[1]
          }
      },
      opposite: true

  }, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
          text: 'Rainfall',
          style: {
              color: Highcharts.getOptions().colors[0]
          }
      },
      labels: {
          format: '{value} mm',
          style: {
              color: Highcharts.getOptions().colors[0]
          }
      }

  }
],
  tooltip: {
      shared: true
  },
  legend: {
      layout: 'vertical',
      align: 'left',
      x: 80,
      verticalAlign: 'top',
      y: 55,
      floating: true,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || // theme
          'rgba(255,255,255,0.25)'
  },
  series: [{
      name: 'Rainfall',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0],
      tooltip: {
          valueSuffix: ' mm'
      }

  }, {
      name: 'Max. Temperature',
      type: 'spline',
      data: [17.5, 16.9, 19.5, 25.5, 28.2],
      color: Highcharts.getOptions().colors[3],
      tooltip: {
          valueSuffix: ' °C'
      }
  },
  {
    name: 'Min. Temperature',
    type: 'spline',
    data: [7.0, 6.9, 9.5, 14.5, 18.2],
    color: Highcharts.getOptions().colors[1],
    marker: {
        enabled: false
    },
    dashStyle: 'longdashdot',
    tooltip: {
        valueSuffix: '°C'
    }
  }],
  responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  floating: false,
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                  x: 0,
                  y: 0
              },
              yAxis: [{
                  labels: {
                      align: 'right',
                      x: 0,
                      y: -6
                  },
                  showLastLabel: false
              }, {
                  labels: {
                      align: 'left',
                      x: 0,
                      y: -6
                  },
                  showLastLabel: false
              }, {
                  visible: false
              }]
          }
      }]
  }
});
