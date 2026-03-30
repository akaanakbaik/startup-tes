let db = global.db || (global.db = {})

export default async function handler(req,res){

  const {orderId} = req.body || {}

  if(!orderId){
    return res.json({status:"NOT_FOUND"})
  }

  if(!db[orderId]){
    return res.json({status:"EXPIRED"})
  }

  res.json({
    status: db[orderId].status
  })

}