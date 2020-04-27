import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import deviceType from './deviceType';

export function useMediaQuery() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [orientation, setOrientation] = useState('');
  const [device, setDevice] = useState('');
  function handleViewportSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  function handleScreenOrientation() {
    setOrientation(window.screen.orientation);
  }
  useEffect(() => {
    if (width > 0) {
      switch (true) {
        case width <= 600:
          setDevice('phone');
          break;
        case width <= 768:
        case width <= 992:
        case width <= 1200:
          setDevice('tablet');
          break;
        case width <= 2560:
          setDevice('laptop');
          break;
        case width > 2560:
          setDevice('desktop');
          break;
        default:
          setDevice('');
      }
    }
  }, [width]);

  useEffect(() => {
    console.log('device', device);
  }, [device]);
  useEffect(() => {
    handleViewportSize();
    handleScreenOrientation();
    window.addEventListener('orientationchange', handleScreenOrientation);
    window.addEventListener('resize', () => handleViewportSize);

    return () => {
      // window.removeEventListener();
      // window.removeEventListener(handleScreenOrientation);
    };
  }, []);

  return { width, height, orientation, device };
}
