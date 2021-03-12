---
layout: standard
id: road-trips
title: Road trips
permalink: /road-trips/
nav: true
nav-order: 2
intro: Find your next adventure here. From adventures through soaring mountains and wild coastlines, to iconic country drives and pretty villages, discover lesser-known road trips that are set to inspire your wanderlust.
---

<div class="content-padding content-spacing">
  <div class="mx-auto max-w-screen-lg text-center">
    <p>{{page.intro}}</p>
  </div>
</div>
<div class="content-padding content-padding--sm content-border">
  <div class="row row--4-4-4 row--gutter-sm">
  {% assign trip-pages = site.html_pages | where: 'layout', 'trip' | sort: 'order' %}
  {% for trip in trip-pages %}
    <div class="col">
      {% include content/road-trip.html data="trip" %}
    </div>
  {% endfor %}
  </div>
</div>
