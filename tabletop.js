/* ==========================================================
   SPIDER YARD TABLETOP DECOR
   Pure presentation — game logic untouched.
   ========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if(
      window.innerWidth <= 700
    ){
      return;
    }


    const props = [
      {
        id:"prop-lamp",
        src:"/assets/tabletop/lamp.webp",
        alt:""
      },

      {
        id:"prop-ivy-left",
        src:"/assets/tabletop/ivy.webp",
        alt:""
      },

      {
        id:"prop-books",
        src:"/assets/tabletop/books.webp",
        alt:""
      },

      {
        id:"prop-coffee",
        src:"/assets/tabletop/coffee.webp",
        alt:""
      },

      {
        id:"prop-leather-book",
        src:"/assets/tabletop/leather-book.webp",
        alt:""
      },

      {
        id:"prop-photos",
        src:"/assets/tabletop/photos.webp",
        alt:""
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


        img.alt =
          item.alt;


        img.draggable =
          false;


        document.body.appendChild(
          img
        );

      }
    );

  }
);
