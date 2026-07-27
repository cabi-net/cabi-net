---
title: rider-waite recoloured
blurb: "a Python tool that scrapes all 78 Rider-Waite tarot cards from Wikimedia Commons and recolours them at runtime using a custom 4-anchor LAB colour ramp."
year: 2026
order: 2
emphasis: 2
tags: [scraping, image processing, automation]
status: finished
thumbPair:
  - /assets/rider-waite/ace_of_cups-in.png
  - /assets/rider-waite/ace_of_cups-out.png
links:
  source: https://github.com/cabi-net/rider-waite-scrape-and-index
demo:
  - kind: images
    items:
      - {
          src: /assets/rider-waite/ace_of_cups-in.png,
          alt: Ace of Cups — original,
        }
      - {
          src: /assets/rider-waite/ace_of_cups-out.png,
          alt: Ace of Cups — recoloured,
        }
      - {
          src: /assets/rider-waite/the_empress-in.png,
          alt: The Empress — original,
        }
      - {
          src: /assets/rider-waite/the_empress-out.png,
          alt: The Empress — recoloured,
        }
      - { src: /assets/rider-waite/the_sun-in.png, alt: The Sun — original }
      - { src: /assets/rider-waite/the_sun-out.png, alt: The Sun — recoloured }
---

A Python script that scrapes all 78 Rider-Waite Tarot card images from
Wikimedia Commons and recolours every card using a custom 4-anchor LAB ramp
palette. Inspired by Krita's Index Colors filter, reimplemented from scratch
in Python and applied entirely at runtime.

User provides 4 anchor colours (Shadow, Base, Light, Bright), and the number
of intermediate steps desired between each anchor.

```
$ python rider_waite_krita_index.py \
--shadow 3f32ac --base 76428a --light 5fcde4 --bright ffffff \
--steps 4 4 4
```

Palette is generated based on provided parameters: the script linearly
interpolates (by given number of steps) between each adjacent pair in CIE LAB
space.

![generated palette](/assets/rider-waite/palette-gen.png)

Finally, the script snaps every pixel from the original image to its nearest
palette entry by Euclidean LAB distance.
