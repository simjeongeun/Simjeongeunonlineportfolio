# Create Online Portfolio

This is a code bundle for Create Online Portfolio. The original project is available at https://www.figma.com/design/nlIJwLsFfGYblJIE1xNIh9/Create-Online-Portfolio.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Images (Cloudinary)

Project images are served from [Cloudinary](https://cloudinary.com/). The frontend only needs the Cloudinary **cloud name** — API Key and API Secret are **never** used in the client and must never be committed to this repository.

### Setup

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Set `VITE_CLOUDINARY_CLOUD_NAME` to your Cloudinary cloud name in `.env.local`. `.env.local` is git-ignored.

### Adding images

Use the `cldImage` helper to build delivery URLs:

```ts
import { cldImage } from '@/app/lib/cloudinary';

const hero = cldImage('portfolio/dynamic-modular/hero');
const heroLg = cldImage('portfolio/dynamic-modular/hero', { width: 1600, crop: 'limit' });
```

The helper adds `f_auto,q_auto,dpr_auto` by default so Cloudinary serves the best format and quality for each device.

### Required `public_id`s

Upload the following assets to Cloudinary with these exact `public_id`s (upload to the matching folder path in the Media Library):

**`portfolio/dynamic-modular/`**

| `public_id` | Description |
| --- | --- |
| `hero` | Project hero image |
| `mask` | Mask illustration (Background section) |
| `target` | Target diagram |
| `concept-unit` | Concept — Unit elevation |
| `concept-module-rail` | Concept — Module & rail system |
| `unit-1` | Unit 1 — 실험실 UNIT |
| `unit-2` | Unit 2 — 연구실 UNIT |
| `unit-3` | Unit 3 — 다목적 UNIT |
| `unit-combines` | Unit combines overview |
| `floor-5` | Floor plan — 5F |
| `floor-6` | Floor plan — 6F |
| `floor-7` | Floor plan — 7F |
| `render-1` | 3D render — Research lab |
| `render-2` | 3D render — Lounge & community |
| `render-3` | 3D render — Bio exhibition |

### Security notes

- `.env*` files are git-ignored (except `.env.example`).
- Only the cloud name is exposed to the browser — that value is already part of every delivered image URL, so it is safe to ship.
- Keep your Cloudinary **API Key** and **API Secret** on trusted machines only. They are required for signed uploads and admin operations, neither of which this project performs on the client.
- If you ever add uploads from the app, do them through a small backend endpoint that signs requests with the API Secret on the server side; never ship the Secret to the browser.
