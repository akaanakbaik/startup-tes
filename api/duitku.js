export default function handler(req,res){
  res.status(200).json({
    paymentUrl:"https://sandbox.duitku.com/mock"
  })
}