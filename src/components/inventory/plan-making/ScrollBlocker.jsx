import { useEffect } from 'react';

const ScrollBlocker = ({ disableBack, children }) => {
  useEffect(() => {
    if (disableBack) {
      const handleWheel = (event) => {
        const { deltaX, deltaY, target } = event;

        // Ignore vertical scrolling
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        const scrollableElement = target.closest('.scrollable-container');

        if (scrollableElement) {
          const { scrollLeft, clientWidth, scrollWidth } = scrollableElement;

          // Allow horizontal scroll within scrollable containers
          if (
            (deltaX < 0 && scrollLeft > 0) ||
            (deltaX > 0 && scrollLeft + clientWidth < scrollWidth)
          ) {
            return;
          }

          // Prevent default behavior if the container is at its edge
          if (deltaX < 0 && scrollLeft === 0) {
            event.preventDefault();
          }
        } else if (deltaX < 0) {
          // Prevent default behavior if no scrollable container is targeted
          event.preventDefault();
        }
      };

      // Add the wheel event listener
      document.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        // Clean up the event listener
        document.removeEventListener('wheel', handleWheel);
      };
    }
  }, [disableBack]);
};

export default ScrollBlocker;
