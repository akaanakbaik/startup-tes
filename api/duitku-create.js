import crypto from "crypto"

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success:false, message:"Method not allowed" })
    }

    const merchantCode = "DS29215"
    const apiKey = "79fbf35e6a735c573fc56cfa8dc25be8"

    const { name, price, email } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success:false,
        message:"Data tidak lengkap"
      })
    }

    const merchantOrderId = "INV" + Date.now()
    const paymentAmount = price

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + merchantOrderId + paymentAmount + apiKey)
      .digest("hex")

    const duitkuRes = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        merchantCode,
        paymentAmount,
        paymentMethod: "BC",
        merchantOrderId,
        productDetails: name,
        email,
        customerVaName: "Akadev User",
        phoneNumber: "081266950382",
        itemDetails: [
          {
            name: name,
            price: paymentAmount,
            quantity: 1
          }
        ],
        customerDetail: {
          firstName: "Akadev",
          email: email,
          phoneNumber: "081266950382",
          billingAddress: {
            firstName: "Akadev",
            address: "Ujung Gading",
            city: "Pasaman Barat",
            postalCode: "26572",
            phone: "081266950382",
            countryCode: "ID"
          }
        },
        callbackUrl: "https://store.domku.xyz/callback",
        returnUrl: "https://store.domku.xyz",
        signature,
        expiryPeriod: 60
      })
    })

    const data = await duitkuRes.json()

    if (data.statusCode !== "00") {
      return res.status(400).json({
        success:false,
        message:data.statusMessage || "Transaksi gagal",
        duitku:data
      })
    }

    return res.status(200).json({
      success:true,
      paymentUrl:data.paymentUrl
    })

  } catch (err) {
    return res.status(500).json({
      success:false,
      message:"Server error",
      error:err.message
    })
  }
}