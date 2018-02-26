
const puppeteer = require('puppeteer');
const axios = require('axios')
const fs=require('fs')
let url='http://www.yaoqimh.net/shaonvmanhua/6415_2.html'
let cnt = 1

async function run(url){
	const browser = await puppeteer.launch({timeout:0});
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(100000000)
    await page.goto(url)

    let imgUrl=await page.evaluate(()=>{
    	return document.querySelector('#imgshow > a > img').src
    })
    let name=await page.evaluate(()=>{
    	return document.querySelector('body > h1').innerText
    })
    if(cnt>10000){
    	browser.close()
    	return
    }
    
    axios.get(imgUrl,{
    	responseType:'stream'
    }).then(res=>{
    	res.data.pipe(fs.createWriteStream(`./download3/${name}.${imgUrl.substr(imgUrl.length-3)}`))
    	cnt++
    })
    let nextPage=await page.evaluate(()=>{
    	return document.querySelector('#p_next').href
    })
    
    setTimeout(function(){

    	run(nextPage)
    },5000)
}

run(url)

