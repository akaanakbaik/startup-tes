import crypto from "crypto"
import fetch from "node-fetch"

export default async function handler(req,res){
const merchantCode="DS29215"
const apiKey="APIKEY_LO"
const orderId="ORD"+Date.now()
const amount=40000

const signature=crypto.createHash("md5")
.update(merchantCode+orderId+amount+apiKey)
.digest("hex")

const body={
merchantCode,
paymentAmount:amount,
paymentMethod:"SP",
merchantOrderId:orderId,
productDetails:"QRIS TEST",
email:"test@test.com",
customerVaName:"AKADEV",
callbackUrl:"https://store.domku.xyz/callback",
returnUrl:"https://store.domku.xyz/return",
signature,
expiryPeriod:10
}

const r=await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(body)
})

const data=await r.json()

res.json({success:true,data})
}