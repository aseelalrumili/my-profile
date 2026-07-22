import {
  getArray,
  setArray,
  getObject,
  setObject,
  nextId,
  requireAuth,
  uuid,
  json,
  notFound,
  unauthorized,
  badRequest,
  serverError,
  text,
  binary,
  parseMultipart,
  getMimeType,
  hashPassword,
  verifyPassword,
  signToken,
  KEYS,
  getUploadsStore,
  FunctionResponse,
  initBlobs,
} from './_lib';

function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function parseJsonBody(body: string | null): any {
  if (!body) return {};
  return JSON.parse(body);
}

function parseFormBody(body: string | null, isBase64: boolean, contentType: string): Record<string, string> {
  if (!body) return {};
  let decoded = body;
  if (isBase64) {
    decoded = Buffer.from(body, 'base64').toString('utf-8');
  }
  const params = new URLSearchParams(decoded);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

function getSegments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function isNumericId(segment: string): boolean {
  return /^\d+$/.test(segment);
}

const DEFAULT_PROFILE = {
  id: 1,
  fullName: '',
  jobTitle: '',
  heroEffect: 'Parallax',
  themeColor: '#c9a84c',
  statsProjects: 0,
  statsExperience: 0,
  statsClients: 0,
  statsAwards: 0,
};

async function handleSubCrud(
  segments: string[],
  method: string,
  key: string,
  event: any
): Promise<FunctionResponse | null> {
  const basePath = `/${segments[0]}/${segments[1]}`;

  if (segments.length === 2) {
    if (method === 'GET') {
      return json(await getArray(key));
    }
    if (method === 'POST') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      let item: any;
      const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
      if (ct.includes('multipart/form-data')) {
        const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
        item = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
          acc[f.name] = f.value;
          return acc;
        }, {} as any);
      } else {
        item = parseJsonBody(event.body);
      }
      item.id = nextId(await getArray(key));
      const arr = [...await getArray(key), item];
      await setArray(key, arr);
      return json(item, 201);
    }
    return null;
  }

  if (segments.length === 3) {
    const id = parseInt(segments[2], 10);
    if (isNaN(id)) return null;
    const arr = await getArray<any>(key);

    if (method === 'GET') {
      const found = arr.find((i: any) => i.id === id);
      if (!found) return notFound('Not found');
      return json(found);
    }
    if (method === 'PUT') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      const idx = arr.findIndex((i: any) => i.id === id);
      if (idx === -1) return notFound('Not found');
      let body: any;
      const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
      if (ct.includes('multipart/form-data')) {
        const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
        body = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
          acc[f.name] = f.value;
          return acc;
        }, {} as any);
        const files = fields.filter((f: any) => f.filename);
        const uploads = getUploadsStore();
        for (const file of files) {
          const key2 = `${uuid()}-${file.filename}`;
          uploads.set(key2, { data: file.data, contentType: file.contentType || 'application/octet-stream' });
          if (file.name && body) {
            body[file.name + 'Url'] = `/.netlify/functions/get-upload/${key2}`;
          }
        }
      } else {
        body = parseJsonBody(event.body);
      }
      arr[idx] = { ...arr[idx], ...body, id };
      await setArray(key, arr);
      return json(arr[idx]);
    }
    if (method === 'DELETE') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      const filtered = arr.filter((i: any) => i.id !== id);
      if (filtered.length === arr.length) return notFound('Not found');
      await setArray(key, filtered);
      return json({ success: true });
    }
  }

  return null;
}

