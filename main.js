let selected = {};

function goCheckout(name, price){
  selected = {name, price};
  document.getElementById("plan").innerText = "Paket: " + name;
  document.getElementById("price").innerText = "Harga: Rp" + price;
  document.getElementById("checkout").style.display = "block";
  window.location = "#checkout";
}

async function pay(){
  const res = await fetch(CONFIG.duitkuApi,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      amount:selected.price,
      product:selected.name
    })
  });
  const data = await res.json();
  window.location = data.paymentUrl;
}