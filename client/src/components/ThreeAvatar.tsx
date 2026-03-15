import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreeAvatarProps {
  className?: string;
}

export default function ThreeAvatar({ className = "" }: ThreeAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const size = mountRef.current.clientWidth || 64;
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load GLB model
    const loader = new GLTFLoader();
    
    loader.load(
      '/attached_assets/AI_Buddy1_1752479153521.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Scale and position the model
        model.scale.setScalar(1);
        model.position.set(0, -0.5, 0);
        
        scene.add(model);
        setIsLoaded(true);

        // Animation mixer for GLB animations
        let mixer: THREE.AnimationMixer | null = null;
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // Camera position
        camera.position.set(0, 0, 2);
        camera.lookAt(0, 0, 0);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          
          // Gentle rotation
          model.rotation.y += 0.005;
          
          // Update animation mixer
          if (mixer) {
            mixer.update(0.016);
          }
          
          renderer.render(scene, camera);
        };
        
        animate();
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLB model:', error);
        
        // Create a fallback 3D avatar using basic geometry
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x3B82F6,
          roughness: 0.4,
          metalness: 0.8
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
        
        // Add simple face features
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 0.1, 0.4);
        sphere.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 0.1, 0.4);
        sphere.add(rightEye);
        
        // Add pupils
        const pupilGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.2, 0.1, 0.42);
        sphere.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.2, 0.1, 0.42);
        sphere.add(rightPupil);
        
        // Add mouth
        const mouthGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.1, 0.4);
        mouth.scale.set(1.5, 0.5, 1);
        sphere.add(mouth);
        
        camera.position.set(0, 0, 2);
        camera.lookAt(0, 0, 0);
        
        setIsLoaded(true);
        
        // Animation loop for fallback avatar
        const animate = () => {
          requestAnimationFrame(animate);
          sphere.rotation.y += 0.005;
          sphere.position.y = Math.sin(Date.now() * 0.001) * 0.1;
          renderer.render(scene, camera);
        };
        
        animate();
      }
    );

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Fallback avatar if GLB fails to load
  const FallbackAvatar = () => (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-lg flex items-center justify-center animate-bounce-gentle">
      <div className="text-white text-2xl">🤖</div>
    </div>
  );

  return (
    <div className={`w-16 h-16 ${className}`}>
      {error ? (
        <FallbackAvatar />
      ) : (
        <div ref={mountRef} className="w-full h-full">
          {!isLoaded && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
