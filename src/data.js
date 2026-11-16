import img0171 from './assets/IMG_0171.webp';
import img0176 from './assets/IMG_0176.webp';
import img4660 from './assets/IMG_4660.webp';
import img4667 from './assets/IMG_4667.webp';
import img4668 from './assets/IMG_4668.webp';
import img4669 from './assets/IMG_4669.webp';
import img4670 from './assets/IMG_4670.webp';

/** Section ids, in the same order as `t.nav`. */
export const NAV_IDS = ['about', 'work', 'approach', 'services', 'steps', 'faq', 'journal', 'contacts'];

/** Image + focal point for each "What I work with" card (same order as `t.work.cards`). */
export const WORK_MEDIA = [
  { img: img0171, pos: '50% 40%' },
  { img: img4660, pos: '50% 45%' },
  { img: img4669, pos: '50% 45%' },
  { img: img4670, pos: '50% 30%' },
  { img: img4667, pos: '50% 45%' },
  { img: img4668, pos: '50% 50%' },
];

/** Cover image for each journal post (same order as `t.jr.posts`). */
export const POST_IMG = [img0176, img4670, img4668];

export const MOBILE_MAX = 820;

export const pad = (n) => String(n).padStart(2, '0');
