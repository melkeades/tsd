import './styles/style.styl'
import Lenis from '@studio-freight/lenis'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger '
import $ from 'jquery'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// const gui = new dat.GUI()

const loader = new GLTFLoader()

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1.2,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger)

let lenisScroll = 0
let lenisDirection = 0

//get scroll value
lenis.on('scroll', ({ scroll, direction }) => {
  // console.log({ scroll, limit, velocity, direction, progress })
  lenisScroll = scroll
  lenisDirection = direction
})

// cursor parallax
let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
let mouse = { x: pos.x, y: pos.y, moved: false }
let moveX, moveY

window.addEventListener('mousemove', (e) => {
  mouse.moved = true
  mouse.x = e.x
  mouse.y = e.y
})

loader.load('https://uploads-ssl.webflow.com/637ceab05a548aedae987489/6383f9f415bbb66ae196d2b3_dragon.txt', (gltf) => {
  const scale = 6.5
  gltf.scene.scale.set(scale, scale, scale)
  gltf.scene.rotation.set(0.2, 5.7, 0)
  gltf.scene.position.set(0, -8, 0)
  scene.add(gltf.scene)
  // gui.add(gltf.scene.rotation, 'x').min(0).max(9)
  // gui.add(gltf.scene.rotation, 'y').min(0).max(9)
  // gui.add(gltf.scene.rotation, 'z').min(0).max(9)

  ScrollTrigger.create({
    // markers: true,
    trigger: '.sec',
    start: '20% center',
    end: '70% center',
    animation: gsap
      .timeline({ defaults: { ease: 'none' } })
      .fromTo('#wImg', { yPercent: -30 }, { yPercent: -70 })
      .fromTo('#wwImgCan', { yPercent: -35 }, { yPercent: -50 }, '<')
      // .fromTo('.svg_fg', { yPercent: 30, rotate: 0 }, { yPercent: 0, rotate: 150 }, '<'),
      .set('.svg_fg', { y: -60, scale: 1.2 }, '<')
      .from('.svg_fg', { yPercent: 10, rotation: -30, transformOrigin: '50% 50%' }, '<')
      .fromTo(gltf.scene.rotation, { y: 5.5 }, { y: 6.2 }, '<')
      .fromTo(gltf.scene.scale, { x: 7.1, y: 7.1, z: 7.1 }, { x: 6.1, y: 6.1, z: 6.1 }, '<'),
    // .fromTo('#svg_fg', { yPercent: -40 }, { yPercent: 180 }),
    // animation: gsap.timeline().to('#w_img', { yPercent: -80 }),
    toggleActions: 'play reverse restart reverse',
    scrub: 1,
    onUpdate: () => {
      console.log('qwe')
      // moveCamera()
    },
  })
  gsap.ticker.add(() => {
    if (mouse.moved) {
      moveX = mouse.x / pos.x
      moveY = mouse.y / pos.y
      parallaxIt('.svg_fg', moveX, moveY, -50)
      parallaxIt('#wwImgCan', moveX, moveY, -150)
    }
    mouse.moved = false
  })

  function parallaxIt(target, moveX, moveY, movement) {
    gsap.to(target, {
      x: (moveX / 4) * movement,
      y: (moveY / 4) * movement,
      duration: 2,
      // ease: 'power4.out',
    })
    gsap.to(gltf.scene.rotation, { x: mouse.y / pos.y / 4, duration: 4 }, '<')
  }
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#wwImgCan'),
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0xffffff, 0)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// // const material = new THREE.MeshBasicMaterial({ color: 0x999, wireframe: true })
// const material = new THREE.MeshStandardMaterial({ color: 0x99999 })
// const torus = new THREE.Mesh(geometry, material)
// scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff, 0.001)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
scene.add(pointLight, ambientLight)

// const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.y += 0.005
  // controls.update()
  renderer.render(scene, camera)
}

animate()

function moveCamera() {
  // torus.rotateOnAxis.y += lenisDirection / 1
}

function onReady() {}

if (document.readyState !== 'loading') {
  onReady()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    onReady()
  })
}
