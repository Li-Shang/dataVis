/**
 * Created by Administrator on 2017/5/7.
 */
echarts = require('echarts');
require('echarts-wordcloud');

// do not change the function name

exports.draw_age_chart = function(data) {
    let range;
    let age_chart = echarts.init(document.getElementById('age-chart'));
    age_chart.setOption({
        title: {
            text: 'age'
        },
        toolbox: {
            show: true,
            right: 25,
            feature: {
                //自定义组件只能以 my 开头, WTF
                'myTool': {
                    show: true,
                    title: 'Select',
                    icon: 'image://../img/select.png',
                    onclick: function() {
                        //console.log(range);
                        //reload_all_charts('age', [range[0] + 18, range[1] + 18]);
                    }
                },
                'magicType': {
                    show: true,
                    type: ['line', 'bar']
                }
            }
        },
        tooltip: {},
        brush: {
            toolbox: ['lineX', 'clear'],
            xAxisIndex: 'all',
            outOfBrush: {
                colorAlpha: 0.3
            }
        },
        xAxis: {
            data: data.map(d => d.name)
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'line',
            data: data
        }]
    });

    age_chart.on('brushselected', function(params) {
        try {
            //console.log(params.batch[0]);
            range = params.batch[0].areas[0].coordRange;
        } catch (err) {

        }
    });
    // age_chart.dispatchAction({
    //     type: 'brush',
    //     areas: [{
    //         brushType: 'lineX',
    //         coordRange: [10, 30],
    //         xAxisIndex: 0
    //     }]
    // });
    // age_chart.dispatchAction({
    //     type: 'brushselected',
    //     areas: [{
    //         brushType: 'lineX',
    //         coordRange: [10, 30],
    //         xAxisIndex: 0
    //     }]
    // });
};

