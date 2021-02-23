---
layout: standard
id: offers
title: Offers
permalink: /offers/
nav: true
nav-order: 5

offers:
  - id: asdf
  - id: zxcv
  - id: rewq
  - id: tyui
---

<div class="content-spacing">
  <div class="content-padding--sm">
    <div class="mx-auto max-w-screen-lg text-center">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, suscipit doloribus maiores accusantium quam odit cumque id nemo consequatur sint autem at fugiat voluptatem consequuntur beatae quidem tenetur harum eius ab, provident, est ipsa neque. Natus fugiat itaque quod dolores provident quisquam ab, nobis, illum beatae fuga accusantium. Quis optio incidunt esse debitis odio deleniti? Quia voluptates officiis omnis consequatur.</p>
    </div>
    <div class="mt-8"></div>
    <div class="mx-auto max-w-screen-xl">
      <div class="row row--6-6 row--gutter-sm">
        {% for offer in page.offers %}
          <div class="col">
            {% include offer/card.html offer="offer" %}
          </div>
        {% endfor %}
      </div>
      <div class="text-center mt-10">
        <a href="{{site.data.core-nav.header[0].link}}" class="btn">See All Offers</a>
      </div>
    </div>
  </div>
</div>
