import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3Global from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import * as d3Dsv from 'd3-dsv';
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
    // this.route.queryParams.subscribe(
    //   () => {
    //     if (this.router.getCurrentNavigation().extras.state) {
    //       this.circuitResult = this.router.getCurrentNavigation().extras.state.response;
    //       console.log('this.circuitResult: ', this.circuitResult);
    //     }
    //   },
    //   () => {
    //     console.log('No results');
    //   }
    // );
    this.circuitResult = {
      // step1: '(0,0);(0,0);(0.57735,0);(0,0);(0,0);(0.57735,0);(0,0);(0,0);(0.57735,0)'
      step1: '(-0.09567,-0);(0.09567,0);(-0.23097,0.35355);(0.23097,0.35355);(-0.23097,0);(0.23097,0);(-0.09567,0);(0.09567,-0);(-0.09567,0);(0.09567,0);(-0.23097,0.35355);(0.23097,0.35355);(-0.23097,0);(0.23097,0);(-0.09567,0);(0.09567,0)'
    };
    this.quditsNumber = 4;
    this.quditDimensions = 2;
  }

  ngOnInit() {
    console.log(this.circuitResult);
    for (const [i, key] of Object.keys(this.circuitResult).entries()) {
      this.circuitJSONResult[key] = [];
      for (const [j, value] of this.circuitResult[key].split(';').entries()) {
        this.stepLength = this.circuitResult[key].split(';').length;
        this.circuitJSONResult[key][j] = {};
        const realValue = parseFloat(value.split(',')[0].replace(/\(/g, ''));
        const imagValue = parseFloat(value.split(',')[1].replace(/\)/g, ''));
        this.circuitJSONResult[key][j].realValue = realValue;
        this.circuitJSONResult[key][j].imagValue = imagValue;
        this.circuitJSONResult[key][j].amp = Math.pow(realValue, 2) + Math.pow(imagValue, 2);
        this.circuitJSONResult[key][j].row = (Math.trunc(j / Math.sqrt(this.stepLength))).toString();
        this.circuitJSONResult[key][j].col = (j % Math.sqrt(this.stepLength)).toString();
        const changedNumber = j.toString(this.quditDimensions);
        this.circuitJSONResult[key][j].state = (changedNumber + '').padStart(this.quditsNumber, '0');
        this.circuitJSONResult[key][j].decimalState = j;
      }
    }
    console.log('this.circuitJSONResult: ', this.circuitJSONResult);
    this.margin = {top: 30, right: 30, bottom: 30, left: 30};
    this.width = 450 - this.margin.left - this.margin.right;
    this.height = 450 - this.margin.top - this.margin.bottom;
    this.drawHeatMap();
  }

  drawHeatMap() {
    this.svg = d3.select('#ampMatrix')
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const cols = new Array(Math.sqrt(this.stepLength));
    const rows = new Array(Math.sqrt(this.stepLength));
    for (let i = 0; i < Math.sqrt(this.stepLength); i++) {
      cols[i] = i.toString();
      rows[i] = (Math.sqrt(this.stepLength) - i - 1).toString();
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

    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .style('visibility', 'visible')
      .offset([-20, 0])
      .html((d) => {
        return '<span class="tip-label">Amplitude of </span>' + '|' + d.state + '<i class="material-icons right-ket">⟩</i>' +
        ' (decimal ' + d.decimalState + ')<br>' +
        '<span class="tip-label">val</span>: ' + '<span style="color:green">' + d.realValue + '</span>' + ' + ' +
        '<span style="color:green">' + d.imagValue + '</span> i<br>' +
        '<span class="tip-label">mag<sup>2</sup></span>:  <span style="color:green">' + d.amp + '</span>';
      });

    tip(this.svg.append('g'));

    this.svg.selectAll()
      .data(this.circuitJSONResult['step1'], (d) => d.col + ':' + d.row)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-rect')
      .attr('x', (d) => x(d.col))
      .attr('y', (d) => y(d.row))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => myColor(d.amp))
      .style('stroke-width', 0.5)
      .style('stroke', '#80808036')
      .style('opacity', 0.8)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  }

}
