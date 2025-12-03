# Changelog

## v1.0.0

### Changes in this release:

- ### Live updates via WebSocket — timeline updates instantly without page refresh:

    The card listens to Home Assistant’s state_changed events via WebSockets.

    Any change of the configured entities is added to the timeline immediately — without refreshing the page.

    **No configuration is required.**

    Live updates work automatically as soon as the card is loaded.

- ### Auto Refresh

    Auto Refresh interval in seconds via YAML option ```refresh_interval: 60```

    You can enable an optional background refresh interval.
    
    The card will periodically re-fetch history data without reloading the UI.

## v0.3.0
- added HACS validation Workflow

## v0.2.0
- Added german and english translations

## v0.1.1
- github actions