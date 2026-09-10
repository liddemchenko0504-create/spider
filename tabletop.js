/* ==========================================================
   SPIDER YARD — TABLETOP UX V3
   SAFE VERSION — NO MUTATION LOOPS
   Presentation only.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  if (window.innerWidth <= 700) return;


  /* ========================================================
     1. DESK PROPS
     ======================================================== */

  const props = [
    ["prop-lamp", "/assets/tabletop/lamp.webp"],
    ["prop-ivy-left", "/assets/tabletop/ivy.webp"],
    ["prop-books", "/assets/tabletop/books.webp"],
    ["prop-coffee", "/assets/tabletop/coffee.webp"],
    ["prop-leather-book", "/assets/tabletop/leather-book.webp"]
  ];


  props.forEach(([id, src]) => {

    if (document.getElementById(id)) return;

    const img = document.createElement("img");

    img.id = id;
    img.className = "tabletop-prop";
    img.src = src;
    img.alt = "";
    img.draggable = false;
    img.setAttribute("aria-hidden", "true");

    document.body.appendChild(img);

  });



  /* ========================================================
     2. FOUNDATION COUNTER
     IMPORTANT:
     We observe CONTENT only.
     We do NOT observe attributes because we ourselves
     change data-completed.
     ======================================================== */

  const foundations =
    document.querySelector(".foundations");


  let previousCompleted = -1;


  function countCompletedFoundations() {

    if (!foundations) return 0;

    const slots =
      [...foundations.querySelectorAll(".foundation-slot")];


    return slots.filter(slot => {

      return (
        slot.children.length > 0 ||
        slot.textContent.trim() !== "" ||
        slot.classList.contains("completed") ||
        slot.classList.contains("filled")
      );

    }).length;

  }


  function updateFoundationCounter() {

    if (!foundations) return;

    const completed =
      countCompletedFoundations();


    /*
      Only write when value actually changed.
    */
    if (
      foundations.dataset.completed !==
      String(completed)
    ) {
      foundations.dataset.completed =
        String(completed);
    }


    if (
      previousCompleted >= 0 &&
      completed > previousCompleted
    ) {

      const filledSlots =
        [...foundations.querySelectorAll(".foundation-slot")]
          .filter(slot =>
            slot.children.length > 0 ||
            slot.textContent.trim() !== "" ||
            slot.classList.contains("completed") ||
            slot.classList.contains("filled")
          );


      const newest =
        filledSlots[filledSlots.length - 1];


      if (newest) {

        newest.classList.remove(
          "sy-foundation-pop"
        );

        void newest.offsetWidth;

        newest.classList.add(
          "sy-foundation-pop"
        );


        window.setTimeout(() => {

          newest.classList.remove(
            "sy-foundation-pop"
          );

        }, 600);

      }

    }


    previousCompleted = completed;

  }


  if (foundations) {

    updateFoundationCounter();


    const foundationObserver =
      new MutationObserver(() => {

        /*
          Collapse multiple render mutations
          into one update.
        */
        requestAnimationFrame(
          updateFoundationCounter
        );

      });


    foundationObserver.observe(
      foundations,
      {
        childList: true,
        subtree: true,
        characterData: true

        /*
          NO attributes:true
          This prevents feedback loop.
        */
      }
    );

  }



  /* ========================================================
     3. THEME CATEGORIES
     SAFE — NO SUBTREE OBSERVER
     ======================================================== */

  const skinsOverlay =
    document.getElementById("skins-overlay");


  function audienceFor(card) {

    const text =
      (card.textContent || "")
        .toLowerCase();


    if (text.includes("midnight velvet")) {
      return "Straight";
    }

    if (text.includes("rose garden")) {
      return "Gay";
    }

    if (text.includes("golden harbor")) {
      return "Lesbian";
    }

    return "";

  }


  function decorateThemeCards() {

    const cards =
      document.querySelectorAll(
        "#skins-grid .skin-card"
      );


    cards.forEach(card => {

      const audience =
        audienceFor(card);


      if (!audience) return;


      card.dataset.audience =
        audience;


      const swatch =
        card.querySelector(".swatch");


      if (!swatch) return;


      /*
        Exactly ONE category badge.
      */
      let badge =
        swatch.querySelector(
          ":scope > .skin-audience-badge"
        );


      if (!badge) {

        badge =
          document.createElement("span");

        badge.className =
          "skin-audience-badge";

        swatch.appendChild(badge);

      }


      if (badge.textContent !== audience) {
        badge.textContent = audience;
      }


      /*
        Exactly ONE label inside lock.
      */
      const lock =
        swatch.querySelector(
          ".skin-preview-lock"
        );


      if (lock) {

        let label =
          lock.querySelector(
            ".skin-preview-lock-label"
          );


        if (!label) {

          label =
            document.createElement("span");

          label.className =
            "skin-preview-lock-label";

          lock.appendChild(label);

        }


        if (label.textContent !== audience) {
          label.textContent = audience;
        }

      }

    });

  }



  /* ========================================================
     4. BOOK STATE
     Observe ONLY overlay class.
     Changing BODY class cannot retrigger this observer.
     ======================================================== */

  function syncBookState() {

    if (!skinsOverlay) return;


    const isOpen =
      !skinsOverlay.classList.contains(
        "hidden"
      );


    document.body.classList.toggle(
      "skins-open",
      isOpen
    );


    if (isOpen) {

      /*
        Allow existing renderSkinsPanel()
        to finish first.
      */
      requestAnimationFrame(() => {

        requestAnimationFrame(
          decorateThemeCards
        );

      });

    }

  }


  if (skinsOverlay) {

    syncBookState();


    const overlayObserver =
      new MutationObserver(
        syncBookState
      );


    overlayObserver.observe(
      skinsOverlay,
      {
        attributes: true,
        attributeFilter: ["class"]
      }
    );

  }



  /*
    Also decorate once on initial load.
  */
  decorateThemeCards();



  /* ========================================================
     5. TACTILE BUTTON PRESS
     ======================================================== */

  document.addEventListener(
    "pointerdown",
    event => {

      const element =
        event.target.closest(
          ".sy-btn, .stock-pile"
        );


      if (!element) return;


      element.classList.add(
        "sy-pressed"
      );

  });


  const releasePressed = () => {

    document
      .querySelectorAll(".sy-pressed")
      .forEach(element => {

        element.classList.remove(
          "sy-pressed"
        );

      });

  };


  document.addEventListener(
    "pointerup",
    releasePressed
  );


  document.addEventListener(
    "pointercancel",
    releasePressed
  );

});


