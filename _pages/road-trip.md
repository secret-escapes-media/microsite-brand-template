---
layout: standard
id: road-trips
title: Road trips
nav: true
nav-order: 2
---

<div class="content-padding content-spacing">
  <div class="mx-auto max-w-screen-lg text-center">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum nesciunt recusandae at, maxime, maiores nulla aut distinctio, aliquid doloremque veniam pariatur eveniet rem atque consectetur in eaque illum dolor. Quasi?</p>
  </div>
</div>
<div class="content-padding content-padding--sm content-border">
  <div class="row row--4-4-4 row--gutter-sm">
  {% assign trip-pages = site.html_pages | where: 'layout', 'trip' | sort: 'trip-order' %}
  {% for trip in trip-pages %}
    <div class="col">
      {% include road-trip.html data="trip" %}
    </div>
  {% endfor %}
  </div>
</div>
