function enrichPerformance(performance, plays){
  const result = Object.assign({}, performance);
  result.play = playFor(result, plays);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result)
  return result;
}

function volumeCreditsFor (performance) {
  let result = 0;
  result += Math.max(performance.audience - 30, 0);

  if("comedy" === performance.play.type) {
    result += Math.floor(performance.audience / 5);
  }

  return result;
}

function amountFor(performance){
  let result = 0;

  switch(performance.play.type){
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
      throw new Error(`알 수 없는 장르 : ${performance.play.type}`);
  }
  return result
}

function playFor(performance, plays){
  return plays[performance.playID];
}

function totalVolumeCredits(data){
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
}

function totalAmount(data){
  return data.performances.reduce((total, p) => total + p.amount, 0)
}

function createStatementData(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(p => enrichPerformance(p, plays));
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
}