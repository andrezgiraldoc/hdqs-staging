import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  public circuitResult: any;
  public circuitJSONResult = {};
  public width: number;
  public margin: any;
  public height: number;
  public svg: any;
  public stepLength: any;
  public quditsNumber: any;
  public quditDimensions: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(
      () => {
        if (this.router.getCurrentNavigation().extras.state) {
          const jsonResult = this.router.getCurrentNavigation().extras.state.response;
          this.quditsNumber = jsonResult.quditsNumber;
          this.quditDimensions = jsonResult.quditDimensions;
          for (const [i, stepResult] of jsonResult.result.entries()) {
            this.createChart(stepResult, stepResult.function);
          }
        }
      },
      () => {
        console.log('No results');
      }
    );
  }

  ngOnInit() {

  }

  createChart(stepResult, type) {
    if (type === 'Amps' || type === 'Density') {
      const circuitJSONResult = [];
      this.stepLength = stepResult.result.split(';').length;
      for (const [j, value] of stepResult.result.split(';').entries()) {
        circuitJSONResult[j] = {};
        const realValue = parseFloat(value.split(',')[0].replace(/\(/g, ''));
        const imagValue = parseFloat(value.split(',')[1].replace(/\)/g, ''));
        circuitJSONResult[j].realValue = realValue;
        circuitJSONResult[j].imagValue = imagValue;
        circuitJSONResult[j].amp = Math.pow(realValue, 2) + Math.pow(imagValue, 2);
        circuitJSONResult[j].row = (Math.trunc(j / Math.sqrt(this.stepLength))).toString();
        circuitJSONResult[j].col = (j % Math.sqrt(this.stepLength)).toString();
        const changedNumber = j.toString(this.quditDimensions);
        circuitJSONResult[j].state = (changedNumber + '').padStart(this.quditsNumber, '0');
        circuitJSONResult[j].decimalState = j;
        circuitJSONResult[j].showPhase = 'true';
        if (imagValue === 0) {
          if (realValue === 0) {
            circuitJSONResult[j].phase = 0;
            circuitJSONResult[j].showPhase = 'false';
          } else if (realValue > 0) {
            circuitJSONResult[j].phase = 0;
          } else if (realValue < 0) {
            circuitJSONResult[j].phase = 180;
          }
        } else if (imagValue > 0) {
          if (realValue === 0) {
            circuitJSONResult[j].phase = 90;
          } else if (realValue > 0) {
            circuitJSONResult[j].phase = this.calcAngleDegrees(imagValue, realValue);
          } else if (realValue < 0) {
            circuitJSONResult[j].phase = this.calcAngleDegrees(imagValue, realValue);
          }
        } else if (imagValue < 0) {
          if (realValue === 0) {
            circuitJSONResult[j].phase = 270;
          } else if (realValue > 0) {
            circuitJSONResult[j].phase = this.calcAngleDegrees(imagValue, realValue);
          } else if (realValue < 0) {
            circuitJSONResult[j].phase = this.calcAngleDegrees(imagValue, realValue);
          }
        }
      }
      this.margin = {top: 30, right: 30, bottom: 30, left: 30};
      this.width = 450 - this.margin.left - this.margin.right;
      this.height = 450 - this.margin.top - this.margin.bottom;
      this.drawHeatMap(circuitJSONResult, stepResult.step, stepResult.function, type);
    } else if (type === 'Chance') {
      const circuitJSONResult = [];
      this.stepLength = stepResult.result.split(';').length;
      for (const [j, value] of stepResult.result.split(';').entries()) {
        circuitJSONResult[j] = {};
        circuitJSONResult[j].value = value;
        circuitJSONResult[j].row = '0';
        circuitJSONResult[j].col = j.toString();
        circuitJSONResult[j].state = j;
      }
      this.margin = {top: 30, right: 30, bottom: 30, left: 30};
      this.width = 450 - this.margin.left - this.margin.right;
      this.height = 150 - this.margin.top - this.margin.bottom;
      this.drawHeatMap(circuitJSONResult, stepResult.step, stepResult.function, type, stepResult.quditIndex);
    }
  }

  calcAngleDegrees(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
  }

  drawHeatMap(circuitJSONResult, stepNumber, stepFunction, type, quditIndex?) {
    const resultsTableDiv = d3.select('#resultsTable')
      .append('div')
        .attr('class', 'stepResult');

    resultsTableDiv.append('h1')
        .text(() => {
          if (type === 'Amps' || type === 'Density') {
            return 'Step ' + stepNumber + ': ' + stepFunction;
          } else if (type === 'Chance') {
            return 'Step ' + stepNumber + ': ' + stepFunction + 's for qudit ' + quditIndex;
          }
        });

    this.svg = resultsTableDiv
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');

    let cols, rows;
    if (type === 'Amps' || type === 'Density') {
      cols = new Array(Math.sqrt(this.stepLength));
      rows = new Array(Math.sqrt(this.stepLength));
    } else if (type === 'Chance') {
      cols = new Array(this.stepLength);
      rows = ['0'];
    }

    if (type === 'Amps' || type === 'Density') {
      for (let i = 0; i < Math.sqrt(this.stepLength); i++) {
        cols[i] = i.toString();
        rows[i] = (Math.sqrt(this.stepLength) - i - 1).toString();
      }
    } else if (type === 'Chance') {
      for (let i = 0; i < this.stepLength; i++) {
        cols[i] = i.toString();
      }
    }

    const x = d3Scale.scaleBand()
      .range([ 0, this.width ])
      .domain(cols)
      .padding(0.01);

    const y = d3Scale.scaleBand()
      .range([ this.height, 0 ])
      .domain(rows)
      .padding(0.01);

    const myColor = d3Scale.scaleLinear()
      .range(['white', '#69b3a2'])
      .domain([0, 1]);

    let tip;
    if (type === 'Amps') {
      tip = d3Tip()
          .attr('class', 'd3-tip')
          .style('visibility', 'visible')
          .offset([-20, 0])
          .html((d) => {
            return '<span class="tip-label">Amplitude of </span>' + '|' + d.state + '<i class="material-icons right-ket">⟩</i>' +
                ' (decimal ' + d.decimalState + ')<br>' +
                '<span class="tip-label">val</span>: ' + '<span style="color:green">' + d.realValue + '</span>' + ' + ' +
                '<span style="color:green">' + d.imagValue + '</span> i<br>' +
                '<span class="tip-label">mag<sup>2</sup></span>:  <span style="color:green">' + d.amp + '</span><br>' +
                '<span class="tip-label">phase</span>:  <span style="color:green">' + d.phase + '<sup>&deg;</sup></span>';
          });
    } else if (type === 'Density') {
      tip = d3Tip()
          .attr('class', 'd3-tip')
          .style('visibility', 'visible')
          .offset([-20, 0])
          .html((d) => {
            return '<span class="tip-label">val</span>: ' + '<span style="color:green">' + d.realValue + '</span>' + ' + ' +
                '<span style="color:green">' + d.imagValue + '</span> i<br>';
          });
    } else if (type === 'Chance') {
      tip = d3Tip()
          .attr('class', 'd3-tip')
          .style('visibility', 'visible')
          .offset([-20, 0])
          .html((d) => {
            return '|' + d.state + '<i class="material-icons right-ket">⟩</i><br>' +
                '<span class="tip-label">probability</span>:  <span style="color:green">' + d.value + '</span>';
          });
    }


    tip(this.svg.append('g'));

    this.svg.selectAll()
      .data(circuitJSONResult, (d) => d.col + ':' + d.row)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-rect')
      .attr('x', (d) => x(d.col))
      .attr('y', (d) => y(d.row))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => {
        if (type === 'Amps' || type === 'Density') {
          return myColor(d.amp);
        } else if (type === 'Chance') {
          return myColor(d.value);
        }
      })
      .style('stroke-width', (d) => {
        if (type === 'Amps' || type === 'Density') {
          if (d.amp > 0) {
            return 4;
          } else {
            return 0.5;
          }
        } else if (type === 'Chance') {
          if (d.value > 0) {
            return 4;
          } else {
            return 0.5;
          }
        }
      })
      .style('stroke', '#80808036')
      .style('opacity', 0.8)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  }

  newSimulation() {
    this.router.navigate(['/simulate']);
  }

}
