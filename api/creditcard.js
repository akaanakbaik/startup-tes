import crypto from "crypto"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false })
  }

  try {
    const { amount } = req.body

    const merchantCode = "DS29215"
    const apiKey = "79fbf35e6a735c573fc56cfa8dc25be8"

    const orderId = "INV" + Date.now()

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + orderId + amount + apiKey)
      .digest("hex")

    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: "VC",
      merchantOrderId: orderId,
      productDetails: "Pembayaran Credit Card",
      email: "test@test.com",
      customerVaName: "AKADEV STORE",
      itemDetails: [
        {
          name: "Server Panel",
          price: amount,
          quantity: 1
        }
      ],
      customerDetail: {
        firstName: "Akadev",
        lastName: "Store",
        email: "test@test.com",
        phoneNumber: "08123456789",
        billingAddress: {
          firstName: "Akadev",
          lastName: "Store",
          address: "Indonesia",
          city: "Padang",
          postalCode: "25100",
          phone: "08123456789",
          countryCode: "ID"
        },
        shippingAddress: {
          firstName: "Akadev",
          lastName: "Store",
          address: "Indonesia",
          city: "Padang",
          postalCode: "25100",
          phone: "08123456789",
          countryCode: "ID"
        }
      },
      callbackUrl: "https://store.domku.xyz/api/callback",
      returnUrl: "https://store.domku.xyz/result",
      signature,
      expiryPeriod: 30
    }

    const duitku = await fetch(
      "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    const data = await duitku.json()

    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}