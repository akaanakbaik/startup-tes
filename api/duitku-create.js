import crypto from "crypto"

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success:false })
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

    if (price < 10000) {
      return res.status(400).json({
        success:false,
        message:"Minimum pembayaran Rp10.000"
      })
    }

    const merchantOrderId = "INV" + Date.now()
    const paymentAmount = price

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + merchantOrderId + paymentAmount + apiKey)
      .digest("hex")

    const duitkuRes = await fetch(
      "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantCode,
          paymentAmount,
          paymentMethod: "NQ",
          merchantOrderId,
          productDetails: name,
          email,
          customerVaName: "Akadev User",
          phoneNumber: "081266950382",
          itemDetails: [
            { name, price: paymentAmount, quantity: 1 }
          ],
          customerDetail: {
            firstName: "Akadev",
            email,
            phoneNumber: "081266950382"
          },
          callbackUrl: "https://store.domku.xyz/callback",
          returnUrl: "https://store.domku.xyz",
          signature,
          expiryPeriod: 24
        })
      }
    )

    const text = await duitkuRes.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return res.status(500).json({
        success:false,
        message:text
      })
    }

    if (data.statusCode !== "00") {
      return res.status(400).json({
        success:false,
        message:data.statusMessage || "Transaksi gagal"
      })
    }

    return res.status(200).json({
      success:true,
      qrString:data.qrString,
      merchantOrderId
    })

  } catch (err) {
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}