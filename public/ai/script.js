const snowContainer = document.querySelector('.snow-container');

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  
  const size = Math.random() * 10 + 5; // Snowflake size between 5px and 15px
  const position = Math.random() * 100; // Random horizontal position
  const duration = Math.random() * 5 + 3; // Fall duration between 3s and 8s
  
  snowflake.style.width = `${size}px`;
  snowflake.style.height = `${size}px`;
  snowflake.style.left = `${position}vw`;
  snowflake.style.animationDuration = `${duration}s`;
  
  snowContainer.appendChild(snowflake);

  // Remove snowflake after animation to prevent memory leak
  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}

// Create snowflakes continuously
setInterval(createSnowflake, 200);
