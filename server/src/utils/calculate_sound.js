import { AudioContext } from 'web-audio-api';
import _ from 'lodash';

/**
 * @param {ArrayBuffer} data
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
export async function calculateSound(data) {
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

  return { max, peaks: peaks.join(',') };
}
