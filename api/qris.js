import crypto from "crypto"

let db = global.db || (global.db = {})

export default async function handler(req,res){

  try{

    const merchantCode="DS29215"
    const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

    const amount=40000
    const orderId="INV"+Date.now()

    const signature = crypto.createHash("md5")
    .update(merchantCode + orderId + amount + apiKey)
    .digest("hex")

    const payload={
      merchantCode,
      paymentAmount:amount,
      paymentMethod:"SP",
      merchantOrderId:orderId,
      productDetails:"Pembayaran QRIS",
      email:"test@test.com",
      customerVaName:"AKADEV STORE",
      callbackUrl:"https://store.domku.xyz/api/callback",
      returnUrl:"https://store.domku.xyz/success",
      signature,
      expiryPeriod:10
    }

    const r = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    })

    const text = await r.text()

    let data
    try{
      data = JSON.parse(text)
    }catch{
      return res.status(500).json({error:"duitku invalid response",raw:text})
    }

    if(!data.qrString){
      return res.status(500).json({error:"duitku failed",data})
    }

    db[orderId] = {
      status:"PENDING",
      amount,
      reference:data.reference
    }

    setTimeout(()=>delete db[orderId], 3600000)

    res.json({
      qrString:data.qrString,
      orderId
    })

  }catch(e){
    res.status(500).json({error:e.message})
  }

}