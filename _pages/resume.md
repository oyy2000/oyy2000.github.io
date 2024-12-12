---
layout: archive
title: "RESUME"
permalink: /resume/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}



Education Experience
======
* B.E. in Computer Science and Technology, Shenzhen University, Sep. 2018 - July 2022 at Shenzhen, China
* M.Eng. in Electrical and Computer Engineering, Duke University, Aug. 2022 - May 2024 at Durham, U.S.A

Research Experience
======
* Adversarial Privacy Attacks on Aligned Large Language Models, Oct. 2023 - Present at Durham, U.S.A
  - Conducted comprehensive experiments using Greedy Coordinate Gradient to identify exact privacy leakage (90% and even all of the Output from material) without directly related prompt of Large Language Models like StableLM-Tuned-Alpha and StableVicuna-13B which are fine-tuned using Reinforcement Learning from Human Feedback on various conversational and instructional datasets. 
  - Subsequent to this analysis, we explored two avenues: developing robust countermeasures to reinforce model privacy or innovating an enhanced adversarial approach to refine the RLHF training protocol, thereby mitigating potential privacy exploitation.

* Enhancing Pre-trained Data Detection for LLM Privacy Protection Jan. 2024 - Present at Durham, U.S.A

  - Refined the MIN-K% PROB metric using temperature scaling, achieving a 5% improvement over benchmark methods for detecting pre-trained data in LLMs. 

  - Developed a novel gap-based method (GAP) for pre-trained data detection, improving AUC by 10% over the state-of-the-art (MIN-K% PROB) by measuring log probability density gaps within datasets.

* Addressing Data Scarcity in Multimodal Models Jan. 2024 - Present at Durham, U.S.A
  - Developing methods to generate high-quality synthetic multimodal datasets. Leveraging ChatGPT 4 for in-context prompt generation, driving image creation with Stable Diffusion models, and employing techniques like BoxDiff for precise image-text alignment.


Internship Experience
======
* Summer 2023: Trip.com Group Ltd, Flight Ticket Department, Back End Developer Intern, May 2023 - Aug. 2023 at Shanghai, China
  - Contributed to the optimization of MegaSearch which serves as an aggregation and cache layer for Trip’s international ticket responses using **Java**.
  - Optimized the response size to fit AWS’s smaller bandwidth while saving some storage costs. Reduced the **Protobuf** response size by 50% in total using a variety of methods. 
  - Compared a variety of serialization and deserialization means using **JMH**: including the latest open source Fury, Kryo, and ultimately found that Protobuf is the most efficient serialization, but Kryo in the serialization of the size of a small advantage.

* Summer 2022: Amazon Web Service, DeepJavaLibrary Department, Back End Developer Intern, July 2022 - Oct. 2022 remote
  * Integrated the **DeepJavaLibrary** Model Server with the open-source KServe platform deeply through a well-thought-out plan.
  - Developed 3 HTTP APIs applicable to the **KServe** inference engine for DJL-Serving using **Java**, which respond to the users with the DJL-Serving running model’s health status, the serving model’s information, and inference results which also need the request data.
  - Made each API return a response code and pass the corresponding unit test.
  - Hosted containerized DJL-Serving on KServe, writing **yaml** files specifying its ports, and related parameters.  
  - The specified DJL-Serving model can be run in the KServe framework by deploying a test yaml file.

* Summer 2021: Tencent Music Entertainment Group, Security Center Department, Front End Developer Intern, May 2023 - Sep. 2023 at Shenzhen, China
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
- ECE 551K Programming, Data Structures, and Algorithms in C++’s Teaching Assistant at Duke University

