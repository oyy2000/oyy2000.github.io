---
layout: page
title: Visitor privacy
permalink: /privacy/
nav: false
analytics: false
description: How this website measures visits and displays approximate visitor locations.
---

This website uses [Umami](https://umami.is/) to understand page visits, traffic sources, approximate visitor regions, and clicks on links such as the CV, papers, and email contact. Links shared with job applications may include campaign labels to distinguish their traffic sources. These labels do not establish a visitor's identity or occupation.

The home page also embeds a public [MapMyVisitors](https://mapmyvisitors.com/) globe showing approximate locations derived from visitors' IP addresses. Loading that widget connects your browser to MapMyVisitors and its supporting resources. Geographic locations can be inaccurate, especially for visitors using VPNs or shared networks.

The analytics dashboard is managed in the site owner's Umami account. The globe and its associated MapMyVisitors statistics are public. These services process analytics under their respective [Umami privacy policy](https://umami.is/privacy) and [MapMyVisitors privacy policy](https://mapmyvisitors.com/b/policy), including their own storage and retention practices.

The site's additional click events record the page path and destination path/hostname. They omit link text, destination query strings, fragments, and email addresses. Umami's standard pageview tracking also processes page URLs and campaign parameters.

This integration respects Do Not Track and Global Privacy Control. You can also exclude this browser from both services by opening the browser console on this website and running `localStorage.setItem("umami.disabled", "1")`, then reloading. Remove that setting with `localStorage.removeItem("umami.disabled")` to restore tracking. This privacy page itself does not load either analytics service.

For questions, contact [youyang7@ncsu.edu](mailto:youyang7@ncsu.edu).