exports.draw_job_chart = function(data) {
    //console.log(data);
    let job_chart = echarts.init(document.getElementById('job-chart'));
    job_chart.setOption({
        title: {
            text: 'type of job'
        },
        tooltip: {},
        series: [{
            type: 'wordCloud',
            gridSize: 10,
            sizeRange: [15, 45],
            rotationRange: [-30, 30],
            shape: 'circle',
            textStyle: {
                normal: {
                    color: function() {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: data
        }]
    });
    // job_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['job'], [params.data.name]);
    // });
}

exports.draw_marital_chart = function(data) {
    let marital_chart = echarts.init(document.getElementById('marital-chart'));
    marital_chart.setOption({
        title: {
            text: 'marital status'
        },
        tooltip: {},
        legend: {
            orient: 'vertical',
            x: 'right',
            data: (data.map(d => d.name))
        },
        series: [{
            name: '婚姻',
            type: 'pie',
            radius: ['40%', '60%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            data: data
        }]
    });
    // marital_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['marital'], [params.data.name]);
    // });
}

exports.draw_education_chart = function(data) {
    let education_chart = echarts.init(document.getElementById('education-chart'));
    education_chart.setOption({
        title: {
            text: 'education'
        },
        tooltip: {},
        series: [{
            name: '教育',
            type: 'pie',
            roseType: 'angle',
            radius: '50%',
            data: data
        }]
    });
    // education_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['education'], [params.data.name]);
    // });
}

exports.draw_default_chart = function(data) {
    let default_chart = echarts.init(document.getElementById('default-chart'));
    default_chart.setOption({
        title: {
            text: 'has credit in default?'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data: data.map(d => d.name)
        },
        tooltip: {},
        xAxis: {
            data: [],
            type: 'value',
            show: false,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            show: false,
            axisTick: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            name: data[0].name,
            data: [data[0]],
            stack: 'credit',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            }
        }, {
            type: 'bar',
            name: data[1].name,
            data: [data[1]],
            stack: 'credit',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            }
        }]
    });
    // default_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['default'], [params.data.name]);
    // });
}

exports.draw_balance_chart = function(data) {
    let balance_chart = echarts.init(document.getElementById('balance-chart'));
    let rollup = function() {
        let raw_data = data;
        let p_data = [0, 0, 0, 0, 0, 0, 0, 0];
        raw_data.forEach(function(v) {
            if (v.name < 0) {
                p_data[0] += v.value;
            } else if (v.name > 30000) {
                p_data[7] += v.value;
            } else {
                p_data[Math.floor(v.name / 5000) + 1] += v.value;
            }
        });
        option = {
            title: {
                text: 'balance roll up'
            },
            grid: {
                left: '15%'
            },
            xAxis: {
                type: 'category',
                data: ['<0', '0', '5000', '10000', '15000', '20000', '25000',
                    '>30000'
                ]
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '人数',
                type: 'bar',
                data: p_data
            }],
            toolbox: {
                show: true,
                right: 25,
                feature: {
                    //自定义组件只能以 my 开头, WTF
                    'myTool': {
                        show: true,
                        title: 'go back',
                        icon: 'image://../img/select.png',
                        onclick: function() {
                            balance_chart.dispose();
                            draw.draw_balance_chart(raw_data);
                        }
                    }
                }
            }
        };
        balance_chart.dispose();
        balance_chart = echarts.init(document.getElementById('balance-chart'));
        balance_chart.setOption(option);
        balance_chart.on('dblclick', function(params) {
            let index = params.dataIndex;
            let value;
            if (index == 0) {
                value = [-10000, 0];
            } else if (index == 7) {
                value == [30000, 100000];
            } else {
                value = [index * 5000 - 5000, index * 5000];
            }
            balance_chart.dispose();
            query_and_draw(['balance'], ['balance'], [value]);
        });
    }

    balance_chart.setOption({
        title: {
            text: 'average yearly balance'
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(d => d.name)
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
        }, {
            start: 0,
            end: 10,
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [{
            name: '人数',
            type: 'line',
            data: data
        }],
        toolbox: {
            show: true,
            right: 25,
            feature: {
                //自定义组件只能以 my 开头, WTF
                'myTool': {
                    show: true,
                    title: 'Roll up',
                    icon: 'image://../img/select.png',
                    onclick: function() {
                        rollup();
                    }
                }
            }
        }
    });


}

exports.draw_housing_chart = function(data) {
    let housing_chart = echarts.init(document.getElementById('housing-chart'));
    housing_chart.setOption({
        title: {
            text: 'Housing'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data: data.map(d => d.name)
        },
        tooltip: {},
        xAxis: {
            data: [],
            type: 'value',
            show: false,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            show: false,
            axisTick: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            name: data[0].name,
            data: [data[0]],
            stack: 'housing',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            }
        }, {
            type: 'bar',
            name: data[1].name,
            data: [data[1]],
            stack: 'housing',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            }
        }]
    });
    // housing_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['housing'], [params.data.name]);
    // });
}

exports.draw_loan_chart = function(data) {
    let loan_chart = echarts.init(document.getElementById('loan-chart'));
    loan_chart.setOption({
        title: {
            text: 'Loan'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data: data.map(d => d.name)
        },
        tooltip: {},
        xAxis: {
            data: [],
            type: 'value',
            show: false,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            show: false,
            axisTick: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            name: data[0].name,
            data: [data[0]],
            stack: 'loan',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            }
        }, {
            type: 'bar',
            name: data[1].name,
            data: [data[1]],
            stack: 'loan',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            }
        }]
    });
    // loan_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['loan'], [params.data.name]);
    // });
}

exports.draw_contact_chart = function(data) {
    let contact_chart = echarts.init(document.getElementById('contact-chart'));
    contact_chart.setOption({
        title: {
            text: 'Contact'
        },
        tooltip: {},
        series: [{
            name: '联系方式',
            type: 'pie',
            roseType: 'angle',
            radius: '50%',
            data: data
        }]
    });
    // contact_chart.on('dblclick', function(params) {
    //     //console.log(params.data);
    //     reload_all_charts(['contact'], [params.data.name]);
    // });
}

