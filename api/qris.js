import crypto from "crypto"

export default async function handler(req,res){

  try{

    if(req.method !== "POST"){
      return res.status(405).json({error:true,message:"Method not allowed"})
    }

    const merchantCode="DS29215"
    const apiKey="79fbf35e6a735c573fc56cfa8dc25be8"

    const body = req.body || {}
    const plan = body.plan || "Paket Server"
    const amount = body.amount || 40000

    if(!amount || amount < 10000){
      return res.status(400).json({error:true,message:"Nominal tidak valid"})
    }

    const orderId="ORD"+Date.now()

    const signature = crypto.createHash("md5")
    .update(merchantCode + orderId + amount + apiKey)
    .digest("hex")

    const payload = {
      merchantCode,
      paymentAmount:amount,
      paymentMethod:"SP",
      merchantOrderId:orderId,
      productDetails:plan,
      additionalParam:"",
      merchantUserInfo:"akadev-user",
      customerVaName:"AKADEV STORE",
      email:"test@test.com",
      phoneNumber:"08123456789",
      itemDetails:[
        {
          name:plan,
          price:amount,
          quantity:1
        }
      ],
      customerDetail:{
        firstName:"Akadev",
        lastName:"User",
        email:"test@test.com",
        phoneNumber:"08123456789",
        billingAddress:{
          firstName:"Akadev",
          lastName:"User",
          address:"Indonesia",
          city:"Padang",
          postalCode:"25100",
          phone:"08123456789",
          countryCode:"ID"
        },
        shippingAddress:{
          firstName:"Akadev",
          lastName:"User",
          address:"Indonesia",
          city:"Padang",
          postalCode:"25100",
          phone:"08123456789",
          countryCode:"ID"
        }
      },
      callbackUrl:"https://store.domku.xyz/api/callback",
      returnUrl:"https://store.domku.xyz/return",
      signature,
      expiryPeriod:10
    }

    const r = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(payload)
    })

    const text = await r.text()

    let data
    try{
      data = JSON.parse(text)
    }catch{
      return res.status(500).json({
        error:true,
        message:"Response Duitku tidak valid",
        raw:text
      })
    }

    if(!r.ok){
      return res.status(500).json({
        error:true,
        message:data.Message || "Gagal dari Duitku",
        data
      })
    }

    if(!data.qrString){
      return res.status(500).json({
        error:true,
        message:"QR tidak tersedia",
        data
      })
    }

    return res.status(200).json({
      success:true,
      orderId,
      reference:data.reference,
      amount:data.amount,
      qrString:data.qrString,
      paymentUrl:data.paymentUrl
    })

  }catch(err){

    return res.status(500).json({
      error:true,
      message:err.message
    })

  }
}