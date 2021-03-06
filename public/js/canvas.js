import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";
import Stats from "/jsm/libs/stats.module.js";
import { GUI } from "../jsm/libs/dat.gui.module.js";

import fragment from "/shader/fragment.js";
import vertex from "/shader/vertex.js";

export default class Sketch {
  constructor() {
    this.scene = new THREE.Scene();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.physicallyCorrectLights = true;

    this.canvas = document.getElementById("canvas");
    this.canvas.appendChild(this.renderer.domElement);

    //PERSPECTIVE CAMERA
    this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 1000);

    //ORTHOGRAPHIC CAMERA
    // const fustrumSize = 1;
    // this.camera = new THREE.OrthographicCamera(
    //   fustrumSize / -2,
    //   fustrumSize / 2,
    //   fustrumSize / 2,
    //   fustrumSize / -2,
    //   0.1,
    //   1000
    // );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.settings();
    this.addObjects();
    this.render();

    window.addEventListener("resize", this.resize, false);
  }

  settings = () => {
    this.stats = Stats();
    this.canvas.appendChild(this.stats.dom);

    this.gui = new GUI({ autoPlace: true });

    this.gui.add(this.camera.position, "z", 0, 20, 0.1);

    this.gui.domElement.id = "gui";
    this.canvas.appendChild(this.gui.domElement);
  };

  render = () => {
    requestAnimationFrame(this.render);

    this.time++;
    this.material.uniforms.time.value = this.time;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  };

  resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  };

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: true,
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        // image: {
        //   value: new THREE.TextureLoader().load(this.image1.src),
        // },
        // uViewport: { value: new THREE.Vector2(this.width, this.height) },
        resolution: { value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex(),
      fragmentShader: fragment(),
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
