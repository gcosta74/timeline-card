export function filterHistory(items, entities, limit) {

  let filtered = items.filter(ev => {
    const cfg = entities.find(e => e.entity === ev.id);
    const include = cfg?.include_states;
    if (!include || !Array.isArray(include)) return true;
    return include.includes(ev.raw_state);
  });

  // Sort (newest first)
  filtered = filtered.sort((a, b) => b.time - a.time);

  // Apply limit
  return filtered.slice(0, limit);
}