exports.draw_duration_chart = function(data) {
    let duration_chart = echarts.init(document.getElementById('duration-chart'));
    duration_chart.setOption({
        title: {
            text: 'last contact duration'
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(d => d.name)
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
        }, {
            start: 0,
            end: 10,
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        toolbox: {
            show: true,
            right: 25,
            feature: {
                //自定义组件只能以 my 开头, WTF
                'myTool': {
                    show: true,
                    title: 'Select',
                    icon: 'image://../img/select.png',
                    onclick: function() {
                        //reload_all_charts('age', [range[0] + 18, range[1] + 18]);
                    }
                }
            }
        },
        brush: {
            toolbox: ['lineX', 'clear'],
            xAxisIndex: 'all',
            outOfBrush: {
                colorAlpha: 0.3
            }
        },
        series: [{
            name: '人数',
            type: 'line',
            data: data
        }]
    });
}

exports.draw_campaign_chart = function(data) {
    let campaign_chart = echarts.init(document.getElementById('campaign-chart'));
    campaign_chart.setOption({
        title: {
            text: 'number of contacts performed'
        },
        tooltip: {},
        grid: {
            left: 50
        },
        xAxis: {
            type: 'category',
            data: data.map(d => d.name)
        },
        yAxis: {},
        series: [{
            name: '次数',
            type: 'line',
            data: data
        }]
    });
}

exports.draw_pdays_chart = function(data) {
    let pdays_chart = echarts.init(document.getElementById('pdays-chart'));
    pdays_chart.setOption({
        title: {
            text: 'number of days passed since last contact'
        },
        tooltip: {},
        grid: {
            left: 50
        },
        xAxis: {
            type: 'category',
            data: data.map(d => d.name)
        },
        yAxis: {
            type: 'log'
        },
        visualMap: {
            top: 25,
            right: 5,
            pieces: [{
                gt: 1,
                lte: 2,
                color: '#ffde33'
            }, {
                gt: 2,
                lte: 10,
                color: '#ff9933'
            }, {
                gt: 10,
                lte: 100,
                color: '#cc0033'
            }, {
                gt: 100,
                color: '#7e0023'
            }],
            outOfRange: {
                color: '#999'
            }
        },
        series: [{
            name: '次数',
            type: 'line',
            data: data
        }]
    });
}

exports.draw_previous_chart = function(data) {
    let previous_chart = echarts.init(document.getElementById('previous-chart'));
    previous_chart.setOption({
        title: {
            text: 'number of contacts performed before'
        },
        tooltip: {},
        grid: {
            left: 50
        },
        xAxis: {
            type: 'category',
            data: data.map(d => d.name)
        },
        yAxis: {
            type: 'log'
        },
        series: [{
            name: '次数',
            type: 'line',
            data: data
        }]
    });
}

exports.draw_poutcome_chart = function(data) {
    let poutcome_chart = echarts.init(document.getElementById('poutcome-chart'));
    poutcome_chart.setOption({
        title: {
            text: 'outcome of previous campaign'
        },
        tooltip: {},
        series: [{
            name: 'poutcome',
            type: 'pie',
            radius: '50%',
            data: data
        }]
    });
}

exports.draw_y_chart = function(data) {
    let y_chart = echarts.init(document.getElementById('y-chart'));
    y_chart.setOption({
        title: {
            text: 'subscribed the term deposit?'
        },
        tooltip: {},
        series: [{
            name: 'sub',
            type: 'pie',
            radius: '50%',
            data: data
        }]
    });
}

exports.draw_time_chart = function(data) {
    let time_chart = echarts.init(document.getElementById('time-chart'));
    let days = new Array(31);
    for (let i = 0; i < 31; i++) {
        days[i] = i + 1;
    }

    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    time_chart.setOption({
        title: {
            text: 'day and month'
        },
        tooltip: {},
        animation: false,
        grid: {
            right: '15%'
        },
        xAxis: {
            type: 'category',
            data: days,
        },
        yAxis: {
            type: 'category',
            data: months,
        },
        visualMap: {
            min: 0,
            max: 500,
            calculable: true,
            orient: 'vertical',
            right: '2%',
            top: 'middle'
        },
        series: [{
            name: 'Time',
            type: 'heatmap',
            data: data,
            label: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    });
}
