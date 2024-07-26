function initMap() {
    const mapContainer = document.getElementById('map-container');
    const map = new google.maps.Map(mapContainer, {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });
  
    let userPin = null;
  
    google.maps.event.addListener(map, 'click', (event) => {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
  
      if (userPin) {
        userPin.setMap(null);
      }
      userPin = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map
      });
  
      calculateDistance(latitude, longitude);
    });
  
    const quizInput = document.getElementById('quiz-input');
    const resetButton = document.getElementById('reset-button');
    const okButton = document.getElementById('ok-button');
    const confirmPinButton = document.getElementById('confirm-pin-button');
    let currentQuizNumber = null;
  
    resetButton.addEventListener('click', () => {
      quizInput.value = '';
      currentQuizNumber = null;
      totalDistance = 0;
      document.getElementById('total-distance').textContent = totalDistance.toFixed(2) + ' km';
      okButton.classList.add('active');
      okButton.classList.remove('inactive');
      okButton.disabled = false;
      confirmPinButton.classList.add('inactive');
      confirmPinButton.classList.remove('active');
      confirmPinButton.disabled = true;
    });
  
    okButton.addEventListener('click', () => {
      currentQuizNumber = quizInput.value;
      okButton.classList.add('inactive');
      okButton.classList.remove('active');
      okButton.disabled = true;
      confirmPinButton.classList.add('active');
      confirmPinButton.classList.remove('inactive');
      confirmPinButton.disabled = false;
    });
  
    confirmPinButton.addEventListener('click', () => {
      if (userPin) {
        // ピンが確定された時の処理をここに追加
        alert('Pin confirmed!');
      }
    });
  
    const totalDistanceElement = document.getElementById('total-distance');
    let totalDistance = 0;
  
    function calculateDistance(userLat, userLng) {
      const answerLatitude = 37.7749;
      const answerLongitude = -122.4194;
  
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLat, userLng),
        new google.maps.LatLng(answerLatitude, answerLongitude)
      );
  
      totalDistance += distance;
      totalDistanceElement.textContent = totalDistance.toFixed(2) + ' km';
    }
  }
  
  google.maps.event.addDomListener(window, 'load', initMap);
  