export const handler = async (event: any, context: any): Promise<FunctionResponse> => {
  initBlobs(event);
  try {
    const method = event.httpMethod || 'GET';
    const rawPath = event.path || '/';
    const path = rawPath.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '') || '/';
    const segments = getSegments(path);

    if (segments.length === 0 || (segments.length === 1 && segments[0] === '')) {
      return json({ message: 'API is running' });
    }

    const route = segments.join('/');

    if (method === 'POST' && route === 'auth/login') {
      const body = parseJsonBody(event.body);
      const { username, password } = body;
      if (!username || !password) return badRequest('Username and password required');
      const admin = await getObject<any>('auth:admin');
      if (!admin) return badRequest('Admin not configured');
      if (admin.username !== username) return badRequest('Invalid credentials');
      const valid = await verifyPassword(password, admin.passwordHash);
      if (!valid) return badRequest('Invalid credentials');
      const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      return json({ token: signToken(username, admin.id), username, expiration });
    }

    if (method === 'POST' && route === 'auth-setup') {
      const existing = await getObject<any>('auth:admin');
      if (existing) return json({ message: 'Admin already configured' }, 409);
      const body = parseJsonBody(event.body);
      const { username, password } = body;
      if (!username || !password) return badRequest('Username and password required');
      const passwordHash = await hashPassword(password);
      await setObject('auth:admin', { id: 1, username, passwordHash });
      return json({ message: 'Admin configured successfully' }, 201);
    }

    if (method === 'POST' && route === 'auth/update') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      const body = parseJsonBody(event.body);
      const { username, password } = body;
      if (!username || !password) return badRequest('Username and password required');
      const passwordHash = await hashPassword(password);
      const existing = await getObject<any>('auth:admin');
      const id = existing?.id || 1;
      await setObject('auth:admin', { id, username, passwordHash });
      const newToken = signToken(username, id);
      return json({ message: 'Admin updated successfully', token: newToken, username });
    }

    if (method === 'GET' && route === 'profile/all') {
      const profile = await getObject<any>('profile') || { ...DEFAULT_PROFILE };
      const socialLinks = await getArray<any>(KEYS.SOCIAL_LINKS);
      const skills = await getArray<any>(KEYS.SKILLS);
      const experience = await getArray<any>(KEYS.EXPERIENCE);
      const education = await getArray<any>(KEYS.EDUCATION);
      const projects = await getArray<any>(KEYS.PROJECTS);
      const certifications = await getArray<any>(KEYS.CERTIFICATIONS);
      const blogPosts = await getArray<any>(KEYS.BLOG_POSTS);
      const testimonials = await getArray<any>(KEYS.TESTIMONIALS);
      const reviews = await getArray<any>(KEYS.REVIEWS);
      const settings = await getObject<any>('settings') || {};
      return json({
        profile,
        socialLinks,
        skills,
        experience,
        education,
        projects,
        certifications,
        blogPosts,
        testimonials,
        reviews,
        settings,
      });
    }

    if (route === 'profile' && segments.length === 1) {
      if (method === 'GET') {
        const profile = await getObject<any>('profile');
        return json(profile || DEFAULT_PROFILE);
      }
      if (method === 'PUT') {
        const auth = requireAuth(event);
        if (!auth) return unauthorized();
        const existing = await getObject<any>('profile') || { ...DEFAULT_PROFILE };
        let body: any;
        const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
        if (ct.includes('multipart/form-data')) {
          const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
          body = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
            acc[f.name] = f.value;
            return acc;
          }, {} as any);
          const files = fields.filter((f: any) => f.filename);
          const uploads = getUploadsStore();
          for (const file of files) {
            const fileKey = `${uuid()}-${file.filename}`;
            uploads.set(fileKey, { data: file.data, contentType: file.contentType || 'application/octet-stream' });
            if (file.name === 'Photo') {
              body.photoUrl = `/.netlify/functions/get-upload/${fileKey}`;
            } else if (file.name === 'Resume') {
              body.resumeUrl = `/.netlify/functions/get-upload/${fileKey}`;
            }
          }
        } else {
          body = parseJsonBody(event.body);
        }
        if (body.statsProjects !== undefined) body.statsProjects = parseInt(body.statsProjects, 10) || 0;
        if (body.statsExperience !== undefined) body.statsExperience = parseInt(body.statsExperience, 10) || 0;
        if (body.statsClients !== undefined) body.statsClients = parseInt(body.statsClients, 10) || 0;
        if (body.statsAwards !== undefined) body.statsAwards = parseInt(body.statsAwards, 10) || 0;
        const updated = { ...existing, ...body };
        await setObject('profile', updated);
        return json(updated);
      }
    }

    if (segments[0] === 'profile' && segments[1] === 'social') {
      const subResult = await handleSubCrud(segments, method, KEYS.SOCIAL_LINKS, event);
      if (subResult) return subResult;
    }

    if (segments[0] === 'profile' && segments[1] === 'skills') {
      const subResult = await handleSubCrud(segments, method, KEYS.SKILLS, event);
      if (subResult) return subResult;
    }

    if (segments[0] === 'profile' && segments[1] === 'experience') {
      const subResult = await handleSubCrud(segments, method, KEYS.EXPERIENCE, event);
      if (subResult) return subResult;
    }

    if (segments[0] === 'profile' && segments[1] === 'education') {
      const subResult = await handleSubCrud(segments, method, KEYS.EDUCATION, event);
      if (subResult) return subResult;
    }

    if (segments[0] === 'projects' && segments.length >= 1) {
      if (segments.length === 1) {
        if (method === 'GET') {
          return json(await getArray<any>(KEYS.PROJECTS));
        }
        if (method === 'POST') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
          if (ct.includes('multipart/form-data')) {
            const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
            const textField = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
              acc[f.name] = f.value;
              return acc;
            }, {} as any);
            const files = fields.filter((f: any) => f.filename);
            const uploads = getUploadsStore();
            const media: any[] = [];
            const mediaIdCounter = { value: Date.now() };
            for (const file of files) {
              const fileKey = `${uuid()}-${file.filename}`;
              uploads.set(fileKey, { data: file.data, contentType: file.contentType || 'application/octet-stream' });
              media.push({
                id: mediaIdCounter.value++,
                mediaType: 'Image',
                url: `/.netlify/functions/get-upload/${fileKey}`,
                fileName: file.filename,
                isPrimary: media.length === 0,
              });
            }
            const project = {
              id: nextId(await getArray<any>(KEYS.PROJECTS)),
              ...textField,
              media,
            };
            if (textField.techStack && typeof textField.techStack === 'string') {
              project.techStack = textField.techStack;
            }
            const arr = [...await getArray<any>(KEYS.PROJECTS), project];
            await setArray(KEYS.PROJECTS, arr);
            return json(project, 201);
          } else {
            const body = parseJsonBody(event.body);
            body.id = nextId(await getArray<any>(KEYS.PROJECTS));
            if (!body.media) body.media = [];
            const arr = [...await getArray<any>(KEYS.PROJECTS), body];
            await setArray(KEYS.PROJECTS, arr);
            return json(body, 201);
          }
        }
      }

      if (segments.length === 2 && segments[1] === 'media') {
        return notFound('Use DELETE /projects/media/:mediaId');
      }

      if (segments.length === 3 && segments[1] === 'media') {
        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const mediaId = parseInt(segments[2], 10);
          if (isNaN(mediaId)) return badRequest('Invalid media ID');
          const projects = await getArray<any>(KEYS.PROJECTS);
          let found = false;
          for (const proj of projects) {
            if (proj.media && Array.isArray(proj.media)) {
              const before = proj.media.length;
              proj.media = proj.media.filter((m: any) => m.id !== mediaId);
              if (proj.media.length < before) {
                found = true;
                break;
              }
            }
          }
          if (!found) return notFound('Media not found');
          await setArray(KEYS.PROJECTS, projects);
          return json({ success: true });
        }
      }

      if (segments.length === 2 && isNumericId(segments[1])) {
        const id = parseInt(segments[1], 10);
        const arr = await getArray<any>(KEYS.PROJECTS);

        if (method === 'GET') {
          const found = arr.find((p: any) => p.id === id);
          if (!found) return notFound('Project not found');
          return json(found);
        }
        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const idx = arr.findIndex((p: any) => p.id === id);
          if (idx === -1) return notFound('Project not found');
          const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
          if (ct.includes('multipart/form-data')) {
            const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
            const textField = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
              acc[f.name] = f.value;
              return acc;
            }, {} as any);
            const files = fields.filter((f: any) => f.filename);
            const uploads = getUploadsStore();
            const existingMedia = arr[idx].media || [];
            const newMedia = [...existingMedia];
            let mediaIdCounter = Date.now();
            for (const file of files) {
              const fileKey = `${uuid()}-${file.filename}`;
              uploads.set(fileKey, { data: file.data, contentType: file.contentType || 'application/octet-stream' });
              newMedia.push({
                id: mediaIdCounter++,
                mediaType: 'Image',
                url: `/.netlify/functions/get-upload/${fileKey}`,
                fileName: file.filename,
                isPrimary: newMedia.length === 0,
              });
            }
            arr[idx] = { ...arr[idx], ...textField, id, media: newMedia };
          } else {
            const body = parseJsonBody(event.body);
            arr[idx] = { ...arr[idx], ...body, id };
          }
          await setArray(KEYS.PROJECTS, arr);
          return json(arr[idx]);
        }
        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const filtered = arr.filter((p: any) => p.id !== id);
          if (filtered.length === arr.length) return notFound('Project not found');
          await setArray(KEYS.PROJECTS, filtered);
          return json({ success: true });
        }
      }
    }

    if (segments[0] === 'certifications') {
      if (segments.length === 1) {
        if (method === 'GET') {
          return json(await getArray<any>(KEYS.CERTIFICATIONS));
        }
        if (method === 'POST') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
          if (ct.includes('multipart/form-data')) {
            const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
            const textField = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
              acc[f.name] = f.value;
              return acc;
            }, {} as any);
            const files = fields.filter((f: any) => f.filename);
            const uploads = getUploadsStore();
            for (const file of files) {
              const fileKey = `${uuid()}-${file.filename}`;
              uploads.set(fileKey, { data: file.data, contentType: file.contentType || 'application/octet-stream' });
              const fieldUrl = `${file.name}Url`;
              textField[fieldUrl] = `/.netlify/functions/get-upload/${fileKey}`;
            }
            const cert = {
              id: nextId(await getArray<any>(KEYS.CERTIFICATIONS)),
              ...textField,
            };
            const arr = [...await getArray<any>(KEYS.CERTIFICATIONS), cert];
            await setArray(KEYS.CERTIFICATIONS, arr);
            return json(cert, 201);
          } else {
            const body = parseJsonBody(event.body);
            body.id = nextId(await getArray<any>(KEYS.CERTIFICATIONS));
            const arr = [...await getArray<any>(KEYS.CERTIFICATIONS), body];
            await setArray(KEYS.CERTIFICATIONS, arr);
            return json(body, 201);
          }
        }
      }

      if (segments.length === 2 && isNumericId(segments[1])) {
        const id = parseInt(segments[1], 10);
        const arr = await getArray<any>(KEYS.CERTIFICATIONS);

        if (method === 'GET') {
          const found = arr.find((c: any) => c.id === id);
          if (!found) return notFound('Certification not found');
          return json(found);
        }
        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const idx = arr.findIndex((c: any) => c.id === id);
          if (idx === -1) return notFound('Certification not found');
          const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
          if (ct.includes('multipart/form-data')) {
            const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
            const textField = fields.filter((f: any) => !f.filename).reduce((acc: any, f: any) => {
              acc[f.name] = f.value;
              return acc;
            }, {} as any);
            const files = fields.filter((f: any) => f.filename);
            const uploads = getUploadsStore();
            for (const file of files) {
              const fileKey = `${uuid()}-${file.filename}`;
              uploads.set(fileKey, { data: file.data, contentType: file.contentType || 'application/octet-stream' });
              const fieldUrl = `${file.name}Url`;
              textField[fieldUrl] = `/.netlify/functions/get-upload/${fileKey}`;
            }
            arr[idx] = { ...arr[idx], ...textField, id };
          } else {
            const body = parseJsonBody(event.body);
            arr[idx] = { ...arr[idx], ...body, id };
          }
          await setArray(KEYS.CERTIFICATIONS, arr);
          return json(arr[idx]);
        }
        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const filtered = arr.filter((c: any) => c.id !== id);
          if (filtered.length === arr.length) return notFound('Certification not found');
          await setArray(KEYS.CERTIFICATIONS, filtered);
          return json({ success: true });
        }
      }
    }

    if (segments[0] === 'blog') {
      if (segments.length === 1) {
        if (method === 'GET') {
          const posts = await getArray<any>(KEYS.BLOG_POSTS);
          posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return json(posts);
        }
        if (method === 'POST') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const body = parseJsonBody(event.body);
          const now = new Date().toISOString();
          body.id = nextId(await getArray<any>(KEYS.BLOG_POSTS));
          body.createdAt = body.createdAt || now;
          body.updatedAt = now;
          const arr = [...await getArray<any>(KEYS.BLOG_POSTS), body];
          await setArray(KEYS.BLOG_POSTS, arr);
          return json(body, 201);
        }
      }

      if (segments.length === 1 && segments[0] === 'blog' && method === 'GET' && event.queryStringParameters?.slug) {
        const slug = event.queryStringParameters.slug;
        const posts = await getArray<any>(KEYS.BLOG_POSTS);
        const found = posts.find((p: any) => p.slug === slug);
        if (!found) return notFound('Post not found');
        return json(found);
      }

      if (segments.length === 2 && segments[1] === 'comments' && method === 'GET') {
        const auth = requireAuth(event);
        if (!auth) return unauthorized();
        const comments = await getArray<any>(KEYS.BLOG_COMMENTS);
        return json(comments);
      }

      if (segments.length === 3 && segments[1] === 'comments' && segments[2] === 'all' && method === 'GET') {
        const auth = requireAuth(event);
        if (!auth) return unauthorized();
        const comments = await getArray<any>(KEYS.BLOG_COMMENTS);
        return json(comments);
      }

      if (segments.length === 4 && segments[1] === 'comments' && isNumericId(segments[2]) && segments[3] === 'approve') {
        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const commentId = parseInt(segments[2], 10);
          const comments = await getArray<any>(KEYS.BLOG_COMMENTS);
          const idx = comments.findIndex((c: any) => c.id === commentId);
          if (idx === -1) return notFound('Comment not found');
          comments[idx].isApproved = true;
          await setArray(KEYS.BLOG_COMMENTS, comments);
          return json(comments[idx]);
        }
      }

      if (segments.length === 3 && segments[1] === 'comments' && isNumericId(segments[2])) {
        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const commentId = parseInt(segments[2], 10);
          const comments = await getArray<any>(KEYS.BLOG_COMMENTS);
          const filtered = comments.filter((c: any) => c.id !== commentId);
          if (filtered.length === comments.length) return notFound('Comment not found');
          await setArray(KEYS.BLOG_COMMENTS, filtered);
          return json({ success: true });
        }
      }

      if (segments.length === 3 && segments[2] === 'comments') {
        const postId = parseInt(segments[1], 10);
        if (isNaN(postId)) return badRequest('Invalid post ID');

        if (method === 'GET') {
          const comments = await getArray<any>(KEYS.BLOG_COMMENTS);
          const approved = comments.filter((c: any) => c.blogPostId === postId && c.isApproved);
          return json(approved);
        }
        if (method === 'POST') {
          const body = parseJsonBody(event.body);
          const now = new Date().toISOString();
          body.id = nextId(await getArray<any>(KEYS.BLOG_COMMENTS));
          body.blogPostId = postId;
          body.isApproved = false;
          body.createdAt = now;
          const arr = [...await getArray<any>(KEYS.BLOG_COMMENTS), body];
          await setArray(KEYS.BLOG_COMMENTS, arr);
          return json(body, 201);
        }
      }

      if (segments.length === 2 && isNumericId(segments[1])) {
        const id = parseInt(segments[1], 10);
        const posts = await getArray<any>(KEYS.BLOG_POSTS);

        if (method === 'GET') {
          const found = posts.find((p: any) => p.id === id);
          if (!found) {
            const foundBySlug = posts.find((p: any) => p.slug === segments[1]);
            if (foundBySlug) return json(foundBySlug);
            return notFound('Post not found');
          }
          return json(found);
        }
        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const idx = posts.findIndex((p: any) => p.id === id);
          if (idx === -1) return notFound('Post not found');
          const body = parseJsonBody(event.body);
          body.updatedAt = new Date().toISOString();
          posts[idx] = { ...posts[idx], ...body, id };
          await setArray(KEYS.BLOG_POSTS, posts);
          return json(posts[idx]);
        }
        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const filtered = posts.filter((p: any) => p.id !== id);
          if (filtered.length === posts.length) return notFound('Post not found');
          await setArray(KEYS.BLOG_POSTS, filtered);
          return json({ success: true });
        }
      }

      if (segments.length === 2 && !isNumericId(segments[1])) {
        if (method === 'GET') {
          const slug = segments[1];
          const posts = await getArray<any>(KEYS.BLOG_POSTS);
          const found = posts.find((p: any) => p.slug === slug);
          if (!found) return notFound('Post not found');
          return json(found);
        }
      }
    }

    if (segments[0] === 'testimonials') {
      if (segments.length === 1) {
        if (method === 'GET') {
          return json(await getArray<any>(KEYS.TESTIMONIALS));
        }
        if (method === 'POST') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const body = parseJsonBody(event.body);
          body.id = nextId(await getArray<any>(KEYS.TESTIMONIALS));
          const arr = [...await getArray<any>(KEYS.TESTIMONIALS), body];
          await setArray(KEYS.TESTIMONIALS, arr);
          return json(body, 201);
        }
      } else {
        const subResult = await handleSubCrud(segments, method, KEYS.TESTIMONIALS, event);
        if (subResult) return subResult;
      }
    }

    if (segments[0] === 'reviews') {
      if (segments.length === 1) {
        if (method === 'GET') {
          const reviews = await getArray<any>(KEYS.REVIEWS);
          const approved = reviews.filter((r: any) => r.isApproved);
          approved.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return json(approved);
        }
        if (method === 'POST') {
          const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
          let name = '', ratingStr = '', comment = '', avatarUrl = '';
          if (ct.includes('multipart/form-data')) {
            const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
            for (const f of fields) {
              if (f.fieldName === 'name') name = f.data.toString('utf8');
              else if (f.fieldName === 'rating') ratingStr = f.data.toString('utf8');
              else if (f.fieldName === 'comment') comment = f.data.toString('utf8');
              else if (f.fieldName === 'avatar' && f.filename) {
                const uploads = getUploadsStore();
                const key = `${uuid()}-${f.filename}`;
                uploads.set(key, { data: f.data, contentType: f.contentType || getMimeType(f.filename) });
                avatarUrl = `/.netlify/functions/get-upload/${key}`;
              }
            }
          } else {
            const body = parseJsonBody(event.body);
            name = body.name || '';
            ratingStr = String(body.rating || '');
            comment = body.comment || '';
          }
          if (!name || !ratingStr || !comment) {
            return badRequest('name, rating, and comment are required');
          }
          const rating = parseInt(ratingStr, 10);
          if (isNaN(rating) || rating < 1 || rating > 5) {
            return badRequest('rating must be between 1 and 5');
          }
          const review = {
            id: nextId(await getArray<any>(KEYS.REVIEWS)),
            name,
            rating,
            comment,
            avatarUrl: avatarUrl || undefined,
            isApproved: false,
            createdAt: new Date().toISOString(),
          };
          const arr = [...await getArray<any>(KEYS.REVIEWS), review];
          await setArray(KEYS.REVIEWS, arr);
          return json(review, 201);
        }
      }

      if (segments.length === 2 && segments[1] === 'all' && method === 'GET') {
        const auth = requireAuth(event);
        if (!auth) return unauthorized();
        const reviews = await getArray<any>(KEYS.REVIEWS);
        reviews.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return json(reviews);
      }

      if (segments.length === 2 && segments[1] === 'stats' && method === 'GET') {
        const reviews = await getArray<any>(KEYS.REVIEWS);
        const approved = reviews.filter((r: any) => r.isApproved);
        const total = approved.length;
        const avg = total > 0 ? approved.reduce((sum: number, r: any) => sum + r.rating, 0) / total : 0;
        return json({ total, average: Math.round(avg * 10) / 10 });
      }

      if (segments.length === 2 && isNumericId(segments[1])) {
        const id = parseInt(segments[1], 10);

        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const body = parseJsonBody(event.body);
          const reviews = await getArray<any>(KEYS.REVIEWS);
          const idx = reviews.findIndex((r: any) => r.id === id);
          if (idx === -1) return notFound('Review not found');
          reviews[idx] = { ...reviews[idx], ...body, id };
          await setArray(KEYS.REVIEWS, reviews);
          return json(reviews[idx]);
        }

        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const reviews = await getArray<any>(KEYS.REVIEWS);
          const filtered = reviews.filter((r: any) => r.id !== id);
          if (filtered.length === reviews.length) return notFound('Review not found');
          await setArray(KEYS.REVIEWS, filtered);
          return json({ success: true });
        }
      }

      if (segments.length === 3 && isNumericId(segments[1]) && segments[2] === 'approve') {
        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const id = parseInt(segments[1], 10);
          const reviews = await getArray<any>(KEYS.REVIEWS);
          const idx = reviews.findIndex((r: any) => r.id === id);
          if (idx === -1) return notFound('Review not found');
          reviews[idx].isApproved = true;
          await setArray(KEYS.REVIEWS, reviews);
          return json(reviews[idx]);
        }
      }
    }

    if (segments[0] === 'messages') {
      if (segments.length === 1) {
        if (method === 'GET') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          return json(await getArray<any>(KEYS.MESSAGES));
        }
        if (method === 'POST') {
          const body = parseJsonBody(event.body);
          body.id = nextId(await getArray<any>(KEYS.MESSAGES));
          body.isRead = false;
          body.createdAt = new Date().toISOString();
          const arr = [...await getArray<any>(KEYS.MESSAGES), body];
          await setArray(KEYS.MESSAGES, arr);
          return json(body, 201);
        }
      }

      if (segments.length === 3 && isNumericId(segments[1]) && segments[2] === 'read') {
        if (method === 'PUT') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const id = parseInt(segments[1], 10);
          const messages = await getArray<any>(KEYS.MESSAGES);
          const idx = messages.findIndex((m: any) => m.id === id);
          if (idx === -1) return notFound('Message not found');
          messages[idx].isRead = true;
          await setArray(KEYS.MESSAGES, messages);
          return json(messages[idx]);
        }
      }

      if (segments.length === 2 && isNumericId(segments[1])) {
        if (method === 'DELETE') {
          const auth = requireAuth(event);
          if (!auth) return unauthorized();
          const id = parseInt(segments[1], 10);
          const messages = await getArray<any>(KEYS.MESSAGES);
          const filtered = messages.filter((m: any) => m.id !== id);
          if (filtered.length === messages.length) return notFound('Message not found');
          await setArray(KEYS.MESSAGES, filtered);
          return json({ success: true });
        }
      }
    }

    if (segments[0] === 'visitors') {
      if (segments.length === 2 && segments[1] === 'track' && method === 'POST') {
        const body = parseJsonBody(event.body);
        const visitor = {
          id: nextId(await getArray<any>(KEYS.VISITORS)),
          ipAddress: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || '',
          userAgent: event.headers['user-agent'] || '',
          page: body.page || '',
          visitedAt: new Date().toISOString(),
        };
        const arr = [...await getArray<any>(KEYS.VISITORS), visitor];
        await setArray(KEYS.VISITORS, arr);
        return json({ success: true }, 201);
      }

      if (segments.length === 2 && segments[1] === 'analytics' && method === 'GET') {
        const auth = requireAuth(event);
        if (!auth) return unauthorized();
        const visitors = await getArray<any>(KEYS.VISITORS);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const totalCount = visitors.length;
        const todayCount = visitors.filter((v: any) => new Date(v.visitedAt).getTime() >= today).length;
        const weekCount = visitors.filter((v: any) => new Date(v.visitedAt).getTime() >= weekAgo).length;
        const monthCount = visitors.filter((v: any) => new Date(v.visitedAt).getTime() >= monthStart).length;

        const pageCounts: Record<string, number> = {};
        for (const v of visitors) {
          const page = v.page || '/';
          pageCounts[page] = (pageCounts[page] || 0) + 1;
        }
        const topPages = Object.entries(pageCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([page, count]) => ({ page, count }));

        const dailyVisits: { date: string; count: number }[] = [];
        for (let i = 29; i >= 0; i--) {
          const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i).getTime();
          const dayEnd = dayStart + 24 * 60 * 60 * 1000;
          const count = visitors.filter((v: any) => {
            const t = new Date(v.visitedAt).getTime();
            return t >= dayStart && t < dayEnd;
          }).length;
          const dateStr = new Date(dayStart).toISOString().split('T')[0];
          dailyVisits.push({ date: dateStr, count });
        }

        return json({
          totalCount,
          todayCount,
          weekCount,
          monthCount,
          topPages,
          dailyVisits,
        });
      }

      if (segments.length === 1 && method === 'GET') {
        const auth = requireAuth(event);
        if (!auth) return unauthorized();
        return json(await getArray<any>(KEYS.VISITORS));
      }
    }

    if (segments[0] === 'upload' && method === 'POST') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
      if (!ct.includes('multipart/form-data')) {
        return badRequest('multipart/form-data required');
      }
      const fields = parseMultipart(ct, event.body || '', event.isBase64Encoded || false);
      const fileFields = fields.filter((f: any) => f.filename);
      if (fileFields.length === 0) return badRequest('No file uploaded');
      const file = fileFields[0];
      const fileData = file.data;
      if (!fileData || fileData.length === 0) return badRequest('Empty file');
      const maxSize = 50 * 1024 * 1024;
      if (fileData.length > maxSize) return badRequest('File too large (max 50MB)');
      const uploads = getUploadsStore();
      const key = `${uuid()}-${file.filename}`;
      uploads.set(key, { data: fileData, contentType: file.contentType || getMimeType(file.filename) });
      return json({ url: `/.netlify/functions/get-upload/${key}` }, 201);
    }

    if (segments[0] === 'import' && method === 'POST') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      const body = parseJsonBody(event.body);
      const mapping: Record<string, string> = {
        socialLinks: KEYS.SOCIAL_LINKS,
        skills: KEYS.SKILLS,
        experience: KEYS.EXPERIENCE,
        education: KEYS.EDUCATION,
        projects: KEYS.PROJECTS,
        certifications: KEYS.CERTIFICATIONS,
        blogPosts: KEYS.BLOG_POSTS,
        testimonials: KEYS.TESTIMONIALS,
        reviews: KEYS.REVIEWS,
        messages: KEYS.MESSAGES,
        visitors: KEYS.VISITORS,
        blogComments: KEYS.BLOG_COMMENTS,
      };
      if (body.profile) {
        await setObject('profile', body.profile);
      }
      if (body.settings) {
        await setObject('settings', body.settings);
      }
      for (const [field, key] of Object.entries(mapping)) {
        if (body[field] && Array.isArray(body[field])) {
          await setArray(key, body[field]);
        }
      }
      return json({ success: true, message: 'Data imported successfully' });
    }

    if (segments[0] === 'settings' && method === 'GET') {
      return json(await getObject('settings') || {});
    }

    if (segments[0] === 'settings' && method === 'PUT') {
      const auth = requireAuth(event);
      if (!auth) return unauthorized();
      const body = parseJsonBody(event.body);
      await setObject('settings', body);
      return json(body);
    }

    return notFound('Route not found');
  } catch (err: any) {
    console.error('API Error:', err);
    return serverError(err.message || 'Internal server error');
  }
};
