# GeoFencing Library

A lightweight and easy-to-use geofencing library for monitoring user location relative to defined geographical areas. Perfect for location-based notifications, tracking, and triggers in web applications.

## Features

- 🌍 Create circular geofences with custom radius
- 📍 Monitor multiple geographical areas simultaneously
- 🎯 Custom callbacks for enter/exit events
- 📱 Built-in geolocation monitoring
- 🛡️ Error handling and validation
- 📦 Zero dependencies

## Installation

```bash
npm install geofencing-js
```

## Quick Start

```javascript
import GeoFencingManager from 'geofencing-js';

// Create a manager instance
const geoManager = new GeoFencingManager();

// Add a geofence
geoManager.addFence({
  id: 'store-123',
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 100,  // meters
  onEnter: (id) => console.log(`Entered zone ${id}`),
  onExit: (id) => console.log(`Left zone ${id}`)
});

// Start monitoring
geoManager.startLocationMonitoring();
```

## Usage

### Single Fence

```javascript
const fence = {
  id: 'store-123',
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 100,
  onEnter: (id) => console.log(`Entered ${id}`),
  onExit: (id) => console.log(`Left ${id}`)
};

geoManager.addFence(fence);
```

### Multiple Fences

```javascript
const locations = [
  {
    id: 'store-a',
    coords: [40.7128, -74.0060, 100]  // [latitude, longitude, radius]
  },
  {
    id: 'store-b',
    coords: [40.7580, -73.9855, 100]
  }
];

geoManager.monitorCoordinates(locations, (id) => {
  console.log(`Entered area: ${id}`);
});
```

## API Reference

### GeoFencingManager

#### Constructor
```javascript
const geoManager = new GeoFencingManager();
```

#### Methods

##### `addFence(config)`
Adds a new geofence to monitor.
- Parameters:
  - `config` (Object):
    - `id` (String): Unique identifier
    - `latitude` (Number): Fence center latitude
    - `longitude` (Number): Fence center longitude
    - `radius` (Number): Radius in meters
    - `onEnter` (Function): Callback when entering fence
    - `onExit` (Function): Callback when exiting fence

##### `monitorCoordinates(coordsList, onEnterCallback)`
Monitors multiple locations simultaneously.
- Parameters:
  - `coordsList` (Array): Array of location objects
  - `onEnterCallback` (Function): Global callback for all fence entries

##### `startLocationMonitoring()`
Starts monitoring user location.

##### `stopMonitoring()`
Stops location monitoring.

## Browser Support

The library uses the Geolocation API and requires browser support for:
- Geolocation API
- ES6 Classes
- Promises

## Error Handling

The library includes built-in error handling for:
- Geolocation API unavailability
- Invalid coordinates
- Missing required parameters
- Position tracking errors

## Example Use Cases

- Retail: Send notifications when customers are near stores
- Tourism: Trigger audio guides near points of interest
- Delivery: Track drivers in delivery zones
- Events: Monitor attendee locations at large venues

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.