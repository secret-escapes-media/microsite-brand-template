---
layout: standard
id: offers
title: Book a trip
permalink: /offers/
nav: true
nav-order: 5
intro: Here they are - our handpicked selection of road-trip inspired offers. These multi-stop deals allow you the freedom to explore, with the comfort and style of our choice hotels to boot. Brought to you by the AA, find your next adventure here.
---

<div class="content-spacing">
  <div class="content-padding--narrow">
    <div class="mx-auto max-w-screen-lg text-center">
      <p>{{page.intro}}</p>
      <p>If that wasn’t enough, we’re also offering a further £25 credit toward a future getaway when you book these offers!</p>
    </div>
    <div class="mt-12"></div>
    <div class="mx-auto max-w-screen-xl">
      <div class="row row--6-6 row--gutter-sm">
        {% include component/se-offers.html sheet="UK" amount="6" %}
      </div>
      <div class="text-center mt-10">
        <a href="{{site.data.core-nav.header[0].link}}" class="btn">See All Offers</a>
      </div>
    </div>
  </div>
</div>
