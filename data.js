/* ============================================================
   LEO ZANONI — gallery photos (real images)
   ratio = width / height (used for exact aspect, no cropping)
   ============================================================ */

window.PHOTOS = [
  { src: "assets/photos/p01.jpg", title: "Fashion",     place: "Dublin", year: "2024", ratio: 2550/3300 },
  { src: "assets/photos/p10.jpg", title: "Beauty",      place: "Studio", year: "2024", ratio: 4480/6720 },
  { src: "assets/photos/p16.jpg", title: "MH Beauty",   place: "Studio", year: "2023", ratio: 5722/4480 },
  { src: "assets/photos/p07.jpg", title: "Portrait",    place: "Dublin", year: "2023", ratio: 3642/5463 },
  { src: "assets/photos/p23.jpg", title: "Portrait",    place: "Studio", year: "2025", ratio: 4215/6322 },
  { src: "assets/photos/p03.jpg", title: "Robert Baker", place: "Dublin", year: "2024", ratio: 1500/1348 },
  { src: "assets/photos/p20.jpg", title: "Studio",      place: "Dublin", year: "2025", ratio: 6720/4480 },
  { src: "assets/photos/p26.jpg", title: "Piano Black",  place: "Dublin", year: "2024", ratio: 6603/4759 },
  { src: "assets/photos/p12.jpg", title: "Ellen",       place: "Studio", year: "2024", ratio: 4428/5244 },
  { src: "assets/photos/p22.jpg", title: "Portrait",    place: "Dublin", year: "2023", ratio: 4319/6478 },
  { src: "assets/photos/p05.jpg", title: "House Mates", place: "Dublin", year: "2024", ratio: 1500/1288 },
  { src: "assets/photos/p19.jpg", title: "Studio",      place: "Dublin", year: "2025", ratio: 4302/5153 },
  { src: "assets/photos/p17.jpg", title: "MH Beauty",   place: "Studio", year: "2023", ratio: 5657/4472 },
  { src: "assets/photos/p02.jpg", title: "Portrait",    place: "Dublin", year: "2024", ratio: 4480/6720 },
  { src: "assets/photos/p14.jpg", title: "House Mates", place: "Dublin", year: "2023", ratio: 1500/1000 },
  { src: "assets/photos/p09.jpg", title: "Portrait",    place: "Dublin", year: "2024", ratio: 2669/3543, heroPos: "center 18%", heroZoom: "132%" },
  { src: "assets/photos/p24.jpg", title: "Amy McBennet", place: "Studio", year: "2024", ratio: 5543/6929, heroPos: "center 22%", heroZoom: "120%" },
  { src: "assets/photos/p11.jpg", title: "Beauty",      place: "Studio", year: "2024", ratio: 4480/6456 },
  { src: "assets/photos/p06.jpg", title: "Fashion",     place: "Dublin", year: "2023", ratio: 2606/3506, heroPos: "center 14%", heroZoom: "150%" },
  { src: "assets/photos/p18.jpg", title: "MH Beauty",   place: "Studio", year: "2023", ratio: 4179/3682 },
  { src: "assets/photos/p25.jpg", title: "Amy McBennet", place: "Dublin", year: "2024", ratio: 5849/3968 },
  { src: "assets/photos/p21.jpg", title: "Studio",      place: "Dublin", year: "2025", ratio: 4477/5503 },
  { src: "assets/photos/p13.jpg", title: "Fashion",     place: "Dublin", year: "2024", ratio: 2480/3100 },
  { src: "assets/photos/p04.jpg", title: "Robert Baker", place: "Dublin", year: "2024", ratio: 1500/1499 },
  { src: "assets/photos/p15.jpg", title: "Portrait",    place: "Studio", year: "2024", ratio: 1200/1500 }
];

/* Photos that cycle in the hero, beside the name — all except MH Beauty product shots */
window.HERO_PHOTOS = window.PHOTOS
  .filter(p => p.title !== "MH Beauty")
  .map(p => ({ src: p.src, title: p.title, year: p.year, ratio: p.ratio, heroPos: p.heroPos, heroZoom: p.heroZoom }));
