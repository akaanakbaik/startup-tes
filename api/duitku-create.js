import crypto from "crypto"

const config = {
  merchantCode: "DS29215",
  apiKey: "79fbf35e6a735c573fc56cfa8dc25be8",
  callbackUrl: "https://store.domku.xyz/callback",
  returnUrl: "https://store.domku.xyz/return"
}

function createSignature(orderId, amount) {
  return crypto
    .createHash("md5")
    .update(config.merchantCode + orderId + amount + config.apiKey)
    .digest("hex")
}

async function createTransaction(paymentMethod, orderId, amount) {
  const signature = createSignature(orderId, amount)

  const body = {
    merchantCode: config.merchantCode,
    paymentAmount: amount,
    paymentMethod,
    merchantOrderId: orderId,
    productDetails: "Pembayaran Paket Server Akadev",
    additionalParam: "",
    merchantUserInfo: "akadev-user",
    customerVaName: "AKADEV STORE",
    email: "test@test.com",
    phoneNumber: "08123456789",
    itemDetails: [
      {
        name: "Paket Server",
        price: amount,
        quantity: 1
      }
    ],
    customerDetail: {
      firstName: "Akadev",
      lastName: "User",
      email: "test@test.com",
      phoneNumber: "08123456789",
      billingAddress: {
        firstName: "Akadev",
        lastName: "User",
        address: "Indonesia",
        city: "Padang",
        postalCode: "25100",
        phone: "08123456789",
        countryCode: "ID"
      },
      shippingAddress: {
        firstName: "Akadev",
        lastName: "User",
        address: "Indonesia",
        city: "Padang",
        postalCode: "25100",
        phone: "08123456789",
        countryCode: "ID"
      }
    },
    callbackUrl: config.callbackUrl,
    returnUrl: config.returnUrl,
    signature,
    expiryPeriod: paymentMethod === "NQ" ? 24 : 10
  }

  const res = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  return data
}

export default async function handler(req, res) {
  try {
    const orderId = "ORDER" + Date.now()
    const amount = 40000

    let result = await createTransaction("NQ", orderId, amount)

    if (!result || result.statusCode !== "00") {
      result = await createTransaction("SP", orderId, amount)

      return res.status(200).json({
        success: true,
        fallback: true,
        method: "SP",
        message: "Metode NOBU belum tersedia, menggunakan QRIS alternatif",
        data: result
      })
    }

    return res.status(200).json({
      success: true,
      fallback: false,
      method: "NQ",
      message: "QRIS NOBU berhasil dibuat",
      data: result
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada sistem pembayaran",
      error: err.message
    })
  }
}