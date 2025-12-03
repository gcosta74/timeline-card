import en from "./locales/en.json";
import de from "./locales/de.json";
import styles from "./timeline-card.css";

import { TranslationEngine } from "./translation-engine.js";
import { relativeTime, formatAbsoluteTime } from "./time-engine.js";

import { fetchHistory } from "./history-fetch.js";
import { transformHistory } from "./history-transform.js";
import { filterHistory } from "./history-filter.js";

const translations = { en, de };

class TimelineCard extends HTMLElement {
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("Please define 'entities' as a list.");
    }

    // Normalize entities: strings → objects
    // Allows using either:
    //  - "sensor.door"
    //  - { entity: "sensor.door", name: "...", ... }
    this.entities = config.entities.map((e) => {
      if (typeof e === "string") {
        return { entity: e };
      }
      return e;
    });

    // Maximum number of events to display
    this.limit = config.limit;

    // Time range (in hours) to request from HA history API
    this.hours = config.hours;

    // Optional card title
    this.title = typeof config.title === "string" ? config.title : "";

    // Use localized relative time ("x minutes ago") instead of absolute timestamp
    this.relativeTimeEnabled = config.relative_time ?? false;

    // Show or hide the entity state
    this.showStates = config.show_states ?? true;

    // Show or hide the entity name
    this.showNames = config.show_names ?? true;    

    // Show or hide the entity icon
    this.showIcons = config.show_icons ?? true;       

    // Internal state
    this.items = [];
    this.loaded = false;
    this.config = config;
  }

  set hass(hass) {
    this.hassInst = hass;

    // Only run initialization once
    if (!this.loaded) {
      this.loaded = true;

      // Determine language:
      // 1) Explicit language in YAML config
      // 2) HA UI language
      // 3) Browser language
      // 4) Fallback → "en"
      const yamlLang = this.config.language;
      const haLang = hass?.locale?.language;
      const browserLang = navigator.language;

      this.language = yamlLang || haLang || browserLang || "en";

      // Load JSON translation file and then fetch history data
      this.i18n = new TranslationEngine(translations);

      this.i18n.load(this.language).then(() => {
        this.languageCode = this.language.toLowerCase().substring(0, 2);
        this.loadHistory();
      });
    }
  }

  // ------------------------------------
  // LOAD HISTORY
  // ------------------------------------
  // Fetches entity history from Home Assistant:
  //  - Time range based on this.hours
  //  - Filters by configured entities
  //  - Flattens history into a simple timeline array
  //  - Applies state localization, icon mapping, and filters
  async loadHistory() {
    const raw = await fetchHistory(this.hassInst, this.entities, this.hours);
    const flat = transformHistory(raw, this.entities, this.hassInst.states, this.i18n);
    this.items = filterHistory(flat, this.entities, this.limit);
    this.render();
  }

  // ------------------------------------
  // RENDER CARD
  // ------------------------------------
  // Renders the timeline with alternating left/right event boxes,
  // a central vertical gradient line and a glowing dot per row.
  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });

    // Empty state: no items in selected time range
    if (!this.items.length) {
      root.innerHTML = `
        <style>${styles}</style>
        <ha-card>
          <div style="padding:12px">Keine Ereignisse in diesem Zeitraum.</div>
        </ha-card>
      `;
      return;
    }

    const rows = this.items
      .map((item, index) => {
        const side = index % 2 === 0 ? "left" : "right";

        return `
          <div class="timeline-row">
            <div class="side left">
              ${
                side === "left"
                  ? `
                  <div class="event-box">
                    ${ this.showIcons
                        ? `<ha-icon icon="${item.icon}" style="color:${item.icon_color};"></ha-icon>` 
                        : `` 
                    }                        
                    <div class="text">
                      <div class="row">
                        ${ this.showNames
                            ? `<div class="name">(${item.name})</div>` 
                            : `` 
                        }                        
                        ${ this.showStates 
                            ? `<div class="state">(${item.state})</div>` 
                            : `` 
                        }
                      </div>
                      <div class="time">
                        ${ this.relativeTimeEnabled
                            ? relativeTime(item.time, this.i18n)
                            : formatAbsoluteTime(item.time, this.languageCode, this.i18n)
                        }
                      </div>
                    </div>
                  </div>
                `
                  : ""
              }
            </div>

            <div class="dot"></div>

            <div class="side right">
              ${
                side === "right"
                  ? `
                  <div class="event-box">
                    ${ this.showIcons
                        ? `<ha-icon icon="${item.icon}" style="color:${item.icon_color};"></ha-icon>` 
                        : `` 
                    }  
                    <div class="text">
                      <div class="row">
                        ${ this.showNames
                            ? `<div class="name">(${item.name})</div>` 
                            : `` 
                        }  
                        ${ this.showStates 
                            ? `<div class="state">(${item.state})</div>` 
                            : `` 
                        }
                      </div>
                      <div class="time">
                        ${ this.relativeTimeEnabled
                            ? relativeTime(item.time, this.i18n)
                            : formatAbsoluteTime(item.time, this.languageCode, this.i18n)
                        }
                      </div>
                    </div>
                  </div>
                `
                  : ""
              }
            </div>
          </div>
        `;
      })
      .join("");

    root.innerHTML = `
      <style>${styles}</style>

      <ha-card>
        ${this.title ? `<h1 class="card-title">${this.title}</h1>` : ""}
        <div class="wrapper">
          <div class="timeline-line"></div>
          ${rows}
        </div>
      </ha-card>
    `;
  }

  // Home Assistant uses this to estimate the card height
  getCardSize() {
    return this.limit || 3;
  }
}

customElements.define("timeline-card", TimelineCard);
