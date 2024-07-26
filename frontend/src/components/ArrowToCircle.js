import React, { useState } from 'react';
import { useSpring, animated} from 'react-spring';
import * as flubber from 'flubber';

const ArrowToCircle = () => {
  const [toggle, setToggle] = useState(false);

  const syncPath = "M14.3935 5.37371C18.0253 6.70569 19.8979 10.7522 18.5761 14.4118C17.6363 17.0135 15.335 18.7193 12.778 19.0094M12.778 19.0094L13.8253 17.2553M12.778 19.0094L14.4889 20";
  const circlePath = "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z";
  const heart = "M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
  const interpolator = flubber.interpolate(heart,syncPath);

  const {t} = useSpring({
    t: toggle ? 1 : 0,
    config: { duration: 1000 },
  });

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{ width: '40rem', height: '40rem', cursor: 'pointer' }}
      onClick={() => setToggle(!toggle)}
    >
      <animated.svg
        viewBox="0 0 24 24"
        fill="red"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <animated.path
          d={t.to(interpolator)}
          stroke="#FEBF55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </animated.svg>
    </div>
  );
};

export default ArrowToCircle;
