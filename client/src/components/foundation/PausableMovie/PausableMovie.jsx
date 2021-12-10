import classNames from 'classnames';
import React from 'react';

import { AspectRatioBox } from '../AspectRatioBox';
import { FontAwesomeIcon } from '../FontAwesomeIcon';

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  /** @type {React.RefObject<HTMLVideoElement>} */
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  /** @type {React.RefCallback<HTMLVideoElement>} */
  const videoCallbackRef = React.useCallback((video) => {
    if (video == null) return;
    videoRef.current?.pause();

    // Reactではmutedが効かないため
    // https://qiita.com/naosk8/items/58075afe6bcd25c153d9
    video.volume = 0;

    // 視覚効果 off のとき GIF を自動再生しない
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlaying(false);
      video.pause();
    } else {
      setIsPlaying(true);
      video.play();
    }

    videoRef.current = video;
  }, []);

  const handleClick = React.useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
      return !isPlaying;
    });
  }, []);

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" onClick={handleClick} type="button">
        <video ref={videoCallbackRef} src={src} loop />
        <div
          className={classNames(
            'absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon iconType={isPlaying ? 'pause' : 'play'} styleType="solid" />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };
