import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, WebGLRenderer } from 'three';

import { IMAGE_SRC } from './ImageSrc';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
`;

export const HeroImage: React.FC = () => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const updateImage = useCallback(({ height, src, width }: { height: number; src: string; width: number }) => {
    const image = imageRef.current;
    if (image == null) {
      return;
    }
    image.width = width;
    image.height = height;
    image.src = src;
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (image == null) {
      return;
    }

    // width が 4096 / dpr の 16:9 の画像として描画する。
    const width = 4096 / window.devicePixelRatio;
    const height = (width / 16) * 9;
    const imageWidth = image.clientWidth;
    const imageHeight = (imageWidth / 16) * 9;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);

    const textureLoader = new TextureLoader();

    textureLoader.load(IMAGE_SRC, (texture) => {
      const geometry = new PlaneGeometry(2, 2);
      const material = new ShaderMaterial({
        fragmentShader: `uniform sampler2D tImage;
varying vec2 vUv;
void main() {
  float aspectRatio = float(textureSize(tImage, 0).x / textureSize(tImage, 0).y);
  vec2 uv = vec2(
      (vUv.x - 0.5) / min(aspectRatio, 1.0) + 0.5,
      (vUv.y - 0.5) / min(1.0 / aspectRatio, 1.0) + 0.5
  );
  gl_FragColor = texture2D(tImage, vUv);
}`,
        uniforms: {
          tImage: { value: texture },
        },
        vertexShader: `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
      });
      const mesh = new Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new WebGLRenderer({ alpha: true, antialias: true, canvas: canvasRef.current });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      updateImage({
        height: imageHeight,
        src: canvasRef.current.toDataURL(),
        width: imageWidth,
      });
    });
  }, [imageRef, updateImage]);

  useEffect(() => {
    const resize = () => {
      const image = imageRef.current;
      if (image == null) {
        return;
      }

      const width = image.clientWidth;
      const height = (image.clientWidth / 16) * 9;
      updateImage({
        height,
        src: canvasRef.current.toDataURL(),
        width,
      });
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [updateImage]);

  return (
    <_Wrapper>
      <_Image ref={imageRef} alt="Cyber TOON" />
    </_Wrapper>
  );
};
