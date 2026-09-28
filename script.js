// FOODIE HUB - Basic JavaScript + jQuery
$(document).ready(function () {
  const foodData = [
    {
      id: 1, name: "Classic Beef Burger", price: 12.90, category: "Burgers",
      description: "Juicy beef patty with fresh lettuce, tomato and our signature sauce.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2, name: "Crispy Chicken Burger", price: 11.90, category: "Burgers",
      description: "Crispy golden chicken fillet with crunchy lettuce and creamy sauce.",
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3, name: "Margherita Pizza", price: 15.90, category: "Pizza",
      description: "Classic tomato sauce, mozzarella and fresh basil on a crispy crust.",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4, name: "Chicken Pepperoni Pizza", price: 18.90, category: "Pizza",
      description: "Loaded with chicken pepperoni, melted cheese and rich tomato sauce.",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5, name: "Chicken Mee Goreng", price: 10.90, category: "Noodles",
      description: "Wok-fried noodles with chicken, vegetables, egg and savoury sauce.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6, name: "Spicy Tom Yum Noodles", price: 13.90, category: "Noodles",
      description: "Aromatic spicy tom yum broth with noodles, vegetables and chicken.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7, name: "Iced Lemon Tea", price: 4.90, category: "Drinks",
      description: "Refreshing iced tea with zesty lemon and a lightly sweet finish.",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8, name: "Chocolate Milkshake", price: 7.90, category: "Drinks",
      description: "Rich and creamy chocolate milkshake served chilled.",
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
    }
  ];

  let cart = JSON.parse(localStorage.getItem("foodieHubCart")) || [];
  let activeFilter = "All";
  let selectedFood = null;
  let modalQuantity = 1;

  const money = (value) => `RM${value.toFixed(2)}`;

  function saveCart() {
    localStorage.setItem("foodieHubCart", JSON.stringify(cart));
  }

  function renderFoodMenu() {
    const search = $("#foodSearch").val().trim().toLowerCase();
    const filtered = foodData.filter(food => {
      const matchesCategory = activeFilter === "All" || food.category === activeFilter;
      const text = `${food.name} ${food.category} ${food.description}`.toLowerCase();
      return matchesCategory && text.includes(search);
    });

    const $grid = $("#foodGrid");
    $grid.empty();

    filtered.forEach(food => {
      $grid.append(`
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 food-item">
          <article class="food-card">
            <div class="food-img-wrap">
              <img src="${food.image}" alt="${food.name}" class="food-img">
              <span class="food-badge">${food.category}</span>
            </div>
            <div class="food-card-body">
              <h3>${food.name}</h3>
              <p>${food.description}</p>
              <button class="btn details-btn view-details" data-id="${food.id}">
                View Details <i class="fa-solid fa-chevron-right"></i>
              </button>
              <div class="food-bottom mt-2">
                <span class="price">${money(food.price)}</span>
                <button class="btn btn-primary-custom add-btn add-to-cart" data-id="${food.id}" aria-label="Add ${food.name} to cart">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              </div>
            </div>
          </article>
        </div>
      `);
    });

    $("#noFood").toggleClass("d-none", filtered.length !== 0);
  }

  function renderCart() {
    const $items = $("#cartItems");
    $items.empty();

    if (cart.length === 0) {
      $("#emptyCart").removeClass("d-none");
    } else {
      $("#emptyCart").addClass("d-none");
      cart.forEach(item => {
        const total = item.price * item.quantity;
        $items.append(`
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <div class="cart-item-price">${money(total)}</div>
              <div class="cart-actions">
                <div class="qty-small">
                  <button class="cart-minus" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button>
                  <span>${item.quantity}</span>
                  <button class="cart-plus" data-id="${item.id}" aria-label="Increase ${item.name}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}" aria-label="Remove ${item.name}">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        `);
      });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal === 0 ? 0 : (subtotal >= 30 ? 0 : 3);
    const total = subtotal + delivery;
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    $("#cartCount").text(count);
    $("#cartSubtotal").text(money(subtotal));
    $("#cartDelivery").text(delivery === 0 && subtotal > 0 ? "FREE" : money(delivery));
    $("#cartTotal").text(money(total));
    $("#checkoutTotal").text(money(total));
    $("#checkoutBtn").prop("disabled", cart.length === 0);
  }

  function addToCart(id, quantity = 1) {
    const food = foodData.find(item => item.id === id);
    if (!food) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: food.id,
        name: food.name,
        price: food.price,
        quantity: quantity,
        image: food.image
      });
    }

    saveCart();
    renderCart();
    showToast(`${food.name} added to your cart.`);
  }

  function updateQuantity(id, change) {
    const item = cart.find(product => product.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(product => product.id !== id);
    saveCart();
    renderCart();
  }

  function showToast(message) {
    const id = "toast-" + Date.now();
    $("#toastContainer").append(`
      <div id="${id}" class="toast toast-custom show" role="alert">
        <div class="toast-body"><i class="fa-solid fa-circle-check text-success me-2"></i>${message}</div>
      </div>
    `);
    setTimeout(() => $(`#${id}`).fadeOut(250, function () { $(this).remove(); }), 2300);
  }

  function openFoodModal(id) {
    selectedFood = foodData.find(item => item.id === id);
    if (!selectedFood) return;

    modalQuantity = 1;
    $("#modalImage").attr({ src: selectedFood.image, alt: selectedFood.name });
    $("#modalCategory").text(selectedFood.category);
    $("#foodModalTitle").text(selectedFood.name);
    $("#modalDescription").text(selectedFood.description);
    $("#modalPrice").text(money(selectedFood.price));
    $("#modalQuantity").text(modalQuantity);
    bootstrap.Modal.getOrCreateInstance(document.getElementById("foodModal")).show();
  }

  // Category filter buttons using jQuery.
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    activeFilter = $(this).data("filter");
    renderFoodMenu();
  });

  // Real-time search using jQuery.
  $("#foodSearch").on("input", function () {
    renderFoodMenu();
  });

  // Category cards filter the menu and scroll to it.
  $(".category-card").on("click", function () {
    activeFilter = $(this).data("category");
    $(".filter-btn").removeClass("active");
    $(`.filter-btn[data-filter="${activeFilter}"]`).addClass("active");
    $("#foodSearch").val("");
    renderFoodMenu();
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  $(document).on("click", ".add-to-cart", function () {
    addToCart(Number($(this).data("id")));
  });

  $(document).on("click", ".view-details", function () {
    openFoodModal(Number($(this).data("id")));
  });

  $("#modalPlus").on("click", function () {
    modalQuantity++;
    $("#modalQuantity").text(modalQuantity);
  });

  $("#modalMinus").on("click", function () {
    if (modalQuantity > 1) modalQuantity--;
    $("#modalQuantity").text(modalQuantity);
  });

  $("#modalAddCart").on("click", function () {
    if (selectedFood) addToCart(selectedFood.id, modalQuantity);
    bootstrap.Modal.getInstance(document.getElementById("foodModal")).hide();
  });

  $(document).on("click", ".cart-plus", function () {
    updateQuantity(Number($(this).data("id")), 1);
  });

  $(document).on("click", ".cart-minus", function () {
    updateQuantity(Number($(this).data("id")), -1);
  });

  $(document).on("click", ".remove-item", function () {
    const id = Number($(this).data("id"));
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  });

  // Smooth scrolling for buttons with data-scroll.
  $("[data-scroll]").on("click", function () {
    const target = $(this).data("scroll");
    document.querySelector(target).scrollIntoView({ behavior: "smooth" });
  });

  // Checkout button closes cart and moves to checkout.
  $("#checkoutBtn").on("click", function () {
    bootstrap.Offcanvas.getInstance(document.getElementById("cartCanvas"))?.hide();
    setTimeout(() => document.querySelector("#checkout").scrollIntoView({ behavior: "smooth" }), 250);
  });

  // Order form validation.
  $("#orderForm").on("submit", function (event) {
    event.preventDefault();
    const form = this;

    if (!form.checkValidity() || cart.length === 0) {
      form.classList.add("was-validated");
      if (cart.length === 0) {
        $("#orderAlert").html(`<div class="alert alert-warning">Your cart is empty. Please add a food item before placing an order.</div>`);
      }
      return;
    }

    $("#orderAlert").html(`
      <div class="alert alert-success">
        <strong>Order placed successfully!</strong> Thank you for ordering from Foodie Hub.
      </div>
    `);

    cart = [];
    saveCart();
    renderCart();
    form.reset();
    form.classList.remove("was-validated");
  });

  // Contact form validation.
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();
    const form = this;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    $("#contactAlert").html(`
      <div class="alert alert-success">
        Your message has been sent successfully. Thank you for contacting Foodie Hub!
      </div>
    `);
    form.reset();
    form.classList.remove("was-validated");
  });

  // Back-to-top button.
  $(window).on("scroll", function () {
    $("#backTop").toggleClass("show", $(window).scrollTop() > 500);
  });

  $("#backTop").on("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Close mobile navbar after selecting a link.
  $(".navbar-nav .nav-link").on("click", function () {
    if (window.innerWidth < 992) {
      bootstrap.Collapse.getInstance(document.getElementById("mainNav"))?.hide();
    }
  });

  renderFoodMenu();
  renderCart();
});
