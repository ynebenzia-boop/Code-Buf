<script>
	//---- Skip to <main> functionality ----
  document.addEventListener('DOMContentLoaded', () => {
    const skipLinkEle = document.getElementById('skip-link');
    if (!skipLinkEle) return;

    skipLinkEle.addEventListener('click', handleSkipLink);
    skipLinkEle.addEventListener('keydown', handleSkipLink);
  });

  function handleSkipLink(e) {
    if (e.type === 'keydown' && e.key !== 'Enter') return;

    e.preventDefault();
    const target = document.querySelector('main');
    target.setAttribute('tabindex', '-1');
    target.focus();
  }
</script>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const btn = document.querySelector('.nav-menu_btn');
    const scrollThreshold = 70;

    function updateScrollState() {
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('is-scroll');
        } else {
            if (!btn.classList.contains('w--open')) {
                nav.classList.remove('is-scroll');
            }
        }
    }

    window.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    if (btn) {
        const observer = new MutationObserver(() => {
            if (btn.classList.contains('w--open')) {
                nav.classList.add('is-scroll');
            } else {
                if (window.scrollY <= scrollThreshold) {
                    nav.classList.remove('is-scroll');
                }
            }
        });

        observer.observe(btn, { attributes: true, attributeFilter: ['class'] });
    }

    updateScrollState();
});
</script>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".main-slider_wrap").forEach((wrap, index) => {
      if (wrap.dataset.scriptInitialized) return;
      wrap.dataset.scriptInitialized = "true";

      const cmsWrap = wrap.querySelector(".main-slider_cms_wrap");
      const nextBtn = wrap.querySelector(".main-slider_btn_element.is-next");
      const prevBtn = wrap.querySelector(".main-slider_btn_element.is-prev");
      const bulletWrap = wrap.querySelector(".main-slider_bullet_wrap");
      const scrollbarWrap = wrap.querySelector(".main-slider_draggable_wrap");

      if (!cmsWrap) {
        console.warn(`Missing swiper container in slider #${index + 1}`, wrap);
        return;
      }

      new Swiper(cmsWrap, {
        slidesPerView: "auto",
        followFinger: true,
        freeMode: false,
        slideToClickedSlide: false,
        centeredSlides: false,
        autoHeight: false,
        speed: 600,
        mousewheel: {
          forceToAxis: true,
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        pagination: {
          el: bulletWrap,
          bulletActiveClass: "is-active",
          bulletClass: "main-slider_bullet_item",
          bulletElement: "button",
          clickable: true,
        },
        scrollbar: {
          el: scrollbarWrap,
          draggable: true,
          dragClass: "main-slider_draggable_handle",
          snapOnRelease: true,
        },
        slideActiveClass: "is-active",
        slideDuplicateActiveClass: "is-active",
      });
    });
  });
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".accordion_cms_wrap").forEach((cmsWrap, listIndex) => {
      if (cmsWrap.dataset.scriptInitialized) return;
      cmsWrap.dataset.scriptInitialized = "true";

      const closePrevious = cmsWrap.getAttribute("data-close-previous") !== "false";
      const closeOnSecondClick = cmsWrap.getAttribute("data-close-on-second-click") !== "false";
      const openOnHover = cmsWrap.getAttribute("data-open-on-hover") === "true";
      const openByDefault = cmsWrap.getAttribute("data-open-by-default") !== null && !isNaN(+cmsWrap.getAttribute("data-open-by-default"))
        ? +cmsWrap.getAttribute("data-open-by-default")
        : false;

      let previousIndex = null, closeFunctions = [];

      cmsWrap.querySelectorAll(".accordion_component").forEach((thisCard, cardIndex) => {
        const button = thisCard.querySelector(".accordion_toggle_button");
        const content = thisCard.querySelector(".accordion_content_wrap");
        const icon = thisCard.querySelector(".accordion_toggle_icon"); // ← для поворота
        const line = thisCard.querySelector(".accordion-line"); // ← линия

        if (!button || !content) return console.warn("Missing elements:", thisCard);

        button.setAttribute("aria-expanded", "false");
        button.setAttribute("id", "accordion_button_" + listIndex + "_" + cardIndex);
        content.setAttribute("id", "accordion_content_" + listIndex + "_" + cardIndex);
        button.setAttribute("aria-controls", content.id);
        content.setAttribute("aria-labelledby", button.id);
        content.style.display = "none";

        const refresh = () => {
          tl.invalidate();
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        };

        const tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.3, ease: "power1.inOut" },
          onComplete: refresh,
          onReverseComplete: refresh
        });

        tl.set(content, { display: "block" });
        tl.fromTo(content, { height: 0 }, { height: "auto" });

        // Анимация иконки (раскомментируй, если нужна):
        // if (icon) {
        //   tl.fromTo(icon, { rotate: 0 }, { rotate: -45 }, "<");
        // }

        // Анимация скрытия линии
        if (line) {
          tl.fromTo(line, { opacity: 1 }, { opacity: 0 }, "<");
        }

        const closeAccordion = () => {
          if (thisCard.classList.contains("is-opened")) {
            thisCard.classList.remove("is-opened");
            tl.reverse();
            button.setAttribute("aria-expanded", "false");
          }
        };

        closeFunctions[cardIndex] = closeAccordion;

        const openAccordion = (instant = false) => {
          if (closePrevious && previousIndex !== null && previousIndex !== cardIndex) {
            closeFunctions[previousIndex]?.();
          }
          previousIndex = cardIndex;
          button.setAttribute("aria-expanded", "true");
          thisCard.classList.add("is-opened");
          instant ? tl.progress(1) : tl.play();
        };

        if (openByDefault === cardIndex) openAccordion(true);

        button.addEventListener("click", () => {
          if (thisCard.classList.contains("is-opened") && closeOnSecondClick) {
            closeAccordion();
            previousIndex = null;
          } else {
            openAccordion();
          }
        });

        if (openOnHover) {
          button.addEventListener("mouseenter", () => openAccordion());
        }
      });
    });
  });
</script>
