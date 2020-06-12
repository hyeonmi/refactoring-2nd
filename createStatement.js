
class PerformanceCalculator {
  constructor (performance, play) {
    this.performance = performance;
    this.play = play;
  }

  get amount(){
    switch(this.play.type){
      case "tragedy":
        throw "오류 발생";
      case "comedy":
        throw "오류 발생";
      default:
        throw new Error(`알 수 없는 장르 : ${this.performance.play.type}`);
    }
  }

  get volumeCredits(){
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);

    if("comedy" === this.play.type) {
      result += Math.floor(this.performance.audience / 5);
    }

    return result;
  }

}

class TragedyCalculator extends PerformanceCalculator {
  get amount(){
    let result = 40000;
    if(this.performance.audience > 30){
      result += 1000 *  (this.performance.audience - 30);
    }
    return result
  }
}

class ComedyCalculator  extends PerformanceCalculator {
  get amount(){
    let result = 30000;
    if(this.performance.audience > 20){
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
}

function createPerformanceCalculator (performance, play) {
  switch (play.type) {
    case "tragedy": return new TragedyCalculator(performance, play);
    case "comedy": return new ComedyCalculator(performance, play);
    default:
      throw new Error(`알 수 없는 장르 : ${play.type}`);
  }
}

function enrichPerformance(performance, plays){
  const calculator = createPerformanceCalculator(performance, playFor(performance, plays))
  const result = Object.assign({}, performance);
  result.play = calculator.play;
  result.amount = calculator.amount;
  result.volumeCredits = calculator.volumeCredits;
  return result;
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