import React from 'react';

/**
 * @typedef {object} Props
 * @property {Models.Sound} sound
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ sound }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {sound.peaks.split(',').map((peak, idx) => {
        const ratio = parseFloat(peak) / sound.max;
        console.log(parseFloat(peak));
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
