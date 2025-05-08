'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';


interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current || !modelUrl) return;

    setIsLoading(true);
    setError(null);
    let animationFrameId: number;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Light gray background

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 3); // Adjusted camera position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10; // Adjusted max distance
    controls.target.set(0, 0.5, 0); // Center target on typical model height

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Stronger directional light
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);


    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        // Scale and center the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / maxDim; // Scale to fit in a 2x2x2 box
        model.scale.set(scale, scale, scale);
        
        scene.add(model);
        setIsLoading(false);
      },
      undefined, // onProgress callback (not used here)
      (error) => {
        console.error('Error loading GLTF model:', error);
        setError(`Failed to load 3D model. Path: ${modelUrl}. Error: ${error.message}`);
        setIsLoading(false);
      }
    );

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose geometries, materials, textures if necessary
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [modelUrl]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Skeleton className="w-full h-full" />
           <p className="absolute text-foreground">Loading 3D model...</p>
        </div>
      )}
      {error && !isLoading && (
         <Alert variant="destructive" className="h-full flex flex-col items-center justify-center">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <AlertTitle>Error Loading Model</AlertTitle>
          <AlertDescription className="text-center">
            Could not load the 3D model. <br />
            Details: {error.length > 100 ? error.substring(0,100) + "..." : error}
          </AlertDescription>
        </Alert>
      )}
      <div ref={mountRef} className="w-full h-full" style={{ display: isLoading || error ? 'none' : 'block' }} />
    </div>
  );
};

export default ModelViewer;
