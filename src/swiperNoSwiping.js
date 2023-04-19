// Add a listener for touch events on the document
document.addEventListener('touchstart', function(e) {
    // Only listen for two-finger touches
    if (!e.target.classList.contains('swiper-no-swiping')) {
      if (e.touches.length === 2) {
        // Get the initial touch coordinates
        let startX = e.touches[0].clientX;
        let startY = e.touches[0].clientY;
    
        // Add a listener for touchend events
        document.addEventListener('touchend', function(e) {
          // Get the final touch coordinates
          let endX = e.changedTouches[0].clientX;
          let endY = e.changedTouches[0].clientY;
    
          // Calculate the distance between the start and end touch coordinates
          let distanceX = endX - startX;
          let distanceY = endY - startY;
    
          // Determine if the gesture was a left or right swipe with two fingers
          if (Math.abs(distanceX) > 100 && Math.abs(distanceY) < 50) {
            if (distanceX > 0) {
              // Swipe to the right with two fingers
              history.back();
            } else {
              // Swipe to the left with two fingers
              history.forward();
            }
          }
        }, { once: true });
      }
    }
  });
  