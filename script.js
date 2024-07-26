function initMap() {
    const mapContainer = document.getElementById('map-container');
    const map = new google.maps.Map(mapContainer, {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });
  
    const starIcon = {
      url: 'https://maps.google.com/mapfiles/kml/shapes/star.png', // スターアイコンのURL
      scaledSize: new google.maps.Size(32, 32) // アイコンのサイズ
    };
  
    let userPin = null;
    let answerPin = null;
    let userLocation = null;
  
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
  
      userLocation = { lat: latitude, lng: longitude };
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
      if (userPin) {
        userPin.setMap(null);
        userPin = null;
      }
      if (answerPin) {
        answerPin.setMap(null);
        answerPin = null;
      }
    });
  
    okButton.addEventListener('click', () => {
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
    });
  
    confirmPinButton.addEventListener('click', () => {
      if (userLocation && quizLocations[currentQuizNumber]) {
        const answerLocation = quizLocations[currentQuizNumber];
        calculateDistance(userLocation.lat, userLocation.lng, answerLocation.lat, answerLocation.lng);
        
        if (answerPin) {
          answerPin.setMap(null);
        }
        answerPin = new google.maps.Marker({
          position: { lat: answerLocation.lat, lng: answerLocation.lng },
          map: map,
          icon: starIcon
        });
      }
    });
  
    const totalDistanceElement = document.getElementById('total-distance');
    let totalDistance = 0;
  
    function calculateDistance(userLat, userLng, answerLat, answerLng) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLat, userLng),
        new google.maps.LatLng(answerLat, answerLng)
      );
  
      totalDistance += distance;
      totalDistanceElement.textContent = totalDistance.toFixed(2) + ' km';
    }
  }
  
  const quizLocations = {
    1: { lat: 37.7749, lng: -122.4194 }, // サンフランシスコ
    2: { lat: 34.0522, lng: -118.2437 }, // ロサンゼルス
    3: { lat: 40.7128, lng: -74.0060 }, // ニューヨーク
    // 他のクイズ番号と地点を追加
  };
  
  google.maps.event.addDomListener(window, 'load', initMap);
  