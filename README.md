# Create Online Portfolio

This is a code bundle for Create Online Portfolio. The original project is available at https://www.figma.com/design/nlIJwLsFfGYblJIE1xNIh9/Create-Online-Portfolio.

## Running the code

```bash
npm i
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and fill in values. `.env*` files are git-ignored.

```bash
cp .env.example .env.local
```

Required values are documented in `.env.example`. The same keys must be added to Vercel → Settings → Environment Variables for production builds.

---

## Images (Cloudinary)

The frontend only uses the Cloudinary **cloud name** + an **unsigned upload preset**. The Cloudinary **API Key** and **API Secret** are never shipped to the browser; they are server-only credentials.

### One-time Cloudinary setup

1. Create an **unsigned upload preset** at Cloudinary → Settings → Upload → Upload presets:
   - Signing mode: **Unsigned**
   - Folder: `portfolio/uploads`
   - Allowed formats: `jpg, png, webp, avif, svg`
   - Max file size: reasonable limit (e.g. 10 MB)
2. Copy the preset name into `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env.local` (and in Vercel).

### Using the helper

```ts
import { cldImage } from '@/app/lib/cloudinary';
const hero = cldImage('portfolio/dynamic-modular/hero');
```

`cldImage` appends `f_auto,q_auto,dpr_auto` by default.

### Pre-existing `public_id`s (`portfolio/dynamic-modular/`)

| `public_id` | Description |
| --- | --- |
| `hero` | Project hero image |
| `mask` | Mask illustration (Background) |
| `target` | Target diagram |
| `concept-unit` | Concept — unit elevation |
| `concept-module-rail` | Concept — module & rail system |
| `unit-1` · `unit-2` · `unit-3` | Unit diagrams |
| `unit-combines` | Unit combines overview |
| `floor-5` · `floor-6` · `floor-7` | Floor plans |
| `render-1` · `render-2` · `render-3` | 3D renders |

---

## Admin / editable content (Firebase)

Site content (hero text, name, bio, contact info, project images) is editable at runtime by an authenticated admin. Edits and uploaded images persist in Firestore and Cloudinary; page refreshes keep them.

### Architecture

- **Auth:** Firebase Authentication (email/password).
- **Content store:** Firestore single document `content/site` holds all editable strings and image URLs as key/value pairs.
- **Image uploads:** Client uploads directly to Cloudinary via the unsigned preset above; the returned `secure_url` is saved in Firestore.

### One-time Firebase setup

1. In Firebase Console → Authentication → Sign-in method, enable **Email/Password**.
2. Authentication → Users → Add user: create your admin account with a strong password. This replaces the old hardcoded `0000` password.
3. Firestore → Create database (production mode is fine).
4. Deploy the security rules from `firestore.rules` (via Firebase CLI `firebase deploy --only firestore:rules`, or paste them in the Firestore Rules editor).
5. In Google Cloud Console → APIs & Services → Credentials → edit your web API key → add HTTP referrer restrictions (your Vercel domain + `localhost`) so the key can only be used from your sites.

### Security notes

- **Never** commit Firebase or Cloudinary secrets. `.env*` is git-ignored (except `.env.example`).
- Firebase `apiKey` is a public identifier (not a secret). Its abuse potential is limited by:
  - Firestore security rules (`firestore.rules` — reads public, writes require auth).
  - HTTP referrer restrictions on the API key in Google Cloud Console.
- The Cloudinary unsigned upload preset allows anyone with the preset name to upload to the configured folder. Keep the folder scoped (`portfolio/uploads`) and restrict allowed formats; rotate the preset if it is abused.
- The old hardcoded admin password (`0000`) has been removed. There is no fallback — admin access requires a real Firebase user.

### Using editable components

```tsx
import { EditableText } from '@/app/components/admin/EditableText';
import { EditableImage } from '@/app/components/admin/EditableImage';

<EditableText contentKey="hero.title" defaultValue="PORTFOLIO" as="span" className="..." />
<EditableImage contentKey="projects.hero" defaultSrc={heroUrl} alt="Hero" className="..." />
```

- When no admin is signed in, the component renders the stored value (or the default if nothing stored).
- When an admin is signed in, text becomes click-to-edit and images show an upload button.
- Saves go straight to Firestore; all clients see the update via Firestore's `onSnapshot`.

### Currently editable fields

- `hero.title`, `hero.name`
- `about.name`, `about.bio`, `about.experience.year`, `about.experience.title`
- `contact.email`, `contact.phone`

Adding more is purely additive — wrap any text with `<EditableText contentKey="..." defaultValue="..." />` and it becomes editable in admin mode with persistence.