/* ==========================================================
   SPIDER YARD — CINEMATIC BOOK CLOSE CONTROLLER V5
   ========================================================== */

(() => {

  const CLOSE_DURATION = 740;


  function getBookOverlay(){

    return document.getElementById(
      "skins-overlay"
    );

  }


  function bookIsOpen(){

    const overlay =
      getBookOverlay();


    return (
      overlay &&
      !overlay.classList.contains(
        "hidden"
      )
    );

  }



  function animatedCloseBook(){

    const overlay =
      getBookOverlay();


    if(!overlay) return;


    if(
      overlay.classList.contains(
        "hidden"
      )
    ){
      return;
    }


    if(
      overlay.classList.contains(
        "sy-book-closing"
      )
    ){
      return;
    }


    /*
      Step 1
      Keep overlay visible.
    */

    overlay.classList.add(
      "sy-book-closing"
    );


    document.body.classList.remove(
      "skins-open"
    );


    /*
      Step 2
      After animation ends,
      actually hide it.
    */

    window.setTimeout(
      () => {

        overlay.classList.add(
          "hidden"
        );


        overlay.classList.remove(
          "sy-book-closing"
        );

      },
      CLOSE_DURATION
    );

  }



  /* ========================================================
     ESCAPE

     capture:true is important:
     we intercept BEFORE the old game Escape handler.
     ======================================================== */

  document.addEventListener(
    "keydown",
    event => {

      if(
        event.key !==
        "Escape"
      ){
        return;
      }


      if(
        !bookIsOpen()
      ){
        return;
      }


      event.preventDefault();

      event.stopPropagation();

      event.stopImmediatePropagation();


      animatedCloseBook();

    },
    true
  );



  /* ========================================================
     CLOSE BUTTON
     ======================================================== */

  document.addEventListener(
    "click",
    event => {

      const close =
        event.target.closest(
          "#skins-close"
        );


      if(!close){
        return;
      }


      if(
        !bookIsOpen()
      ){
        return;
      }


      event.preventDefault();

      event.stopPropagation();

      event.stopImmediatePropagation();


      animatedCloseBook();

    },
    true
  );



  /* ========================================================
     PREPARE EVERY NEW OPEN

     When old app removes .hidden,
     clear stale closing state.
     ======================================================== */

  document.addEventListener(
    "click",
    () => {

      const overlay =
        getBookOverlay();


      if(!overlay) return;


      if(
        !overlay.classList.contains(
          "hidden"
        )
      ){

        overlay.classList.remove(
          "sy-book-closing"
        );

      }

    }
  );


})();


/* ==========================================================
   SPIDER YARD — REAL PAGE DOM V6
   ========================================================== */

(() => {

  function buildBookPages(){

    const modal =
      document.querySelector(
        "#skins-overlay .after-dark-modal"
      );


    if(!modal) return;


    if(
      modal.querySelector(
        ".sy-book-page-left"
      )
    ){
      return;
    }


    const left =
      document.createElement("div");


    left.className =
      "sy-book-page sy-book-page-left";


    const right =
      document.createElement("div");


    right.className =
      "sy-book-page sy-book-page-right";


    const gutter =
      document.createElement("div");


    gutter.className =
      "sy-book-gutter";


    /*
      Decorative page layers should sit
      under the real HTML content.
    */

    modal.prepend(gutter);
    modal.prepend(right);
    modal.prepend(left);

  }


  document.addEventListener(
    "DOMContentLoaded",
    buildBookPages
  );


  /*
    If your theme modal is created dynamically,
    this catches the first open.
  */

  document.addEventListener(
    "click",
    event => {

      if(
        event.target.closest(
          "#skins-btn, #mobile-themes-btn, [data-open-themes]"
        )
      ){
        requestAnimationFrame(
          buildBookPages
        );
      }

    }
  );


})();



/* ==========================================================
   SPIDER YARD — CLOSED BOOK LAYER V7
   ========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const modal =
      document.querySelector(
        "#skins-overlay .after-dark-modal"
      );


    if(!modal){
      return;
    }


    /*
      Add closed leather book representation.
    */

    if(
      !modal.querySelector(
        ".sy-closed-book"
      )
    ){

      const closedBook =
        document.createElement(
          "img"
        );


      closedBook.className =
        "sy-closed-book";


      closedBook.src =
        "/assets/tabletop/leather-book.webp";


      closedBook.alt =
        "";


      closedBook.draggable =
        false;


      closedBook.setAttribute(
        "aria-hidden",
        "true"
      );


      modal.appendChild(
        closedBook
      );

    }

  }
);

