const Stripe = require("stripe");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const {
    STRIPE_SECRET_KEY,
    STRIPE_PRICE_ID,
    SITE_URL
  } = process.env;

  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID || !SITE_URL) {
    res.status(500).json({
      error: "Missing Stripe configuration."
    });
    return;
  }

  const stripe = Stripe(STRIPE_SECRET_KEY);

  try {
    const price = await stripe.prices.retrieve(STRIPE_PRICE_ID);

    if (price.type !== "one_time" || price.recurring) {
      res.status(400).json({
        error: "STRIPE_PRICE_ID must be a one-time price."
      });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
