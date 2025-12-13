import { LitElement, html } from "lit";
import editorStyles from "./timeline-card-editor.css";

class TimelineCardGeneralSettings extends LitElement {
  static get properties() {
    return {
      config: { type: Object },
    };
  }

  render() {
    if (!this.config) return html``;
    const cfg = this.config;

    return html`
      <style>${editorStyles}</style>
      <div class="tc-editor-root">
        <!-- SECTION: Card options -->
        <div class="tc-section">
          <h3 class="tc-section-title">Card options</h3>
          <div class="tc-section-subtitle">
            Basic settings for range, limits and language.
          </div>

          <div class="tc-card-block">
            <div class="tc-form-group">
              <!-- TITLE -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Title</div>
                  <div class="tc-setting-description">
                    Optional card title.
                  </div>
                </div>
                <ha-textfield
                  style="min-width: 200px; width: 280px; max-width: 280px;"
                  .value=${cfg.title || ""}
                  @input=${(e) => this._onTextChange("title", e.target.value)}
                ></ha-textfield>
              </div>

              <!-- HOURS -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Hours</div>
                  <div class="tc-setting-description">
                    Number of hours of history to fetch (integer).
                  </div>
                </div>
                <ha-textfield
                  type="number"
                  min="1"
                  style="width: 140px;"
                  .value=${cfg.hours ?? ""}
                  @input=${(e) => this._onNumberChange("hours", e.target.value)}
                ></ha-textfield>
              </div>

              <!-- LIMIT -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Limit</div>
                  <div class="tc-setting-description">
                    Max number of events to display (integer).
                  </div>
                </div>
                <ha-textfield
                  type="number"
                  min="1"
                  style="width: 140px;"
                  .value=${cfg.limit ?? ""}
                  @input=${(e) => this._onNumberChange("limit", e.target.value)}
                ></ha-textfield>
              </div>

              <!-- VISIBLE EVENTS -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Visible events</div>
                  <div class="tc-setting-description">
                    Number of events shown before collapsing (optional).
                  </div>
                </div>
                <ha-textfield
                  type="number"
                  min="1"
                  style="width: 140px;"
                  .value=${cfg.visible_events ?? ""}
                  @input=${(e) =>
                    this._onNumberChange("visible_events", e.target.value)}
                ></ha-textfield>
              </div>

              <!-- OVERFLOW MODE -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Overflow mode</div>
                  <div class="tc-setting-description">
                    Collapse extra events or use a scroll container.
                  </div>
                </div>
                <ha-select
                  style="min-width: 180px; width: 200px;"
                  .value=${cfg.overflow || "collapse"}
                  @selected=${(e) => this._onSelectChange("overflow", e)}
                  @closed=${(e) => e.stopPropagation()}
                >
                  <mwc-list-item value="collapse">Collapse (show more/less)</mwc-list-item>
                  <mwc-list-item value="scroll">Scroll (respect max height)</mwc-list-item>
                </ha-select>
              </div>

              <!-- MAX HEIGHT -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Max height</div>
                  <div class="tc-setting-description">
                    Limit card height (e.g. 220px or 14rem). Useful with scroll mode.
                  </div>
                </div>
                <ha-textfield
                  style="width: 180px;"
                  .value=${cfg.max_height ?? ""}
                  @input=${(e) =>
                    this._onTextChange("max_height", e.target.value)}
                ></ha-textfield>
              </div>

              <!-- REFRESH INTERVAL -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Refresh interval (s)</div>
                  <div class="tc-setting-description">
                    Background auto-refresh in seconds (integer).
                  </div>
                </div>
                <ha-textfield
                  type="number"
                  min="1"
                  style="width: 140px;"
                  .value=${cfg.refresh_interval ?? ""}
                  @input=${(e) =>
                    this._onNumberChange("refresh_interval", e.target.value)}
                ></ha-textfield>
              </div>

              <!-- LANGUAGE -->
              <div class="tc-setting-row">
                <div class="tc-setting-label">
                  <div class="tc-setting-title">Language</div>
                  <div class="tc-setting-description">
                    Use card language (empty = auto from HA/browser).
                  </div>
                </div>
                <ha-select
                  style="min-width: 200px; width: 240px;"
                  .value=${cfg.language || ""}
                  @selected=${(e) => this._onSelectChange("language", e)}
                  @closed=${(e) => e.stopPropagation()}
                >
                  <mwc-list-item value="">Auto</mwc-list-item>
                  <mwc-list-item value="en-US">English (US)</mwc-list-item>
                  <mwc-list-item value="en-GB">English (UK)</mwc-list-item>
                  <mwc-list-item value="de">Deutsch</mwc-list-item>
                  <mwc-list-item value="fr">Français</mwc-list-item>
                  <mwc-list-item value="pt-br">Português (BR)</mwc-list-item>
                </ha-select>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION: Display options -->
        <div class="tc-section">
          <h3 class="tc-section-title">Display options</h3>
          <div class="tc-section-subtitle">
            Visual toggles for names, states, icons and formatting.
          </div>

          <div class="tc-card-block">
            <div class="tc-form-group">
              ${this._booleanRow(
                "Show names",
                "Show the entity name in the timeline.",
                "show_names",
                cfg.show_names ?? true
              )}
              ${this._booleanRow(
                "Show states",
                "Display the entity state next to the name.",
                "show_states",
                cfg.show_states ?? true
              )}
              ${this._booleanRow(
                "Show icons",
                "Add the entity icon to each event.",
                "show_icons",
                cfg.show_icons ?? true
              )}
              ${this._booleanRow(
                "Use relative time",
                "Show relative timestamps like 5 minutes ago.",
                "relative_time",
                cfg.relative_time ?? false
              )}
              ${this._booleanRow(
                "Allow multiline",
                "Allow names and states to wrap across multiple lines.",
                "allow_multiline",
                cfg.allow_multiline ?? false
              )}
              ${this._booleanRow(
                "Compact layout",
                "Overlap rows to reduce the vertical height of the timeline.",
                "compact_layout",
                cfg.compact_layout ?? false
              )}
              ${this._booleanRow(
                "Collapse duplicates",
                "Hide consecutive events with the same state.",
                "collapse_duplicates",
                cfg.collapse_duplicates ?? false
              )}
            </div>
          </div>
        </div>

        <!-- SECTION: Colors -->
        <div class="tc-section">
          <h3 class="tc-section-title">Colors</h3>
          <div class="tc-section-subtitle">
            Optional static colors for name and state (applied globally).
          </div>
          <div class="tc-card-block">
            <div class="tc-form-group">
              <div class="tc-color-row">
                ${this._renderColorPicker(
                  "name_color",
                  cfg.name_color,
                  "Name color"
                )}
              </div>
              <div class="tc-color-row">
                ${this._renderColorPicker(
                  "state_color",
                  cfg.state_color,
                  "State color"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _booleanRow(title, description, key, value) {
    return html`
      <div class="tc-setting-row">
        <div class="tc-setting-label">
          <div class="tc-setting-title">${title}</div>
          ${description
            ? html`<div class="tc-setting-description">
                ${description}
              </div>`
            : ""}
        </div>
        <ha-switch
          .checked=${value}
          @change=${(e) => this._onToggle(key, e)}
        ></ha-switch>
      </div>
    `;
  }

  _onToggle(key, ev) {
    const patch = { [key]: ev.target.checked };
    this.dispatchEvent(
      new CustomEvent("settings-changed", {
        detail: { patch },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderColorPicker(key, value, label) {
    return html`
      <div class="tc-color-picker">
        <label class="tc-color-label">${label}</label>
        <div class="tc-color-input-row">
          <input
            class="tc-color-input"
            type="color"
            .value=${this._ensureColor(value)}
            @input=${(e) => this._onColorChange(key, e.target.value)}
          />
          <button
            class="tc-icon-button"
            title="Clear color"
            @click=${() => this._onColorChange(key, undefined)}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  _onColorChange(key, value) {
    const patch = { [key]: value || undefined };
    this.dispatchEvent(
      new CustomEvent("settings-changed", {
        detail: { patch },
        bubbles: true,
        composed: true,
      })
    );
  }

  _ensureColor(value) {
    const hex = (value || "").trim();
    const valid = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
    return valid.test(hex) ? hex : "#00aaff";
  }

  _onNumberChange(key, rawValue) {
    const text = `${rawValue ?? ""}`.trim();
    if (!text) {
      this._emitPatch({ [key]: undefined });
      return;
    }
    const num = parseInt(text, 10);
    if (Number.isNaN(num)) return;
    this._emitPatch({ [key]: num });
  }

  _onTextChange(key, value) {
    const v = (value || "").trim();
    this._emitPatch({ [key]: v || undefined });
  }

  _onSelectChange(key, ev) {
    const val = ev.target?.value ?? "";
    this._emitPatch({ [key]: val || undefined });
  }

  _emitPatch(patch) {
    this.dispatchEvent(
      new CustomEvent("settings-changed", {
        detail: { patch },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define(
  "timeline-card-general-settings",
  TimelineCardGeneralSettings
);
