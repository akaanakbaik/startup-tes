import crypto from "crypto"

export default async function handler(req,res){

  const merchantCode="DS29215"
  const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

  const orderId="ORD"+Date.now()
  const amount=40000

  const signature=crypto.createHash("md5")
  .update(merchantCode+orderId+amount+apiKey)
  .digest("hex")

  const payload={
    merchantCode,
    paymentAmount:amount,
    paymentMethod:"DA",
    merchantOrderId:orderId,
    productDetails:"DANA TEST",
    email:"test@test.com",
    customerVaName:"AKADEV STORE",
    callbackUrl:"https://store.domku.xyz/api/callback",
    returnUrl:"https://store.domku.xyz/return",
    signature,
    expiryPeriod:1440
  }

  const r=await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  })

  const data=await r.json()

  res.json(data)
}