import { getEntityName } from "./name-engine.js";
import { getCustomConfig } from "./config-engine.js";
import { getIconForEntity, getIconColor } from "./icon-engine.js";

export function transformHistory(historyData, entities, hassStates, i18n) {
  const { data, start } = historyData;

  let flat = [];

  data.forEach((entityList) => {
    entityList.forEach((entry) => {
      const st        = hassStates[entry.entity_id];
      const rawState  = entry.state;
      const cfg       = getCustomConfig(entry.entity_id, entities);
      const name      = getEntityName(entry.entity_id, entities, hassStates);

      flat.push({
        id: entry.entity_id,
        name,
        icon: getIconForEntity(st, cfg, rawState),
        icon_color: getIconColor(cfg, rawState),
        state: i18n.getLocalizedState(entry.entity_id, rawState, cfg),
        raw_state: rawState,
        time: new Date(entry.last_changed),
      });
    });
  });

  // Remove synthetic "range start"
  return flat.filter(e => e.time.getTime() !== start.getTime());
}
