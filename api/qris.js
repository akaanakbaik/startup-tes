import crypto from "crypto"

const activeOrders = new Map()

export default async function handler(req,res){

  const merchantCode="DS29215"
  const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

  const {plan="Paket Server", amount=40000} = req.body

  const existing = Array.from(activeOrders.values()).find(x=>x.status==="PENDING")
  if(existing){
    return res.json(existing.data)
  }

  const orderId="ORD"+Date.now()

  const signature=crypto.createHash("md5")
  .update(merchantCode+orderId+amount+apiKey)
  .digest("hex")

  const payload={
    merchantCode,
    paymentAmount:amount,
    paymentMethod:"SP",
    merchantOrderId:orderId,
    productDetails:plan,
    email:"test@test.com",
    customerVaName:"AKADEV STORE",
    callbackUrl:"https://store.domku.xyz/api/callback",
    returnUrl:"https://store.domku.xyz/return",
    signature,
    expiryPeriod:10
  }

  const r = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  })

  const data = await r.json()

  activeOrders.set(orderId,{
    status:"PENDING",
    data
  })

  res.json({
    orderId,
    ...data
  })
}