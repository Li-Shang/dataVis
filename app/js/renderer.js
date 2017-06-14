/**
 * Created by Administrator on 2017/5/7.
 */
const mysql = require('mysql');
let draw = require('../js/draw_chart');

console.log('renderer.js started.');
// let properties = ['age', 'balance', 'job', 'marital', 'education', 'default', 'housing', 'loan', 'contact',
//     'day', 'month', 'duration', 'campaign', 'pdays', 'previous', 'poutcome', 'y', 'time'
// ];
let selected_properties = {};
let mysqlpool;
let button = document.querySelector('#submit-btn');

button.addEventListener('click', function() {
    let property = [],
        given_prop = [],
        value = [];

    $('.query').each(function() {
        console.log();
        let $s = $(this).find('select');
        let $t = $(this).find('input:text');
        if ($s.length > 0) {
            if ($s.val() != 'all') {
                given_prop.push($(this).attr('id').slice(0, -1));
                value.push($s.val());
            }
        } else if ($t.length > 0) {
            if ($t.get(0).value != 'all') {
                given_prop.push($(this).attr('id').slice(0, -1));
                value.push([parseInt($t.get(0).value), parseInt($t.get(1).value)]);
            }
        }
    });

    console.log('button clicked.');
    let user = $('#user').val(),
        pwd = $('#password').val();
    mysqlpool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: user,
        password: pwd,
        database: 'bank',
    });

    for (let i in selected_properties) {
        property.push(i);
        // if (selected_properties[i] != 'all') {
        //     given_prop.push(i);
        //     let m = selected_properties[i].indexOf('-');
        //     if (m > 0) {
        //         let a = parseInt(selected_properties[i].slice(0, m));
        //         let b = parseInt(selected_properties[i].slice(m + 1));
        //         value.push([a, b]);
        //     } else {
        //         value.push(selected_properties[i]);
        //     }
        // }
    }
    console.log(property);
    console.log(given_prop);
    console.log(value);
    load_all_charts(property, given_prop, value);
    //eg:
    //query_mysql(['age', 'job'], function() {}, ['housing', 'duration'], ['no', [100, 600]]);
});

let query_mysql = function(property, draw_func, given_prop, value) {
    let sql;
    let sql_1 = 'SELECT ',
        sql_3 = ' ';
    for (let i in property) {
        sql_1 += '??, ';
        if (i > 0)
            sql_3 += ', ';
        sql_3 += '??'
    }
    sql_1 += 'count(*) AS num FROM bank_table';
    sql_3 = ' GROUP BY ' + sql_3 + ' ORDER BY ' + sql_3 + ' ;';
    sql_1 = mysql.format(sql_1, [...property]);
    sql_3 = mysql.format(sql_3, [...property, ...property]);

    sql = sql_1 + sql_3;
    if (given_prop instanceof Array && given_prop.length > 0) {
        let sql_2 = ' WHERE ';
        for (let i in given_prop) {
            if (i > 0)
                sql_2 += ' and ';
            if (value[i] instanceof Array) {
                sql_2 = sql_2 + '?? >= ? and ?? <= ?';
                sql_2 = mysql.format(sql_2, [given_prop[i], value[i][0], given_prop[i], value[i][1]]);
            } else {
                sql_2 = sql_2 + '?? = ?';
                sql_2 = mysql.format(sql_2, [given_prop[i], value[i]]);
            }
        }
        sql = sql_1 + sql_2 + sql_3;
    }

    console.log(sql);
    mysqlpool.query(sql, draw_func);
};

let query_and_draw = function(property, given_prop, value) {
    if (property[0] == 'time') {
        //console.log('query time.');
        query_mysql(['day', 'month'], function(error, results, fields) {
                if (error)
                    throw error;
                let data = results.map(d => ([d.day - 1, d.month, d.num]));
                draw['draw_' + property[0] + '_chart'](data);
            },
            given_prop, value);
    } else {
        query_mysql(property, function(error, results, fields) {
                if (error)
                    throw error;
                let data = results.map(d => ({
                    value: d.num,
                    name: d[property]
                }));
                draw['draw_' + property[0] + '_chart'](data);
            },
            given_prop, value);
    }
};
let load_all_charts = function(property, given_prop, value) {
    let charts = document.querySelector('#charts');
    while (charts.firstChild) {
        charts.removeChild(charts.firstChild);
    }
    for (let i in property) {
        let chart_div = document.createElement('div');
        chart_div.setAttribute('id', property[i] + '-chart');
        charts.appendChild(chart_div);

        query_and_draw([property[i]], given_prop, value);
    }
};
