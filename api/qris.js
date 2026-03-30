import crypto from "crypto"

let db = {}

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

    const data = await r.json()

    db[orderId] = {
      status:"PENDING",
      data
    }

    setTimeout(()=>delete db[orderId], 3600000)

    res.json({
      qrString:data.qrString,
      orderId
    })

  }catch(e){
    res.status(500).json({error:"server error"})
  }

}