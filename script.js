$(function () {
  /* ===== SOZLAMALAR (o'zingiz o'zgartiring) ===== */
  var TYPING_WORDS = ['[KASBIM]', '[QISQA TA\'RIF]']; // Hero'dagi yozuv matnlari
  var CONTACT_EMAIL = 'admin@gmail.com';              // Forma shu emailga xat tayyorlaydi

  /* ===== Preloader + hero kirish animatsiyasi ===== */
  function intro() {
    $('#preloader').addClass('done');
    $('body').addClass('loaded');
  }
  $('.hero-hi,.hero-name,.hero-role,.hero-text,.hero .d-flex,.hero-photo').each(function (i) {
    $(this).addClass('hero-in').css('animation-delay', (0.15 * i + 0.2) + 's');
  });
  $(window).on('load', function () { setTimeout(intro, 700); });
  setTimeout(intro, 4000); // internet sekin bo'lsa ham preloader yopiladi

  /* ===== Typing effect ===== */
  var w = 0, c = 0, del = false;
  (function type() {
    var word = TYPING_WORDS[w];
    $('#typing').text(word.substring(0, c));
    if (!del && c < word.length) { c++; setTimeout(type, 90); }
    else if (!del) { del = true; setTimeout(type, 1500); }
    else if (c > 0) { c--; setTimeout(type, 45); }
    else { del = false; w = (w + 1) % TYPING_WORDS.length; setTimeout(type, 300); }
  })();

  /* ===== Navbar, back-to-top, active link ===== */
  var sections = $('section[id]');
  function onScroll() {
    var y = $(window).scrollTop();
    $('#nav').toggleClass('scrolled', y > 50);
    $('#toTop').toggleClass('show', y > 500);
    var cur = '';
    sections.each(function () { if (y >= $(this).offset().top - 140) cur = this.id; });
    $('.nav-link').removeClass('active').filter('[href="#' + cur + '"]').addClass('active');
  }
  $(window).on('scroll', onScroll); onScroll();
  $('#toTop').on('click', function () { $('html,body').animate({ scrollTop: 0 }, 600); });

  /* ===== Smooth scroll + mobil menyuni yopish ===== */
  $('a[href^="#"]').on('click', function (e) {
    var t = $(this.getAttribute('href'));
    if (this.getAttribute('href').length > 1 && t.length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: t.offset().top - 60 }, 700);
      $('#menu').collapse('hide');
    }
  });

  /* ===== Scroll reveal, counter, progress bar ===== */
  function countUp(el) {
    var $el = $(el), end = +$el.data('count') || 0;
    $({ n: 0 }).animate({ n: end }, { duration: 1600, step: function (v) { $el.text(Math.floor(v)); }, complete: function () { $el.text(end); } });
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var $t = $(en.target);
      $t.addClass('in');
      $t.find('.bar span').each(function () {
        var lv = +$(this).data('level') || 0;
        $(this).css('width', lv + '%').closest('.skill').find('em').text(lv + '%');
      });
      if ($t.hasClass('count')) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  $('.reveal,.count').each(function () { io.observe(this); });

  /* ===== Owl Carousel (loyihalar) ===== */
  $('#projectSlider').owlCarousel({
    loop: false, margin: 24, nav: false, dots: true, autoplay: true, autoplayTimeout: 5000, autoplayHoverPause: true,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } }
  });

  /* ===== 3D tilt (faqat sichqonchali qurilmalarda) ===== */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $('.tilt').on('mousemove', function (e) {
      var r = this.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      this.style.transform = 'perspective(800px) rotateY(' + x * 10 + 'deg) rotateX(' + -y * 10 + 'deg) translateY(-4px)';
    }).on('mouseleave', function () { this.style.transform = ''; });

    /* ===== Custom cursor ===== */
    var mx = 0, my = 0, rx = 0, ry = 0;
    $('body').addClass('has-cursor');
    $(document).on('mousemove', function (e) { mx = e.clientX; my = e.clientY; $('.cursor-dot').css('transform', 'translate(' + mx + 'px,' + my + 'px)'); });
    (function loop() { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; $('.cursor-ring').css('transform', 'translate(' + rx + 'px,' + ry + 'px)'); requestAnimationFrame(loop); })();
    $(document).on('mouseover', 'a,button,.g-item,input,textarea', function () { $('.cursor-ring').addClass('hov'); })
               .on('mouseout', 'a,button,.g-item,input,textarea', function () { $('.cursor-ring').removeClass('hov'); });
  }

  /* ===== Lightbox ===== */
  $('#gallery-grid').on('click', '.g-item', function () {
    var img = $(this).find('img');
    $('#lightbox img').attr({ src: img.attr('src'), alt: img.attr('alt') });
    $('#lightbox').addClass('open');
  });
  $('#lightbox').on('click', function () { $(this).removeClass('open'); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') $('#lightbox').removeClass('open'); });

  /* ===== Aloqa formasi: pochta dasturini tayyor xat bilan ochadi ===== */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var n = $('#cName'), m = $('#cEmail'), t = $('#cMsg'), ok = true;
    [n, m, t].forEach(function (f) { f.removeClass('invalid'); });
    if (!n.val().trim()) { n.addClass('invalid'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.val().trim())) { m.addClass('invalid'); ok = false; }
    if (!t.val().trim()) { t.addClass('invalid'); ok = false; }
    if (!ok) { $('#formNote').text('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring.'); return; }
    var body = t.val().trim() + '\n\n' + n.val().trim() + ' (' + m.val().trim() + ')';
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Portfolio: ' + n.val().trim()) + '&body=' + encodeURIComponent(body);
    $('#formNote').text('Pochta dasturingiz ochildi. Xatni u yerdan yuboring.');
  });
});
