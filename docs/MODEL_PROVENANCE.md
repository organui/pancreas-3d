# Model provenance and preparation

## Source and license

The runtime model uses **BodyParts3D / Anatomography 4.3** (object set 4.3, ontology tree FMA3.0), retrieved **2026-10-16**. All selected OBJ headers report compatibility version 4.3.

The original service explicitly permits modification and redistribution of contour data and rendered images under **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)** ([legal text](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)). An inert [snapshot of that notice](model-source/original-license.html.txt), copied from the lungs explorer's provenance record, is included. This license governs `public/models/pancreas.glb`, the manifest's model data and the model screenshots, separately from the MIT application code. This follows the same choice as [lungs-3d](https://github.com/organui/lungs-3d), which also uses 4.3 data: the LSDB archive's CC BY 4.0 grant covers its 4.0 release and is not extended to these 4.3 meshes.

Credit: **BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS).** Adapted by OrganUI. No endorsement is implied.

## Retrieval and pinning

The network policy of the sandbox this was built in blocked both `dbarchive.biosciencedbc.jp` and `lifesciencedb.jp`, so the official archives could not be downloaded. Geometry comes from the public [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) mirror, pinned at commit `fd527e6f4daf732fd814314d9257df5877b844bc` (the same commit the lungs explorer pins).

Each OBJ is checked three ways:

1. Its SHA-256 matches the oid in its pinned Git LFS pointer (recorded per file in [model-inputs.json](../scripts/model-inputs.json)).
2. Its embedded `File ID` and `Concept ID` headers match.
3. That concept maps to that FJ element in the official 4.3 IS-A table, [`FMA2Obj-4.3.tsv`](model-source/FMA2Obj-4.3.tsv) (SHA-256 `c3d16c89…935d4f`). The table is the unchanged official download preserved by lungs-3d; `prepare-model.ts` refuses to run if its hash changes.

The official per-element metadata table (original model filenames) could not be fetched, so unlike lungs-3d it is not preserved here.

## Selected structures

| Structure | Source concept(s) | Elements |
| --- | --- | --- |
| Head of pancreas (FMA10468) | FMA63120 parenchyma of pancreas, right of the superior mesenteric vein | FJ1895, divided |
| Body and tail of pancreas (FMA14518) | FMA63120 parenchyma of pancreas, left of the superior mesenteric vein | FJ1895, divided |
| Pancreatic duct | FMA63103 pancreatic duct tree | FJ1896 |
| Duodenum | FMA7206 | FJ2573 |
| Spleen | FMA7196 | FJ2561 |
| Celiac trunk | FMA14812 | FJ3421 |
| Common hepatic artery | FMA76536 trunk of common hepatic artery | FJ3078 |
| Gastroduodenal artery | FMA76574 trunk of gastroduodenal artery | FJ3432 |
| Pancreaticoduodenal arteries | FMA14782, FMA14784, FMA70479, FMA70480, FMA14805 | FJ3409, FJ3557, FJ3401, FJ3546, FJ3446 |
| Splenic artery | FMA14773 (IS-A trunk) | FJ3640, FJ3544, FJ3420 |
| Pancreatic branches | FMA14787 dorsal, FMA14792 great, FMA14790 inferior, FMA14793 caudal | FJ3430, FJ3433, FJ3444, FJ3419 |
| Superior mesenteric artery | FMA66358 trunk | FJ3644 |
| Splenic vein | FMA14331 | FJ3641 |
| Superior mesenteric vein | FMA14332 | FJ3647 |
| Portal vein | FMA71904 pre-hepatic portal vein | FJ3082 |
| Pancreaticoduodenal veins | FMA15398 | FJ3545, FJ3646, FJ3655 |

26 elements, 30,460 triangles. Each element belongs to exactly one structure, except the parenchyma, which its two parts divide; the script refuses any other duplicate, unused inputs, and parts that overlap or leave a gap. Per-element hashes, sizes and counts are in the [manifest](../public/models/manifest.json) and [selected-mappings.tsv](model-source/selected-mappings.tsv).

Decisions:

- **One parenchyma mesh.** FMA63120 maps to FJ1895 and FJ2629. Their bounds agree within 0.2 mm; they are two versions of the same surface, and rendering both would z-fight. FJ1895 (4,890 triangles, against 4,272) is used and FJ2629 is excluded. The source has no separate head, neck, body, tail or uncinate meshes.
- **Head and body divided at a landmark.** So that a disease of the head can be shown apart from the rest of the gland, `prepare-model.ts` divides FJ1895 into two structures. This is OrganUI's derivation, not a boundary in the source. Each source triangle goes to the head when its centre lies right of x = −9 mm (where the superior mesenteric vein runs up behind the neck, the line surgeons divide the gland at) or below z = 1030 mm (the lower border of the body, under which the whole gland is head and uncinate process); every other triangle goes to the body and tail. That gives 2,005 and 2,885 of FJ1895's 4,890 triangles. The surface is not reshaped or capped, so each part is open along the cut. The neck is split between the two, and the source has no boundary between body and tail.
- **Splenic artery** uses the IS-A trunk. Its PART-OF concept also includes the pancreatic branches (shown as their own group) and the left gastro-epiploic artery (omitted).
- **Inferior pancreaticoduodenal artery** (FMA14805) uses its IS-A element FJ3446; its anterior and posterior branches come from their own concepts.
- Omitted: stomach, aorta, inferior vena cava, liver, common bile duct (no mesh in the mirror), accessory pancreatic duct, smaller vessels, lymph nodes and body context. The superior mesenteric vessels extend well below the pancreas because their full trunks are included.

## Transformation and orientation

Vertices are recentred on the selection's source bounding box and uniformly scaled by `0.016`; axes change from source `[x, y, z]` to display `[x, z, -y]` (source +x patient left, −y anterior, +z superior). Anterior view looks along display −Z, posterior along +Z, and the inferior view looks up from below and slightly in front. In the anterior view the duodenum is on the viewer's left and the spleen on the right, as expected. No anatomical reshaping or decimation is performed.

## Reproduce

```sh
bun run prepare:model   # downloads missing OBJs into .asset-cache/objs, verifies, writes the GLB and manifest
bun run verify:model    # checks the GLB hash, structure IDs, element lists and geometry
```
