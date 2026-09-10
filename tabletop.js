/* ==========================================================
   SPIDER YARD — TABLETOP UX V2
   Presentation helpers only.
   ========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if(
      window.innerWidth <= 700
    ){
      return;
    }


    /* ======================================================
       DESK PROPS
       ====================================================== */

    const props = [

      {
        id:"prop-lamp",
        src:"/assets/tabletop/lamp.webp"
      },

      {
        id:"prop-ivy-left",
        src:"/assets/tabletop/ivy.webp"
      },

      {
        id:"prop-books",
        src:"/assets/tabletop/books.webp"
      },

      {
        id:"prop-coffee",
        src:"/assets/tabletop/coffee.webp"
      },

      {
        id:"prop-leather-book",
        src:"/assets/tabletop/leather-book.webp"
      }

    ];


    props.forEach(
      item => {

        if(
          document.getElementById(
            item.id
          )
        ){
          return;
        }


        const img =
          document.createElement(
            "img"
          );


        img.id =
          item.id;


        img.className =
          "tabletop-prop";


        img.src =
          item.src;


        img.alt = "";


        img.draggable =
          false;


        img.setAttribute(
          "aria-hidden",
          "true"
        );


        document.body.appendChild(
          img
        );

      }
    );



    /* ======================================================
       FOUNDATION COUNTER
       ====================================================== */

    const foundations =
      document.querySelector(
        ".foundations"
      );


    let previousCompleted =
      0;


    function foundationCompletedCount(){

      if(!foundations){
        return 0;
      }


      const slots =
        [
          ...foundations.querySelectorAll(
            ".foundation-slot"
          )
        ];


      return slots.filter(
        slot => {

          /*
            Different versions of the game
            can render a completed foundation
            using text, children or a class.
          */

          return (
            slot.children.length > 0 ||
            slot.textContent.trim() !== "" ||
            slot.classList.contains(
              "completed"
            ) ||
            slot.classList.contains(
              "filled"
            )
          );

        }
      ).length;

    }


    function updateFoundations(){

      if(!foundations){
        return;
      }


      const completed =
        foundationCompletedCount();


      foundations.dataset.completed =
        String(completed);


      if(
        completed >
        previousCompleted
      ){

        const slots =
          [
            ...foundations.querySelectorAll(
              ".foundation-slot"
            )
          ];


        const newest =
          slots.findLast
            ? slots.findLast(
                slot =>
                  slot.children.length > 0 ||
                  slot.textContent.trim() !== ""
              )
            : slots
                .slice()
                .reverse()
                .find(
                  slot =>
                    slot.children.length > 0 ||
                    slot.textContent.trim() !== ""
                );


        if(newest){

          newest.classList.remove(
            "sy-foundation-pop"
          );


          void newest.offsetWidth;


          newest.classList.add(
            "sy-foundation-pop"
          );


          setTimeout(
            () => {

              newest.classList.remove(
                "sy-foundation-pop"
              );

            },
            600
          );

        }

      }


      previousCompleted =
        completed;

    }


    if(foundations){

      updateFoundations();


      const foundationObserver =
        new MutationObserver(
          updateFoundations
        );


      foundationObserver.observe(
        foundations,
        {
          childList:true,
          subtree:true,
          characterData:true,
          attributes:true
        }
      );

    }



    /* ======================================================
       THEMES / ADULT AUDIENCE UX
       ====================================================== */

    const skinsOverlay =
      document.getElementById(
        "skins-overlay"
      );


    function getAudience(
      text
    ){

      const lower =
        (
          text ||
          ""
        ).toLowerCase();


      if(
        lower.includes(
          "midnight velvet"
        )
      ){
        return "Straight";
      }


      if(
        lower.includes(
          "rose garden"
        )
      ){
        return "Gay";
      }


      if(
        lower.includes(
          "golden harbor"
        )
      ){
        return "Lesbian";
      }


      return "";
    }



    function decorateThemeCards(){

      document
        .querySelectorAll(
          "#skins-grid .skin-card"
        )
        .forEach(
          card => {

            const audience =
              getAudience(
                card.textContent
              );


            if(!audience){
              return;
            }


            /*
              Store semantically but do not show
              outside the actual Themes book.
            */

            card.dataset.audience =
              audience;


            const swatch =
              card.querySelector(
                ".swatch"
              );


            if(!swatch){
              return;
            }


            let badge =
              swatch.querySelector(
                ".skin-audience-badge"
              );


            if(!badge){

              badge =
                document.createElement(
                  "span"
                );


              badge.className =
                "skin-audience-badge";


              swatch.appendChild(
                badge
              );

            }


            badge.textContent =
              audience;


            const lock =
              swatch.querySelector(
                ".skin-preview-lock"
              );


            if(lock){

              let label =
                lock.querySelector(
                  ".skin-preview-lock-label"
                );


              if(!label){

                label =
                  document.createElement(
                    "span"
                  );


                label.className =
                  "skin-preview-lock-label";


                lock.appendChild(
                  label
                );

              }


              label.textContent =
                audience;

            }

          }
        );

    }


    decorateThemeCards();



    const skinsGrid =
      document.getElementById(
        "skins-grid"
      );


    if(skinsGrid){

      const themeObserver =
        new MutationObserver(
          decorateThemeCards
        );


      themeObserver.observe(
        skinsGrid,
        {
          childList:true,
          subtree:true
        }
      );

    }



    /* ======================================================
       KNOW WHEN THE BOOK IS OPEN
       ====================================================== */

    function syncBookState(){

      if(!skinsOverlay){
        return;
      }


      const open =
        !skinsOverlay
          .classList
          .contains(
            "hidden"
          );


      document.body
        .classList
        .toggle(
          "skins-open",
          open
        );

    }


    if(skinsOverlay){

      syncBookState();


      const overlayObserver =
        new MutationObserver(
          syncBookState
        );


      overlayObserver.observe(
        skinsOverlay,
        {
          attributes:true,
          attributeFilter:[
            "class",
            "style"
          ]
        }
      );

    }



    /* ======================================================
       ESCAPE CLOSE FEEL
       Existing game handler can still perform closing.
       We only add animation state.
       ====================================================== */

    document.addEventListener(
      "keydown",
      event => {

        if(
          event.key !==
          "Escape"
        ){
          return;
        }


        document.body
          .classList
          .remove(
            "skins-open"
          );

      }
    );



    /* ======================================================
       TACTILE POINTER DEPTH
       ====================================================== */

    document
      .querySelectorAll(
        ".sy-btn, .stock-pile"
      )
      .forEach(
        element => {

          element.addEventListener(
            "pointerdown",
            () => {

              element.classList.add(
                "sy-pressed"
              );

            }
          );


          const release = () => {

            element.classList.remove(
              "sy-pressed"
            );

          };


          element.addEventListener(
            "pointerup",
            release
          );


          element.addEventListener(
            "pointercancel",
            release
          );


          element.addEventListener(
            "pointerleave",
            release
          );

        }
      );

  }
);
