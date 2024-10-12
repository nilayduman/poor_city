import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import viteConfig from '../../../vite.config.js';
import models from './models.js';

const baseUrl = viteConfig.base;

export class AssetManager {
  textureLoader = new THREE.TextureLoader();
  modelLoader = new GLTFLoader();

  textures = {
    'base': this.#loadTexture(`${baseUrl}textures/base.png`),
    'specular': this.#loadTexture(`${baseUrl}textures/specular.png`),
    'grid': this.#loadTexture(`${baseUrl}textures/grid.png`),
    
  };

  statusIcons = {
    'no-power': this.#loadTexture(`${baseUrl}statusIcons/no-power.png`, true),
    'no-road-access': this.#loadTexture(`${baseUrl}statusIcons/no-road-access.png`, true)
  }

  models = {};
  sprites = {};

  constructor(onLoad) {
    this.modelCount = Object.keys(models).length;
    this.loadedModelCount = 0;

    for (const [name, meta] of Object.entries(models)) {
      this.#loadModel(name, meta);
    }

    this.onLoad = onLoad;
  }

  /**
   * @param {string} name 
   * @param {Object} simObject 
   * @param {boolean} transparent 
   * @returns {THREE.Mesh}
   */
  getModel(name, simObject, transparent = false) {
    const mesh = this.models[name].clone();
      mesh.traverse((obj) => {
      obj.userData = simObject;
      if(obj.material) {
        obj.material = obj.material.clone();
        obj.material.transparent = transparent;
      }
    });

    return mesh;
  }
  
  /**
   * Loads the texture at the specified URL
   * @param {string} url 
   * @returns {THREE.Texture} A texture object
   */
  #loadTexture(url, flipY = false) {
    const texture = this.textureLoader.load(url)
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = flipY;
    return texture;
  }

  /**
  
   * @param {string} url 
   */
  #loadModel(name, {filename, scale = 1, rotation = 0, receiveShadow = true, castShadow = true}) {
    this.modelLoader.load(`${baseUrl}models/${filename}`,
      (glb) => {
        let mesh = glb.scene;
        
        mesh.name = filename;

        mesh.traverse((obj) => {
          if (obj.material) {
            obj.material = new THREE.MeshLambertMaterial({
              map: this.textures.base,
              specularMap: this.textures.specular
            })
            obj.receiveShadow = receiveShadow;
            obj.castShadow = castShadow;
          }
        });

        mesh.rotation.set(0, THREE.MathUtils.degToRad(rotation), 0);
        mesh.scale.set(scale / 30, scale / 30, scale / 30);

        this.models[name] = mesh;
        this.loadedModelCount++;
        if (this.loadedModelCount == this.modelCount) {
          this.onLoad()
        }
      },
      (xhr) => {
      
      },
      (error) => {
        console.error(error);
      });
  }
}