# hooks/

| Hook                 | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| useCountUp           | Animates a numeric string from 0 to target when inView becomes true     |
| useScrollDepth       | Tracks scroll depth milestones (25/50/75/100%) and reports to PostHog   |
| useSectionVisibility | Tracks viewport visibility and time spent per `data-section` element    |
| useHoverTracking     | Tracks hover duration on `data-track-hover` elements (>500ms threshold) |
| useTextSelection     | Captures user text selections with section context, reports to PostHog  |
| useClickTracking     | Tracks clicks on `data-track-click` elements with section context       |
