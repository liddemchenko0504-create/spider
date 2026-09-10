const session = await stripe.checkout.sessions.create({
  mode: "payment",

  managed_payments: {
    enabled: false
  },

  payment_method_types: ["card"],

  line_items: [
    {
      price: STRIPE_PRICE_ID,
      quantity: 1
    }
  ],

  success_url:
    `${SITE_URL}/?session_id={CHECKOUT_SESSION_ID}&premium=1`,

  cancel_url:
    `${SITE_URL}/?canceled=1`
});

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
