import crypto from "crypto"
import { getInvoice } from "./invoice.js"
import { getOrder } from "./callback.js"

export default async function handler(req,res){

  const {orderId} = req.body

  const cb = getOrder(orderId)
  if(cb){
    return res.json({status:cb.status})
  }

  const inv = getInvoice(orderId)
  if(!inv){
    return res.json({status:"UNKNOWN"})
  }

  const merchantCode="DS29215"
  const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

  const signature = crypto.createHash("md5")
  .update(merchantCode + orderId + apiKey)
  .digest("hex")

  const payload={
    merchantCode,
    merchantOrderId:orderId,
    signature
  }

  const r = await fetch("https://sandbox.duitku.com/webapi/api/merchant/transactionStatus",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  })

  const data = await r.json()

  let status="PENDING"

  if(data.statusCode==="00") status="SUCCESS"
  if(data.statusCode==="02") status="CANCELED"

  res.json({status})
}