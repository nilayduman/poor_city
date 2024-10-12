import * as THREE from 'three';

const DEG2RAD = Math.PI / 180.0;
const RIGHT_MOUSE_BUTTON = 2;

const CAMERA_SIZE = 5;
const MIN_CAMERA_RADIUS = 0.1;
const MAX_CAMERA_RADIUS = 5;
const CAMERA_ELEVATION = 45;

const AZIMUTH_SENSITIVITY = 0.2;
const ELEVATION_SENSITIVITY = 0.2;
const ZOOM_SENSITIVITY = 0.002;
const PAN_SENSITIVITY = -0.01;

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export class CameraManager {
  constructor() {
    const aspect = window.ui.gameWindow.clientWidth / window.ui.gameWindow.clientHeight;

    this.camera = new THREE.OrthographicCamera(
      (CAMERA_SIZE * aspect) / -2,
      (CAMERA_SIZE * aspect) / 2,
      CAMERA_SIZE / 2,
      CAMERA_SIZE / -2,
      1,
      1000
    );

    this.camera.layers.enable(1);

    this.cameraOrigin = new THREE.Vector3(8, 0, 8);
    this.cameraRadius = 0.5;
    this.cameraAzimuth = 225;
    this.cameraElevation = CAMERA_ELEVATION;

    this.updateCameraPosition();

    const gameWindow = window.ui.gameWindow;
    gameWindow.addEventListener('wheel', this.onMouseScroll.bind(this), false);
    gameWindow.addEventListener('mousedown', this.onMouseMove.bind(this), false);
    gameWindow.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  updateCameraPosition() {
    const radius = 100;
    this.camera.zoom = this.cameraRadius;

    const azimuthRad = this.cameraAzimuth * DEG2RAD;
    const elevationRad = this.cameraElevation * DEG2RAD;

    this.camera.position.set(
      radius * Math.sin(azimuthRad) * Math.cos(elevationRad),
      radius * Math.sin(elevationRad),
      radius * Math.cos(azimuthRad) * Math.cos(elevationRad)
    );

    this.camera.position.add(this.cameraOrigin);
    this.camera.lookAt(this.cameraOrigin);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
  }

  onMouseMove(event) {
    if (event.buttons & RIGHT_MOUSE_BUTTON) {
      if (!event.ctrlKey) {
        this.cameraAzimuth -= event.movementX * AZIMUTH_SENSITIVITY;
        this.cameraElevation = Math.min(CAMERA_ELEVATION, Math.max(-90, this.cameraElevation + (event.movementY * ELEVATION_SENSITIVITY)));
      } else {
        const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, this.cameraAzimuth * DEG2RAD);
        const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, this.cameraAzimuth * DEG2RAD);
        this.cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * event.movementY));
        this.cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * event.movementX));
      }

      this.updateCameraPosition();
    }
  }

  onMouseScroll(event) {
    this.cameraRadius *= 1 - (event.deltaY * ZOOM_SENSITIVITY);
    this.cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, this.cameraRadius));
    this.updateCameraPosition();
  }

  resize() {
    const aspect = window.ui.gameWindow.clientWidth / window.ui.gameWindow.clientHeight;
    this.camera.left = (CAMERA_SIZE * aspect) / -2;
    this.camera.right = (CAMERA_SIZE * aspect) / 2;
    this.camera.updateProjectionMatrix();
  }
}
