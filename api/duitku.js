export default async function handler(req,res){
  if(req.method !== "POST") return res.status(405).end();

  const {amount, product} = req.body;

  res.status(200).json({
    paymentUrl: "https://sandbox.duitku.com/mock-payment"
  });
}