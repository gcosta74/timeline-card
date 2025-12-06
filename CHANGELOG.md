# Changelog

## v1.2.0
- Brazilian Portuguese translations added by **@Bsector**, Thanks!
- Added support for collapsing consecutive duplicate events in history and live updates.

## v1.1.1
- Fix: Add include_states filtering for live WebSocket events
- Fix: Safe-check liveUnsub to avoid errors in HA editor mode
- Fix: Lowercase states when names are displayed

## v1.1.0
- French translations added by **@bsdev90**, Thanks!
- Display the state in the style of the name if ``show_names: false`` is set
- Added Options ``name_color:`` and ``state_color:`` Defineable card wide or per entity.
- Register card in Home Assistant card picker

## v1.0.1
- fixed styling in light mode
- automatic multiline wrapping for long names/states via Card Option ``allow_multiline: true/false``
- shortening overly long states

## v1.0.0

### Changes in this release:

- ### Live updates via WebSocket — timeline updates instantly without page refresh:

    The card listens to Home Assistant’s state_changed events via WebSockets.

    Any change of the configured entities is added to the timeline immediately — without refreshing the page.

    **No configuration is required.**

    Live updates work automatically as soon as the card is loaded.

- ### Auto Refresh

    Auto Refresh interval in seconds via YAML option ``refresh_interval: 60``

    You can enable an optional background refresh interval.
    
    The card will periodically re-fetch history data without reloading the UI.

## v0.3.0
- added HACS validation Workflow

## v0.2.0
- Added german and english translations

## v0.1.1
- github actions