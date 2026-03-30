import crypto from "crypto"

const invoices = new Map()

export default async function handler(req,res){

  const merchantCode="DS29215"
  const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

  const {plan,amount,method} = req.body

  const orderId="INV"+Date.now()

  if(invoices.has(orderId)){
    return res.status(400).json({error:"duplicate"})
  }

  const signature = crypto.createHash("md5")
  .update(merchantCode+orderId+amount+apiKey)
  .digest("hex")

  const payload={
    merchantCode,
    paymentAmount:amount,
    paymentMethod:method,
    merchantOrderId:orderId,
    productDetails:plan,
    email:"test@test.com",
    customerVaName:"AKADEV STORE",
    callbackUrl:"https://store.domku.xyz/api/callback",
    returnUrl:"https://store.domku.xyz/return",
    signature,
    expiryPeriod: method==="NQ" ? 1440 : 10
  }

  const r = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  })

  const data = await r.json()

  invoices.set(orderId,{
    status:"PENDING",
    reference:data.reference,
    amount,
    method,
    plan
  })

  res.json({
    orderId,
    ...data
  })
}

export function getInvoice(id){
  return invoices.get(id)
}