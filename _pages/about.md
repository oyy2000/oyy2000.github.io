---
layout: about
title: about
permalink: /
subtitle: '"The future is in our hands"'

profile:
  align: right
  image: prof_pic.png
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>youyang7 AT ncsu DOT edu</p>
    <p>Raleigh, NC 27529</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---


{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

He is a second-year Ph.D. student in the Electrical and Computer Engineering Department at [North Carolina State University](https://ece.ncsu.edu/), advised by Professor [Jung-Eun Kim](https://jungeunkim.wordpress.ncsu.edu/). 

Before joining NC State University, he received his Master of Engineering in Electrical and Computer Engineering from the [School of Pratt](https://pratt.duke.edu/) at [Duke University](https://duke.edu/), where he collaborated with the [CEI Lab](https://cei.pratt.duke.edu/) . He also holds a Bachelor of Engineering in Computer Science and Technology from [Shenzhen University](https://en.szu.edu.cn/), where he worked with [Prof. Jianqiang Li](https://scholar.google.com/citations?user=-oVMPBwAAAAJ&hl=zh-CN) of the [College of CSSE](https://csse.szu.edu.cn/#).

#### My Main Research Interests:
- **Trustworthy & Efficient ML**
- **Interpretable LLMs**