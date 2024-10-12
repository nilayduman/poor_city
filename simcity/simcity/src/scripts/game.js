import * as THREE from 'three';
import { AssetManager } from './assets/assetManager.js';
import { CameraManager } from './camera.js';
import { InputManager } from './input.js';
import { City } from './sim/city.js';
import { SimObject } from './sim/simObject.js';


export class Game {
  city;
  focusedObject = null;
  selectedObject = null;
  inputManager;
  renderer;
  scene;
  raycaster;

  constructor(city) {
    this.city = city;
    this.initializeRenderer();
    this.initializeScene();

    window.assetManager = new AssetManager(() => {
      window.ui.hideLoadingText();
      this.city = new City(16);
      this.initialize(this.city);
      this.start();
      setInterval(this.simulate.bind(this), 1000);
    });

    window.addEventListener('resize', this.onResize.bind(this), false);
    this.inputManager = new InputManager(window.ui.gameWindow);
    this.cameraManager = new CameraManager(window.ui.gameWindow);
  }

  initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.ui.gameWindow.clientWidth, window.ui.gameWindow.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    window.ui.gameWindow.appendChild(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
  }

  initializeScene() {
    this.scene = new THREE.Scene();
    this.scene.clear();
  }

  initialize(city) {
    this.scene.add(city);
    this.setupLights();
    this.setupGrid(city);
  }

  setupGrid(city) {
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      map: window.assetManager.textures['grid'],
      transparent: true,
      opacity: 0.2
    });
    gridMaterial.map.repeat.set(city.size, city.size);
    
    const grid = new THREE.Mesh(
      new THREE.BoxGeometry(city.size, 0.1, city.size),
      gridMaterial
    );
    grid.position.set(city.size / 2 - 0.5, -0.04, city.size / 2 - 0.5);
    this.scene.add(grid);
  }

  setupLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(-10, 20, 0);
    sun.castShadow = true;

    // Gölge ayarları
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 50;
    sun.shadow.normalBias = 0.01;

    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
}

  
  start() {
    this.renderer.setAnimationLoop(this.draw.bind(this));
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  draw() {
    this.city.draw();
    this.updateFocusedObject();

    if (this.inputManager.isLeftMouseDown) {
      this.useTool();
    }

    this.renderer.render(this.scene, this.cameraManager.camera);
  }

  simulate() {
    if (!window.ui.isPaused) {
      this.city.simulate(1);
      window.ui.updateTitleBar(this);
      window.ui.updateInfoPanel(this.selectedObject);
    }
  }

  useTool() {
    const { focusedObject } = this;
    switch (window.ui.activeToolId) {
      case 'select':
        this.updateSelectedObject();
        break;
      case 'bulldoze':
        if (focusedObject) this.city.bulldoze(focusedObject.x, focusedObject.y);
        break;
      default:
        if (focusedObject) {
          console.log(`Placing building at: (${focusedObject.x}, ${focusedObject.y})`); // Debug log
          this.city.placeBuilding(focusedObject.x, focusedObject.y, window.ui.activeToolId);
        }
        break;
    }
  }
  
  
  updateSelectedObject() {
    if (this.selectedObject) this.selectedObject.setSelected(false);
    this.selectedObject = this.focusedObject;
    if (this.selectedObject) this.selectedObject.setSelected(true);
  }

  updateFocusedObject() {  
    if (this.focusedObject) this.focusedObject.setFocused(false);
    const newObject = this.raycast();
    if (newObject !== this.focusedObject) {
      this.focusedObject = newObject;
      if (this.focusedObject) this.focusedObject.setFocused(true);
    }
  }

  raycast() {
    const coords = {
      x: (this.inputManager.mouse.x / this.renderer.domElement.clientWidth) * 2 - 1,
      y: -(this.inputManager.mouse.y / this.renderer.domElement.clientHeight) * 2 + 1
    };

    this.raycaster.setFromCamera(coords, this.cameraManager.camera);
    const intersections = this.raycaster.intersectObjects(this.city.root.children, true);
    return intersections.length > 0 ? intersections[0].object.userData : null;
  }

  onResize() {
    this.cameraManager.resize(window.ui.gameWindow);
    this.renderer.setSize(window.ui.gameWindow.clientWidth, window.ui.gameWindow.clientHeight);
  }
}


window.onload = () => {
  window.game = new Game();
};
