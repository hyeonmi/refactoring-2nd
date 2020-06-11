function amountFor(performance){
  let result = 0;

  switch(playFor(performance).type){
    case "tragedy":
      result = 40000;
      if(performance.audience > 30){
        result += 1000 *  (performance.audience  - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if(performance.audience > 20){
        result += 10000 + 500 * (performance.audience - 20);
      }

      result += 300 * performance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${playFor(performance).type}`);
  }
  return result
}

function playFor(performance){
  return plays[performance.playID];
}

function volumeCreditsFor (performance) {
  let result = 0;
  result += Math.max(performance.audience - 30, 0);

  if("comedy" === playFor(performance).type) {
    result += Math.floor(performance.audience / 5);
  }

  return result;
}

function usd(number){
  return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(number/100);
}

function totalVolumeCredits(invoice){
  let result = 0;
  for(let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function totalAmount(invoice){
  let result = 0;
  for(let perf of invoice.performances){
    result += amountFor(perf)
  }
  return result;
}

function statement(invoice){
  let result = `청구 내역(고객명: ${invoice.customer})\n`;

  for(let perf of invoice.performances){
    // 청구 내역 출력
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석) \n`;
  }

  result += `총액: ${usd(totalAmount(invoice))}\n`;
  result += `적립 포인트: ${totalVolumeCredits(invoice)}점\n`;
  return result;
}