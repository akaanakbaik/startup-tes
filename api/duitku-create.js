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

    const duitkuRes = await fetch("https://sandbox.duitku.com/webapi/api/merchant/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        merchantCode,
        paymentAmount,
        merchantOrderId,
        productDetails: name,
        email,
        paymentMethod: "SP",
        callbackUrl: "https://store.domku.xyz/callback",
        returnUrl: "https://store.domku.xyz",
        signature
      })
    })

    const text = await duitkuRes.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return res.status(500).json({
        success:false,
        message:"Response Duitku tidak valid"
      })
    }

    if (!data.paymentUrl) {
      return res.status(400).json({
        success:false,
        message:"Gagal membuat transaksi"
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