import crypto from "crypto"

export default async function handler(req,res){

  try{

    const merchantCode="DS29215"
    const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

    const {plan="Paket Server", amount=40000} = req.body || {}

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

    const text = await r.text()

    let data

    try{
      data = JSON.parse(text)
    }catch{
      return res.status(500).json({
        error:true,
        message:"Duitku response invalid",
        raw:text
      })
    }

    if(!data.qrString){
      return res.status(500).json({
        error:true,
        message:"QR gagal dibuat",
        data
      })
    }

    res.json({
      success:true,
      orderId,
      ...data
    })

  }catch(err){

    res.status(500).json({
      error:true,
      message:err.message
    })
  }
}