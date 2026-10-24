export type Structure = {
  id: string
  fma: string
  name: string
  sourceName: string
  group: 'Pancreas' | 'Neighbouring organs' | 'Arteries' | 'Veins'
  // Official 4.3 IS-A concepts this group draws its source meshes from.
  concepts: string[]
  // FJ element files; each element belongs to exactly one structure, unless
  // the structures are parts that divide it.
  elements: string[]
  // Set when the source models this structure and its neighbour as one
  // surface: it keeps the source triangles whose centre `keep` accepts.
  part?: { landmark: string; keep: (centre: Point) => boolean }
  color: string
  description: string
  note: string
}

// A point in the source's millimetres: x toward the left side, z upward.
export type Point = [x: number, y: number, z: number]

// The superior mesenteric vein runs up behind the neck of the pancreas at
// x ≈ −9 mm, so the gland to its right is the head. Below the body's lower
// border, at z ≈ 1030 mm, the whole gland is head: the uncinate process hooks
// to the left behind the vein there.
const inHead = ([x, , z]: Point) => x < -9 || z < 1030
const landmark = 'the superior mesenteric vein, behind the neck of the pancreas'

export const anatomySource = 'https://www.training.seer.cancer.gov/biliary/anatomy'
export const structures: Structure[] = [
  {
    id: 'pancreatic-head',
    fma: 'FMA10468',
    name: 'Head of pancreas',
    sourceName: 'parenchyma of pancreas, right of the superior mesenteric vein',
    group: 'Pancreas',
    concepts: ['FMA63120'],
    elements: ['FJ1895'],
    part: { landmark, keep: inHead },
    color: '#dcb67e',
    description:
      'The widest part of the gland, held in the curve of the duodenum. The common bile duct runs through it, so a tumour here causes jaundice early.',
    note: 'The source models the gland as one surface. It is divided here where the superior mesenteric vein passes behind the neck, a line surgeons also use; the head includes the uncinate process below it.',
  },
  {
    id: 'pancreatic-body-and-tail',
    fma: 'FMA14518',
    name: 'Body and tail of pancreas',
    sourceName: 'parenchyma of pancreas, left of the superior mesenteric vein',
    group: 'Pancreas',
    concepts: ['FMA63120'],
    elements: ['FJ1895'],
    part: { landmark, keep: (centre) => !inHead(centre) },
    color: '#d2a86e',
    description:
      'Runs from the neck across the spine to the tail at the spleen, with the splenic vein along its back. Tumours here cause no jaundice and are often found late.',
    note: 'Divided from the head where the superior mesenteric vein passes behind the neck. The source has no boundary between body and tail.',
  },
  {
    id: 'pancreatic-duct',
    fma: 'FMA63103',
    name: 'Pancreatic duct',
    sourceName: 'pancreatic duct tree',
    group: 'Pancreas',
    concepts: ['FMA63103'],
    elements: ['FJ1896'],
    color: '#7d9a5e',
    description:
      'Carries digestive juices from the gland along its length and empties them into the duodenum.',
    note: 'It runs inside the gland. Isolate it or hide the pancreas to see it.',
  },
  {
    id: 'duodenum',
    fma: 'FMA7206',
    name: 'Duodenum',
    sourceName: 'duodenum',
    group: 'Neighbouring organs',
    concepts: ['FMA7206'],
    elements: ['FJ2573'],
    color: '#c99089',
    description:
      'The first part of the small intestine. It curves around the head of the pancreas and receives the pancreatic duct.',
    note: 'Included for orientation. The stomach and the rest of the intestine are omitted.',
  },
  {
    id: 'spleen',
    fma: 'FMA7196',
    name: 'Spleen',
    sourceName: 'spleen',
    group: 'Neighbouring organs',
    concepts: ['FMA7196'],
    elements: ['FJ2561'],
    color: '#8e5c6c',
    description:
      'An organ in the upper left abdomen. The tail of the pancreas ends near its hilum.',
    note: 'Included for orientation. Its own vessels are shown only where they belong to the splenic artery and vein.',
  },
  {
    id: 'celiac-trunk',
    fma: 'FMA14812',
    name: 'Celiac trunk',
    sourceName: 'celiac trunk',
    group: 'Arteries',
    concepts: ['FMA14812'],
    elements: ['FJ3421'],
    color: '#b8564c',
    description:
      'A short branch of the aorta that divides into arteries supplying the stomach, liver, spleen and pancreas.',
    note: 'The aorta itself and the left gastric artery are omitted.',
  },
  {
    id: 'common-hepatic-artery',
    fma: 'FMA76536',
    name: 'Common hepatic artery',
    sourceName: 'trunk of common hepatic artery',
    group: 'Arteries',
    concepts: ['FMA76536'],
    elements: ['FJ3078'],
    color: '#c9725f',
    description:
      'Runs from the celiac trunk toward the liver and gives off the gastroduodenal artery.',
    note: 'Only the trunk is included; the hepatic artery proper is shown in the liver explorer.',
  },
  {
    id: 'gastroduodenal-artery',
    fma: 'FMA76574',
    name: 'Gastroduodenal artery',
    sourceName: 'trunk of gastroduodenal artery',
    group: 'Arteries',
    concepts: ['FMA76574'],
    elements: ['FJ3432'],
    color: '#d0836c',
    description:
      'Passes behind the first part of the duodenum and leads to the arteries around the pancreatic head.',
    note: 'Only the trunk is included.',
  },
  {
    id: 'pancreaticoduodenal-arteries',
    fma: 'FMA14782',
    name: 'Pancreaticoduodenal arteries',
    sourceName:
      'anterior and posterior superior, anterior and posterior inferior, and inferior pancreaticoduodenal arteries',
    group: 'Arteries',
    concepts: ['FMA14782', 'FMA14784', 'FMA70479', 'FMA70480', 'FMA14805'],
    elements: ['FJ3409', 'FJ3557', 'FJ3401', 'FJ3546', 'FJ3446'],
    color: '#de9878',
    description:
      'Arcades around the head of the pancreas that supply it and the duodenum, joining branches from above and below.',
    note: 'Five source vessels are grouped as one selectable set. Small vessels are simplified.',
  },
  {
    id: 'splenic-artery',
    fma: 'FMA14773',
    name: 'Splenic artery',
    sourceName: 'splenic artery',
    group: 'Arteries',
    concepts: ['FMA14773'],
    elements: ['FJ3640', 'FJ3544', 'FJ3420'],
    color: '#a94a46',
    description: 'Runs from the celiac trunk along the upper border of the pancreas to the spleen.',
    note: 'The winding trunk is shown. Its pancreatic branches are a separate group.',
  },
  {
    id: 'pancreatic-arteries',
    fma: 'FMA14787',
    name: 'Pancreatic branches',
    sourceName: 'dorsal, great, inferior and caudal pancreatic arteries',
    group: 'Arteries',
    concepts: ['FMA14787', 'FMA14792', 'FMA14790', 'FMA14793'],
    elements: ['FJ3430', 'FJ3433', 'FJ3444', 'FJ3419'],
    color: '#e3a989',
    description: 'Branches that supply the neck, body and tail of the pancreas.',
    note: 'Four source vessels are grouped as one selectable set. Small vessels are simplified.',
  },
  {
    id: 'superior-mesenteric-artery',
    fma: 'FMA66358',
    name: 'Superior mesenteric artery',
    sourceName: 'trunk of superior mesenteric artery',
    group: 'Arteries',
    concepts: ['FMA66358'],
    elements: ['FJ3644'],
    color: '#bf6656',
    description:
      'Leaves the aorta behind the neck of the pancreas and supplies much of the intestine.',
    note: 'The trunk is shown; its intestinal branches are omitted.',
  },
  {
    id: 'splenic-vein',
    fma: 'FMA14331',
    name: 'Splenic vein',
    sourceName: 'splenic vein',
    group: 'Veins',
    concepts: ['FMA14331'],
    elements: ['FJ3641'],
    color: '#6d8db0',
    description:
      'Drains the spleen and runs behind the pancreas to join the superior mesenteric vein.',
    note: 'Best seen from the posterior view.',
  },
  {
    id: 'superior-mesenteric-vein',
    fma: 'FMA14332',
    name: 'Superior mesenteric vein',
    sourceName: 'superior mesenteric vein',
    group: 'Veins',
    concepts: ['FMA14332'],
    elements: ['FJ3647'],
    color: '#7f9fbf',
    description:
      'Drains much of the intestine. Its left border marks where the head of the pancreas ends and the body begins.',
    note: 'The trunk is shown; its tributaries are omitted.',
  },
  {
    id: 'portal-vein',
    fma: 'FMA71904',
    name: 'Portal vein',
    sourceName: 'pre-hepatic portal vein',
    group: 'Veins',
    concepts: ['FMA71904'],
    elements: ['FJ3082'],
    color: '#5f7fa6',
    description:
      'Formed behind the neck of the pancreas where the splenic and superior mesenteric veins meet. It carries blood to the liver.',
    note: 'Only the segment before the liver is included; its branches are shown in the liver explorer.',
  },
  {
    id: 'pancreaticoduodenal-veins',
    fma: 'FMA15398',
    name: 'Pancreaticoduodenal veins',
    sourceName: 'pancreaticoduodenal vein',
    group: 'Veins',
    concepts: ['FMA15398'],
    elements: ['FJ3545', 'FJ3646', 'FJ3655'],
    color: '#93aecb',
    description: 'Drain the head of the pancreas and the duodenum toward the portal system.',
    note: 'Three source vessels are grouped as one selectable set. Small vessels are simplified.',
  },
]
export const groups = ['Pancreas', 'Neighbouring organs', 'Arteries', 'Veins'] as const
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Posterior' | 'Inferior'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'pancreatic-body-and-tail',
    title: 'A gland across the abdomen',
    text: 'The pancreas lies across the back of the upper abdomen. Rotate the model to follow its body and tail from the spine to the spleen.',
    view: 'Anterior',
  },
  {
    id: 'pancreatic-head',
    title: 'Held in a curve',
    text: 'The head of the pancreas sits in the C-shaped curve of the duodenum, the first part of the small intestine.',
    view: 'Anterior',
  },
  {
    id: 'pancreatic-duct',
    title: 'Look a little closer',
    text: 'The pancreatic duct is isolated here. It collects digestive juices along the gland and empties them into the duodenum. Restore all to see the gland around it.',
    view: 'Anterior',
    isolate: true,
  },
  {
    id: 'splenic-vein',
    title: 'Behind the gland',
    text: 'Turn to the back to find the splenic vein running along the pancreas. It meets the superior mesenteric vein to form the portal vein.',
    view: 'Posterior',
  },
  {
    id: 'splenic-artery',
    title: 'The gland’s supply',
    text: 'The splenic artery winds along the upper border of the pancreas and sends branches into its body and tail.',
    view: 'Anterior',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry (pancreatic duct, splenic vein).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
