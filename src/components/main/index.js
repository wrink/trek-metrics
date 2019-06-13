import React from 'react';
import Chart from 'chart.js';

const seriesLabel = 'Number of Seasons'
const seasonLabel = 'Number of Episodes'

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.ctx = React.createRef();

    this.state = {
      chart: null,
      data: null,
      series: null
    }
  }

  async componentDidMount() {
    try {
      const res = await fetch(`http://stapi.co/api/v1/rest/season/search`)
      const { seasons } = await res.json()

      const data = seasons.map((season) => {
        return season.series.title
      }).filter((series, i, array) => {
        return array.indexOf(series) === i
      }).map((title) => {
        return {
          series: title,
          seasons: seasons.filter((season) => season.series.title === title)
        }
      })

      this.setState({ data }, this.buildChart)

    } catch (e) {
      console.error(e)
    }
  }

  getColor(index, length) {
    return `hsl(${index * (360 / length)}, 80%, 60%)`
  }

  getHoverColor(index, length) {
    return `hsl(${index * (360 / length)}, 60%, 80%)`
  }

  buildChart() {
    const { series, data, chart } = this.state
    const source = (series) ? data.find((title) => title.series === series).seasons : data

    if (chart) {
      chart.destroy()
    }

    this.setState({
      chart: new Chart(this.ctx.current, {
        type: 'polarArea',
        data: (series) ? {
          labels: source.map(({ title }) => title),
          datasets: [{
            label: seasonLabel,
            data: source.map(({ numberOfEpisodes }) => numberOfEpisodes),
            backgroundColor: source.map((e, i, arr) => this.getColor(i, arr.length)),
            hoverBackgroundColor: source.map((e, i, arr) => this.getHoverColor(i, arr.length)),
            borderColor: '#ffffff',
          }]
        } : {
          labels: source.map((title) => title.series.replace(/^Star Trek: /i, '')),
          datasets: [{
            label: seriesLabel,
            data: source.map(({ seasons }) => seasons.length),
            backgroundColor: source.map((e, i, arr) => this.getColor(i, arr.length)),
            hoverBackgroundColor: source.map((e, i, arr) => this.getHoverColor(i, arr.length)),
            borderColor: '#ffffff',
          }]
        },
        options: {
          scale: {
            ticks: {
              display: false
            },
            gridLines: {
              color: '#ffffff'
            }
          },
          legend: {
            position: 'top',
            labels: {
              fontColor: '#ffffff'
            }
          },
          onClick: (event, elements) => {
            if (elements.length) {
              const title = data[elements[0]._index].series

              this.setState({ series: (series) ? null : title }, this.buildChart)
            }
          }
        }
      })
    })
  }

  render() {
    const { data, series } = this.state
    const seasons = (series) ? data.find((title) => title.series === series).seasons : []

    return (
      <div class="wrapper">
        <h4>
          { (series) ? `${seasonLabel} (${series})` : seriesLabel }
        </h4>

        <div class="chart">
          <canvas ref={this.ctx} width="1000" height="400"></canvas>
        </div>
      </div>
    )
  }
}
