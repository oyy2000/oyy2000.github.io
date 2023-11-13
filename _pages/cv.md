---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}



Education
======
* B.E. in Computer Science and Technology, Shenzhen University, 2018 - 2022
* M.Eng. in Electrical and Computer Engineering, Duke University, 2022 - Present

Internship experience
======
* Summer 2023: Trip.com Group Ltd, Flight Ticket Department, Back End Developer Intern 
  - Contributed to the optimization of MegaSearch which serves as an aggregation and cache layer for Trip’s international ticket responses using **Java**.
  - Optimized the response size to fit AWS’s smaller bandwidth while saving some storage costs. Reduced the **Protobuf** response size by 50% in total using a variety of methods. 
  - Compared a variety of serialization and deserialization means using **JMH**: including the latest open source Fury, Kryo, and ultimately found that Protobuf is the most efficient serialization, but Kryo in the serialization of the size of a small advantage.

* Summer 2022: Amazon Web Service, DeepJavaLibrary Department, Back End Developer Intern
  * Integrated the **DeepJavaLibrary** Model Server with the open-source KServe platform deeply through a well-thought-out plan.
  - Developed 3 HTTP APIs applicable to the **KServe** inference engine for DJL-Serving using **Java**, which respond to the users with the DJL-Serving running model’s health status, the serving model’s information, and inference results which also need the request data.
  - Made each API return a response code and pass the corresponding unit test.
  - Hosted containerized DJL-Serving on KServe, writing **yaml** files specifying its ports, and related parameters.  
  - The specified DJL-Serving model can be run in the KServe framework by deploying a test yaml file.

* Summer 2021: Tencent Music Entertainment Group, Security Center Department, Front End Developer Intern
  * Applied Vue2.0 framework based on JavaScript to develop the inner front-end of content audit security platform.
  - Built and maintained middle ground management system.
  - Developed search, collection, and recently used functions for the middle ground management system.
  - Utilised Least Recently Used (LRU) to design a cache that was able to clear the cache efficiently.
  - Configured Webpack to optimize the local development and deployment increased the packaging speed by 75% and decreased the packaging size by 10%.
  
Skills
======
* Programming Languages: Java, Python, C, C++, JavaScript
* DeepLearning Frameworks: PyTorch

Teaching
======
- ECE 551K’s Teaching Assistant at Duke University

