import crypto from "crypto"

const orders = new Map()

export default async function handler(req,res){

  const {
    merchantCode,
    amount,
    merchantOrderId,
    resultCode,
    reference,
    signature
  } = req.body

  const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

  const validSig = crypto.createHash("md5")
  .update(merchantCode + amount + merchantOrderId + apiKey)
  .digest("hex")

  if(signature !== validSig){
    return res.status(400).send("INVALID SIGNATURE")
  }

  let status="PENDING"

  if(resultCode==="00") status="SUCCESS"
  if(resultCode==="01") status="FAILED"

  orders.set(merchantOrderId,{
    status,
    reference,
    amount
  })

  res.status(200).send("OK")
}

export function getOrder(id){
  return orders.get(id)
}