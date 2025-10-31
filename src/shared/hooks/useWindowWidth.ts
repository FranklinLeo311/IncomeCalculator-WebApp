import { useState, useEffect } from 'react';

const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  ),
    [bodyPanelWidth, setBodyPanelWidth] = useState(
      0
    );

  useEffect(() => {
    const handleResize = () => {

      setWidth(window.innerWidth);
      const leftPanelWidth = document.querySelector('.nav-expand-collapse')?.clientWidth || 0

      setBodyPanelWidth(window.innerWidth -
        leftPanelWidth

      );
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { screenWidth: width, bodyPanelWidth };
}

export default useWindowWidth;
