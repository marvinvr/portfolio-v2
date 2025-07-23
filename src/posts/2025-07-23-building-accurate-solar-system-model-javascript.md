---
title: I built an accurate model of the solar system in Javascript in a few hours
description: Using Three.js and XAI's Grok 4 model, I created an interactive 3D solar system with real orbital mechanics and accurate planetary positions.
date: "2025-07-23"
categories:
  - javascript
  - programming
  - ai
published: true
header: header.png
---

I recently built an interactive 3D model of our solar system using Three.js and JavaScript in just a few hours with [XAI](https://x.com/xai)'s [Grok 4](https://x.ai/news/grok-4) model. What makes this particularly impressive is that the model includes real gravitational calculations and astronomically accurate planetary positions. The AI implemented actual orbital mechanics calculations that determine where each planet should be positioned based on the selected date. The planets follow their real orbital paths with proper speeds and distances, making this more than just a pretty animation.

<iframe src="/model-of-the-solar-system.html" width="100%" height="600" frameborder="0" style="border-radius: 8px; margin: 20px 0;"></iframe>

You can interact with the model above, use your mouse to navigate around, change the date to see how planetary positions shift over time, and launch a rocket from Earth to Mars to see realistic travel times and distances.

You can also open it in full screen by clicking here: [Model of the Solar System](https://marvinvr.ch/model-of-the-solar-system.html).

The source code is available on [GitHub](https://github.com/marvinvr/portfolio-v2/blob/main/static/model-of-the-solar-system.html) if you're interested.