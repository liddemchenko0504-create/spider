const Stripe = require("stripe");

module.exports = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    res.status(400).json({ error: "Missing session_id" });
    return;
  }

  const { STRIPE_SECRET_KEY } = process.env;

  if (!STRIPE_SECRET_KEY) {
    res.status(500).json({
      error: "Missing STRIPE_SECRET_KEY"
    });
    return;
  }

  const stripe = Stripe(STRIPE_SECRET_KEY);

  try {
    const session =
      await stripe.checkout.sessions.retrieve(session_id);

    res.status(200).json({
      valid: session.payment_status === "paid"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
