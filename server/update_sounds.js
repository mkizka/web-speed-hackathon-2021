import { promises as fs } from 'fs';
import { calculateSound } from './src/utils/calculate_sound';
import sounds from './seeds/sounds.json';

async function main() {
  const tasks = sounds.map(async (sound) => {
    const soundFile = await fs.readFile(`../public/sounds/${sound.id}.mp3`);
    const { max, peaks } = await calculateSound(soundFile.buffer);
    sound.max = max;
    sound.peaks = peaks;
    return sound;
  });
  const updatedSounds = await Promise.all(tasks);
  await fs.writeFile('./seeds/sounds.json', JSON.stringify(updatedSounds, null, 2));
}

main();
