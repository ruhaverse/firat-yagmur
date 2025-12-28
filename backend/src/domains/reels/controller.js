const makeController = (deps) => {
  const db = deps.db;
  const makeFileUrl = deps.services.storage.makeFileUrl;
  const reelsService = (deps.services && deps.services.reelsService) ? deps.services.reelsService : require('./service')(deps);

  function sanitizeCaption(caption) {
    if (!caption || typeof caption !== 'string') return '';
    return caption.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim().slice(0, 2000);
  }

  async function getReels(req, res, next) {
    try {
      const { userId, limit = 50, offset = 0 } = req.query;
      const { reels, mediaRows } = await reelsService.getReels({ userId: userId || null, limit: Number(limit), offset: Number(offset) });
      const out = reels || [];
      if (out.length > 0) {
        const mediaByReel = {};
        for (const m of mediaRows) {
          if (!mediaByReel[m.reel_id]) mediaByReel[m.reel_id] = [];
          const url = m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url);
          mediaByReel[m.reel_id].push({ id: m.id, media_url: url, media_type: m.media_type, created_at: m.created_at });
        }
        for (const r of out) { r.media = mediaByReel[r.id] || []; r.profile_picture = r.profile_picture ? makeFileUrl(r.profile_picture) : null; }
      }
      res.json({ data: out });
    } catch (err) { next(err); }
  }

  async function getReelById(req, res, next) {
    try {
      const reelId = req.params.id;
      const result = await reelsService.getReelById(reelId);
      if (!result) return res.status(404).json({ error: 'Reel not found' });
      const reel = result.reel;
      reel.media = result.mediaRows.map(m => ({ id: m.id, media_url: m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url), media_type: m.media_type, created_at: m.created_at }));
      reel.profile_picture = reel.profile_picture ? makeFileUrl(reel.profile_picture) : null;
      res.json({ data: reel });
    } catch (err) { next(err); }
  }

  async function createReel(req, res, next) {
    try {
      const authUserId = req.user && req.user.id; if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });
      const userId = parseInt(authUserId, 10);
      const { caption = '', source = null } = req.body;
      const sanitizedCaption = sanitizeCaption(caption);
      const media = [];
      if (req.files && Array.isArray(req.files)) for (const f of req.files) media.push({ mediaPath: makeFileUrl(f.filename), mediaType: f.mimetype });
      const reel = await reelsService.createReel(userId, sanitizedCaption, source);
      if (source) reel.source = source;
      res.status(201).json({ data: { reel: reel, media } });
    } catch (err) { next(err); }
  }

  async function deleteReel(req, res, next) {
    try {
      const reelId = req.params.id; const userId = req.user.id;
      const checkRes = await reelsService.getReelById(reelId);
      if (!checkRes) return res.status(404).json({ error: 'Reel not found' });
      if (checkRes.reel.user_id !== userId) return res.status(403).json({ error: 'Not authorized to delete this reel' });
      await reelsService.deleteReel(reelId);
      res.json({ message: 'Reel deleted successfully' });
    } catch (err) { next(err); }
  }

  async function listSavedReelsByEmail(req, res, next) {
    try {
      const email = req.params.email; const page = parseInt(req.query.page,10) || 1; const limit = Math.min(parseInt(req.query.limit,10) || 50, 200);
      const offset = (page - 1) * limit;
      try {
        const { rows, mediaRows } = await reelsService.listSavedReelsByEmail(email, limit, offset);
        const out = rows || [];
        if (out.length > 0) {
          const mediaByReel = {};
          for (const m of mediaRows) { if (!mediaByReel[m.reel_id]) mediaByReel[m.reel_id] = []; const url = m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url); mediaByReel[m.reel_id].push({ id: m.id, media_url: url, media_type: m.media_type, created_at: m.created_at }); }
          for (const r of out) r.media = mediaByReel[r.id] || [];
        }
        res.json({ data: out });
      } catch (err) { if (err && err.message && err.message.includes('relation "saved_reels"')) return res.json({ data: [] }); throw err; }
    } catch (err) { next(err); }
  }

  return { getReels, getReelById, createReel, deleteReel, listSavedReelsByEmail };
};

module.exports = makeController;
