const apiKey = 'GOOGLE_MAPS_API_KEY'; // プレースホルダーとしてAPIキーを設定
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMap`;
script.async = true;
document.head.appendChild(script);

function initMap() {
    const mapContainer = document.getElementById('map-container');
    const map = new google.maps.Map(mapContainer, {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });

    const starIcon = {
      url: 'https://maps.google.com/mapfiles/kml/paddle/red-stars.png',
      scaledSize: new google.maps.Size(32, 32)
    };

    let userPin = null;
    let answerPin = null;
    let userLocation = null;

    google.maps.event.addListener(map, 'click', (event) => {
      placeUserPin(event.latLng);
    });

    const searchBox = new google.maps.places.SearchBox(document.getElementById('quiz-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('quiz-input'));

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;
      const place = places[0];
      if (!place.geometry) {
        alert("Returned place contains no geometry");
        return;
      }
      placeUserPin(place.geometry.location);
      map.setCenter(place.geometry.location);
      map.setZoom(14);
    });

    const quizInput = document.getElementById('quiz-input');
    const resetButton = document.getElementById('reset-button');
    const restartButton = document.getElementById('restart-button');
    const okButton = document.getElementById('ok-button');
    const confirmPinButton = document.getElementById('confirm-pin-button');
    const currentDistanceElement = document.getElementById('current-distance');
    const totalDistanceElement = document.getElementById('total-distance');
    let currentQuizNumber = null;
    let totalDistance = 0;

    resetButton.addEventListener('click', resetQuiz);
    restartButton.addEventListener('click', restartGame);
    okButton.addEventListener('click', confirmQuizNumber);
    confirmPinButton.addEventListener('click', confirmPinLocation);

    function placeUserPin(location) {
      if (userPin) userPin.setMap(null);
      userPin = new google.maps.Marker({
        position: location,
        map: map
      });
      userLocation = { lat: location.lat(), lng: location.lng() };
    }

    function resetQuiz() {
      quizInput.value = '';
      currentQuizNumber = null;
      currentDistanceElement.textContent = '0 km';
      okButton.classList.add('active');
      okButton.classList.remove('inactive');
      okButton.disabled = false;
      confirmPinButton.classList.add('inactive');
      confirmPinButton.classList.remove('active');
      confirmPinButton.disabled = true;
      if (userPin) userPin.setMap(null);
      if (answerPin) answerPin.setMap(null);
      userPin = null;
      answerPin = null;
    }

    function restartGame() {
      resetQuiz();
      totalDistance = 0;
      totalDistanceElement.textContent = '0 km';
    }

    function confirmQuizNumber() {
      currentQuizNumber = quizInput.value;
      if (quizLocations[currentQuizNumber]) {
        okButton.classList.add('inactive');
        okButton.classList.remove('active');
        okButton.disabled = true;
        confirmPinButton.classList.add('active');
        confirmPinButton.classList.remove('inactive');
        confirmPinButton.disabled = false;
      } else {
        alert('Invalid quiz number. Please enter a valid number.');
      }
    }

    function confirmPinLocation() {
      if (userLocation && quizLocations[currentQuizNumber]) {
        const answerLocation = quizLocations[currentQuizNumber];
        const distance = calculateDistance(userLocation, answerLocation);
        currentDistanceElement.textContent = distance.toFixed(2) + ' km';
        totalDistance += distance;
        totalDistanceElement.textContent = totalDistance.toFixed(2) + ' km';

        if (answerPin) answerPin.setMap(null);
        answerPin = new google.maps.Marker({
          position: answerLocation,
          map: map,
          icon: starIcon
        });
      }
    }

    function calculateDistance(location1, location2) {
      const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(location1.lat, location1.lng),
        new google.maps.LatLng(location2.lat, location2.lng)
      );
      return distanceInMeters / 1000;
    }
}

const quizLocations = {
  1: { lat: 37.7749, lng: -122.4194 }, // サンフランシスコ
  2: { lat: 34.0522, lng: -118.2437 }, // ロサンゼルス
  3: { lat: 40.7128, lng: -74.0060 }, // ニューヨーク
  4: { lat: -1.2923, lng: 36.82 },    // Nairobi
  5: { lat: 14.527, lng: -90.49 }     // Guatemala City
};

google.maps.event.addDomListener(window, 'load', initMap);
