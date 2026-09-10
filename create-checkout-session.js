// Vercel serverless function.
// Creates a Stripe Checkout Session for the "Premium skins" one-time purchase.
//
// Required environment variables (set these in the Vercel project settings,
// NOT in this file, and never commit real keys to GitHub):
//   STRIPE_SECRET_KEY   - your Stripe secret key (sk_live_... or sk_test_...)
//   STRIPE_PRICE_ID     - the Price ID of your "Premium skins" product in Stripe
//   SITE_URL            - the public URL of your deployed site,
//                          e.g. https://your-project.vercel.app

const Stripe = require("stripe");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SITE_URL } = process.env;

  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID || !SITE_URL) {
    res.status(500).json({
      error:
        "Missing Stripe configuration. Set STRIPE_SECRET_KEY, STRIPE_PRICE_ID and SITE_URL in your Vercel environment variables."
    });
    return;
  }

  const stripe = Stripe(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${SITE_URL}/?session_id={CHECKOUT_SESSION_ID}&premium=1`,
      cancel_url: `${SITE_URL}/?canceled=1`
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: err.message });
  }
};
