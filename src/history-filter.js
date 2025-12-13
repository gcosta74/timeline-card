// ------------------------------------
// NEW: Collapse consecutive duplicates
// ------------------------------------
function collapseDuplicates(list, entities, globalConfig) {
  const collapsed = [];
  let lastKey = null;

  for (const item of list) {
    const cfg = entities.find((e) => e.entity === item.id) || {};

    // Entity → YAML → fallback to global
    const collapse =
      cfg.collapse_duplicates ?? globalConfig.collapse_duplicates ?? false;

    if (!collapse) {
      collapsed.push(item);
      continue;
    }

    // duplicate key = same entity + same raw_state
    const key = `${item.id}__${item.raw_state}`;
    if (key !== lastKey) {
      collapsed.push(item);
      lastKey = key;
    }
  }

  return collapsed;
}

export function filterHistory(items, entities, limit, globalConfig = {}) {
  let filtered = items.filter((ev) => {
    const cfg = entities.find((e) => e.entity === ev.id);
    const include = Array.isArray(cfg?.include_states)
      ? cfg.include_states
      : null;
    const exclude = Array.isArray(cfg?.exclude_states)
      ? cfg.exclude_states
      : null;

    if (include) return include.includes(ev.raw_state);
    if (exclude) return !exclude.includes(ev.raw_state);
    return true;
  });

  // Sort (newest first)
  filtered = filtered.sort((a, b) => b.time - a.time);

  // NEW: collapse duplicates
  filtered = collapseDuplicates(filtered, entities, globalConfig);

  // Apply limit
  return filtered.slice(0, limit);
}
