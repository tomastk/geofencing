/**
 * Constants for geolocation calculations and configurations
 */
const GEOLOCATION_CONFIG = {
    EARTH_RADIUS_METERS: 6371e3,
    RADIAN_CONVERSION: Math.PI / 180,
    MONITORING: {
      ENABLE_HIGH_ACCURACY: true,
      MAXIMUM_AGE: 0,
      TIMEOUT: 5000
    }
  };
  
  /**
   * Represents a geographical coordinate with latitude and longitude
   */
  class Coordinate {
    constructor(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  
    toRadians() {
      return {
        latitude: this.convertDegreesToRadians(this.latitude),
        longitude: this.convertDegreesToRadians(this.longitude)
      };
    }
  
    convertDegreesToRadians(degrees) {
      return degrees * GEOLOCATION_CONFIG.RADIAN_CONVERSION;
    }
  }
  
  /**
   * Represents a circular geographical fence with enter/exit callbacks
   */
  class GeoFence {
    constructor(config) {
      this.validateConfig(config);
      
      this.id = config.id;
      this.center = new Coordinate(config.latitude, config.longitude);
      this.radius = config.radius;
      this.onEnter = config.onEnter;
      this.onExit = config.onExit;
      this.isUserInside = false;
    }
  
    validateConfig(config) {
      const requiredFields = ['id', 'latitude', 'longitude', 'radius'];
      requiredFields.forEach(field => {
        if (config[field] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      });
    }
  
    /**
     * Calculates the distance between two geographical points using the Haversine formula
     */
    calculateDistanceToPoint(coordinate) {
      const point1 = this.center.toRadians();
      const point2 = coordinate.toRadians();
  
      const latitudeDelta = point2.latitude - point1.latitude;
      const longitudeDelta = point2.longitude - point1.longitude;
  
      const haversine = this.calculateHaversineFormula(
        latitudeDelta,
        longitudeDelta,
        point1.latitude,
        point2.latitude
      );
  
      return this.convertHaversineToMeters(haversine);
    }
  
    calculateHaversineFormula(latitudeDelta, longitudeDelta, lat1, lat2) {
      const latitudeTerm = Math.sin(latitudeDelta / 2) ** 2;
      const longitudeTerm = Math.cos(lat1) * Math.cos(lat2) * (Math.sin(longitudeDelta / 2) ** 2);
      return latitudeTerm + longitudeTerm;
    }
  
    convertHaversineToMeters(haversine) {
      const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
      return GEOLOCATION_CONFIG.EARTH_RADIUS_METERS * centralAngle;
    }
  
    /**
     * Updates the fence state based on user's current position
     */
    updateState(currentPosition) {
      const distance = this.calculateDistanceToPoint(currentPosition);
      const isNowInside = distance <= this.radius;
  
      if (this.hasStateChanged(isNowInside)) {
        this.handleStateChange(isNowInside);
      }
    }
  
    hasStateChanged(isNowInside) {
      return isNowInside !== this.isUserInside;
    }
  
    handleStateChange(isNowInside) {
      this.isUserInside = isNowInside;
      const callback = isNowInside ? this.onEnter : this.onExit;
      
      if (typeof callback === 'function') {
        callback(this.id);
      }
    }
  }
  
  /**
   * Manages multiple geofences and handles geolocation monitoring
   */
  class GeoFencingManager {
    constructor() {
      this.fences = new Map();
      this.monitoringId = null;
    }
  
    /**
     * Adds a new geofence to the manager
     */
    addFence(config) {
      const fence = new GeoFence(config);
      this.fences.set(config.id, fence);
      return fence;
    }
  
    /**
     * Initializes monitoring for a list of coordinates
     */
    monitorCoordinates(coordsList, onEnterCallback) {
      this.validateCoordinatesList(coordsList);
  
      coordsList.forEach(({ id, coords }) => {
        const [latitude, longitude, radius] = coords;
        
        this.addFence({
          id,
          latitude,
          longitude,
          radius,
          onEnter: () => onEnterCallback(id),
          onExit: () => console.log(`User exited fence area: ${id}`)
        });
      });
  
      this.startLocationMonitoring();
    }
  
    validateCoordinatesList(coordsList) {
      if (!Array.isArray(coordsList) || coordsList.length === 0) {
        throw new Error('Invalid coordinates list');
      }
    }
  
    /**
     * Starts monitoring user's location
     */
    startLocationMonitoring() {
      if (!this.isGeolocationSupported()) {
        throw new Error('Geolocation is not supported in this environment');
      }
  
      this.monitoringId = navigator.geolocation.watchPosition(
        position => this.handlePositionUpdate(position),
        error => this.handleGeolocationError(error),
        GEOLOCATION_CONFIG.MONITORING
      );
    }
  
    isGeolocationSupported() {
      return 'geolocation' in navigator;
    }
  
    handlePositionUpdate(position) {
      const currentPosition = new Coordinate(
        position.coords.latitude,
        position.coords.longitude
      );
  
      this.fences.forEach(fence => fence.updateState(currentPosition));
    }
  
    handleGeolocationError(error) {
      console.error('Geolocation error:', error.message);
    }
  
    /**
     * Stops location monitoring
     */
    stopMonitoring() {
      if (this.monitoringId !== null) {
        navigator.geolocation.clearWatch(this.monitoringId);
        this.monitoringId = null;
      }
    }
  }
  
  export default GeoFencingManager;