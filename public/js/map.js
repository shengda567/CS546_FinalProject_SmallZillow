
  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 17,
      center: { lat: -34.397, lng: 150.644 },
    });
    const geocoder = new google.maps.Geocoder();
    document.getElementById("showMapBtm").addEventListener("click", () => {
      $('#map').show();
      geocodeAddress(geocoder, map);
    });
  }

  function geocodeAddress(geocoder, resultsMap) {
    const address = $('#singlePost_address').val();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
