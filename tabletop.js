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
   SPIDER YARD — BOOK EXPERIENCE V8
   One controller only.
   ========================================================== */

(() => {

  const OPEN_CLASS =
    "sy-v8-opening";

  const CLOSE_CLASS =
    "sy-v8-closing";

  const CLOSE_DURATION =
    1320;


  let closeTimer = null;


  function overlay(){

    return document.getElementById(
      "skins-overlay"
    );

  }


  function modal(){

    return document.querySelector(
      "#skins-overlay .after-dark-modal"
    );

  }



  /* ========================================================
     CREATE PHYSICAL BOOK PARTS
     ======================================================== */

  function buildV8Book(){

    const m = modal();

    if(!m){
      return;
    }


    if(
      m.querySelector(
        ".sy-v8-book-stage"
      )
    ){
      return;
    }


    const stage =
      document.createElement("div");


    stage.className =
      "sy-v8-book-stage";


    stage.setAttribute(
      "aria-hidden",
      "true"
    );


    const closed =
      document.createElement("img");


    closed.className =
      "sy-v8-closed";


    closed.src =
      "/assets/tabletop/leather-book.webp";


    closed.alt = "";

    closed.draggable = false;



    const open =
      document.createElement("div");


    open.className =
      "sy-v8-open";



    const left =
      document.createElement("div");


    left.className =
      "sy-v8-half sy-v8-left";



    const right =
      document.createElement("div");


    right.className =
      "sy-v8-half sy-v8-right";



    const spine =
      document.createElement("div");


    spine.className =
      "sy-v8-spine";



    open.appendChild(left);

    open.appendChild(right);

    open.appendChild(spine);


    stage.appendChild(open);

    stage.appendChild(closed);


    m.prepend(stage);

  }



  /* ========================================================
     OPEN ANIMATION
     Existing application still decides WHEN overlay opens.
     We only animate that change.
     ======================================================== */

  function startOpen(){

    const o = overlay();

    if(!o){
      return;
    }


    buildV8Book();


    if(closeTimer){

      clearTimeout(
        closeTimer
      );

      closeTimer = null;

    }


    o.classList.remove(
      CLOSE_CLASS
    );


    /*
      Remove/re-add opening class so
      every Themes click restarts animation.
    */

    o.classList.remove(
      OPEN_CLASS
    );


    void o.offsetWidth;


    o.classList.add(
      OPEN_CLASS
    );


    document.body.classList.add(
      "skins-open"
    );

  }



  /* ========================================================
     CLOSE ANIMATION
     ======================================================== */

  function startClose(){

    const o = overlay();


    if(
      !o ||
      o.classList.contains("hidden") ||
      o.classList.contains(CLOSE_CLASS)
    ){
      return;
    }


    if(closeTimer){

      clearTimeout(
        closeTimer
      );

    }


    o.classList.remove(
      OPEN_CLASS
    );


    /*
      Freeze current visual state for one frame
      before folding.
    */

    void o.offsetWidth;


    o.classList.add(
      CLOSE_CLASS
    );


    document.body.classList.remove(
      "skins-open"
    );


    closeTimer =
      window.setTimeout(
        () => {

          o.classList.add(
            "hidden"
          );


          o.classList.remove(
            CLOSE_CLASS
          );


          closeTimer = null;

        },
        CLOSE_DURATION
      );

  }



  /* ========================================================
     WATCH EXISTING APP OPEN
     ======================================================== */

  function initialise(){

    const o = overlay();


    if(!o){
      return;
    }


    buildV8Book();


    let wasHidden =
      o.classList.contains(
        "hidden"
      );


    const observer =
      new MutationObserver(
        () => {

          const isHidden =
            o.classList.contains(
              "hidden"
            );


          /*
            hidden -> visible
          */
          if(
            wasHidden &&
            !isHidden
          ){
            startOpen();
          }


          wasHidden =
            isHidden;

        }
      );


    observer.observe(
      o,
      {
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );


    /*
      If page somehow loads with Themes open.
    */
    if(!wasHidden){

      requestAnimationFrame(
        startOpen
      );

    }

  }



  /* ========================================================
     ESC
     Capture before original app handler.
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


      const o = overlay();


      if(
        !o ||
        o.classList.contains(
          "hidden"
        )
      ){
        return;
      }


      event.preventDefault();

      event.stopPropagation();

      event.stopImmediatePropagation();


      startClose();

    },
    true
  );



  /* ========================================================
     CLOSE X
     ======================================================== */

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "#skins-close"
        );


      if(!button){
        return;
      }


      const o = overlay();


      if(
        !o ||
        o.classList.contains(
          "hidden"
        )
      ){
        return;
      }


      event.preventDefault();

      event.stopPropagation();

      event.stopImmediatePropagation();


      startClose();

    },
    true
  );



  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      initialise,
      {
        once:true
      }
    );

  }else{

    initialise();

  }


})();
