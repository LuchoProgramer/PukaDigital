import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Fuente = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600 | 800;
  style: 'normal';
};

const DIR = join(process.cwd(), 'assets', 'fonts');

const ARCHIVOS: Array<[string, Fuente['weight'], string]> = [
  ['Bricolage Grotesque', 800, 'BricolageGrotesque-ExtraBold.ttf'],
  ['Instrument Sans', 400, 'InstrumentSans-Regular.ttf'],
  ['Instrument Sans', 600, 'InstrumentSans-SemiBold.ttf'],
  ['JetBrains Mono', 500, 'JetBrainsMono-Medium.ttf'],
];

/** Satori no lee woff2: solo ttf, otf y woff. Estas son instancias estaticas. */
export function cargarFuentes(): Fuente[] {
  return ARCHIVOS.map(([name, weight, archivo]) => ({
    name,
    weight,
    style: 'normal' as const,
    data: readFileSync(join(DIR, archivo)),
  }));
}
