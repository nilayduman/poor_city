import * as THREE from 'three';
import { SimModule } from './buildings/modules/simModule';

const SELECTED_COLOR = 0xaaaa55;
const HIGHLIGHTED_COLOR = 0x555555;

export class SimObject extends THREE.Object3D {
  #mesh = null;  
  #worldPos = new THREE.Vector3();  

  constructor(x = 0, y = 0) {
    super();
    this.name = 'SimObject';
    this.position.set(x, 0, y);  
  }

  get x() {
    this.getWorldPosition(this.#worldPos);
    return Math.floor(this.#worldPos.x);
  }

  get y() {
    this.getWorldPosition(this.#worldPos);
    return Math.floor(this.#worldPos.z);
  }

  get mesh() {
    return this.#mesh;
  }

  set mesh(value) {
    this.setMesh(value);  
  }

  setMesh(value) {
    if (this.#mesh) {
      this.dispose();  
      this.remove(this.#mesh);
    }

    this.#mesh = value;

    if (this.#mesh) {
      this.add(this.#mesh);  
    }
  }

  simulate(city) {
    
  }

  setSelected(value) {
    this.#setMeshEmission(value ? SELECTED_COLOR : 0);
  }

  setFocused(value) {
    this.#setMeshEmission(value ? HIGHLIGHTED_COLOR : 0);
  }

  #setMeshEmission(color) {
    if (this.mesh) {
      this.mesh.traverse(obj => {
        const material = obj.material;
        if (material) {
          material.emissive.setHex(color);
        }
      });
    }
  }

  dispose() {
    if (this.#mesh) {
      this.#mesh.traverse(obj => {
        const material = obj.material;
        if (material) {
          material.dispose(); 
        }
      });
      this.remove(this.#mesh); 
      this.#mesh = null; 
    }
  }
}

