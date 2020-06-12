class PerformanceCalculator {
  constructor (performance, play) {
    this.performance = performance;
    this.play = play;
  }

  get amount(){
    let result = 0;

    switch(this.performance.play.type){
      case "tragedy":
        result = 40000;
        if(this.performance.audience > 30){
          result += 1000 *  (this.performance.audience  - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if(this.performance.audience > 20){
          result += 10000 + 500 * (this.performance.audience - 20);
        }

        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르 : ${this.performance.play.type}`);
    }
    return result
  }

}

function enrichPerformance(performance, plays){
  const calculator = new PerformanceCalculator(performance, playFor(performance, plays))
  const result = Object.assign({}, performance);
  result.play = calculator.play;
  result.amount = amountFor(result, plays);
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

function amountFor (performance, plays) {
  return new PerformanceCalculator(performance, playFor(performance, plays)).amount
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