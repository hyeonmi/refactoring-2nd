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

function statement(invoice){
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역(고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;

  for(let perf of invoice.performances){
    volumeCredits += volumeCreditsFor(perf);

    // 청구 내역 출력
    result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석) \n`;
    totalAmount += amountFor(perf)
  }

  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}