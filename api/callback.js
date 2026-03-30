import crypto from "crypto"

let db = global.db || (global.db = {})

export default async function handler(req,res){

  try{

    const body = req.body

    const merchantCode = body.merchantCode
    const amount = body.amount
    const orderId = body.merchantOrderId
    const signature = body.signature

    const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

    const valid = crypto.createHash("md5")
    .update(merchantCode + amount + orderId + apiKey)
    .digest("hex")

    if(signature !== valid){
      return res.status(400).send("INVALID SIGNATURE")
    }

    if(db[orderId]){
      db[orderId].status = body.resultCode === "00" ? "SUCCESS" : "FAILED"
    }

    res.status(200).send("OK")

  }catch(e){
    res.status(500).send("ERROR")
  }

}