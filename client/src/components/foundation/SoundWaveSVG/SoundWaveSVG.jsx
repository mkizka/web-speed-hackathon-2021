import React from 'react';
import zip from 'lodash-es/zip';
import mean from 'lodash-es/mean';
import chunk from 'lodash-es/chunk';
import max from 'lodash-es/max';
import map from 'lodash-es/map';

import { getSoundPath } from '../../../utils/get_path';
import { fetchBinary } from '../../../utils/fetchers';

const _ = {
  zip,
  mean,
  chunk,
  max,
  map,
};

/**
 * @param {ArrayBuffer} data
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
async function calculate(data) {
  const audioCtx = new AudioContext();

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  });
  // 左の音声データの絶対値を取る
  const leftData = _.map(buffer.getChannelData(0), Math.abs);
  // 右の音声データの絶対値を取る
  const rightData = _.map(buffer.getChannelData(1), Math.abs);

  // 左右の音声データの平均を取る
  const normalized = _.map(_.zip(leftData, rightData), _.mean);
  // 100 個の chunk に分ける
  const chunks = _.chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = _.map(chunks, _.mean);
  // chunk の平均の中から最大値を取る
  const max = _.max(peaks);

  return { max, peaks };
}

/**
 * @typedef {object} Props
 * @property {Models.Sound} sound
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ sound }) => {
  const [{ max, peaks }, setPeaks] = React.useState({ max: 0, peaks: [] });

  React.useEffect(() => {
    if (sound.max && sound.peaks) return;
    fetchBinary(getSoundPath(sound.id))
      .then(calculate)
      .then(({ max, peaks }) => {
        setPeaks({ max, peaks });
      });
  }, [sound]);

  const uniqueIdRef = React.useRef(Math.random().toString(16));

  const _peaks = sound.peaks ? sound.peaks.split(',').map(parseFloat) : peaks;
  const _max = sound.max ? sound.max : max;
  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {_peaks.map((peak, idx) => {
        const ratio = peak / _max;
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
