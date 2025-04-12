const inpAmt = document.getElementById("inpAmount"),
loanAmount = document.querySelector(".loanAmount"),
interest = document.querySelector(".interest"),
timeElem = document.querySelector(".time"),
amtValue = document.querySelector(".loanAmount div p span"),
inpRate = document.getElementById("inpRate"),
rateValue = document.querySelector(".interest div p span"),
inpTime = document.getElementById("inpTime"),
amtTime = document.querySelector(".time div p span"),
btn = document.querySelector("button"),
calculations = document.querySelector(".calculations"),
emiTable = document.querySelector(".emiTable")

let prin, rateofInt, timePeriod



//changing the values of input in accordance with changing values
amtValue.innerText = 0
rateValue.innerText = 5
inpAmt.value = amtValue.innerText
inpRate.value = amtValue.innerText
amtTime.innerText = 0
inpTime.value = amtTime.innerText

inpAmt.addEventListener("change",()=>{
    amtValue.innerText = inpAmt.value
})

inpRate.addEventListener("change",()=>{
    rateValue.innerText = inpRate.value
})

inpTime.addEventListener("change",()=>{
    amtTime.innerText = inpTime.value.split(" ")[0]
})


//functionality on submit

btn.addEventListener("click",(e)=>{
    e.preventDefault()
    prin = inpAmt.value
    rateofInt = inpRate.value
    timePeriod = inpTime.value


    //default condition
    if(prin == 0 || timePeriod == 0){
        loanAmount.classList.add("border-2", "border-red-400", "rounded-lg")

        timeElem.classList.add("border-2", "border-red-400", "rounded-lg")

        return ;
    }

    loanAmount.classList.remove("border-2", "border-red-400", "rounded-lg")

    timeElem.classList.remove("border-2", "border-red-400", "rounded-lg")

    let {emi, totalPayments, totalInterest} = calcEmis(prin,rateofInt, timePeriod)

    showCalculations(emi,totalPayments, totalInterest)

    const detailedReport = []

    showDetailedReport(prin,(rateofInt/100/12), detailedReport, emi)


    //if outstandinb principal is less than zero, then convert it into 0
    detailedReport.forEach((value,index)=>{
        if(value.outBal < 0)
            value.outBal = 0
    })

    showTable(detailedReport)

    customizeBackground()

    showGraph(detailedReport)
})


//function for calculating emi and interest 
function calcEmis(prin, roi, time){
    let rate = roi/100/12
    let power = Math.pow((1+rate),time*12)

    let emi = prin * (rate * power)/ (power-1)
    

    let totalPayments = (emi* (time*12)).toFixed(0)
    let totalInterest = totalPayments - prin

    emi = emi.toFixed(0)
    return {emi,totalPayments, totalInterest}
    
}


//function for showing emi and interest 
function showCalculations(emi, totalPayments, totalInterest){
    calculations.classList.remove("hidden")
    calculations.innerHTML = `
    <!-- heading -->
            <div class="bg-gray-400 text-white text-3xl py-3 text-center">
                <p>Detailed Calculations</p>
            </div>
            <!-- calculated data -->
            <div>
                <div class="text-center py-4 border-b border-b-gray-300">
                    <p class="text-2xl text-blue-400">₹ <span class="font-bold">${emi}</span></p>
                    <p class="text-xl">EMI</p>
                </div>
                <div class="text-center py-4 border-b border-b-gray-300">
                    <p class="text-2xl text-blue-400">₹ <span class="font-bold">${totalInterest}</span></p>
                    <p class="text-xl">Total interest payable over the loan term</p>
                </div>
                <div class="text-center py-4 border-b border-b-gray-300">
                    <p class="text-2xl text-blue-400">₹ <span class="font-bold">${totalPayments}</span></p>
                    <p class="text-xl">Total payments made over the loan term</p>
                </div>
            </div>`
}


//function for calculating data for detailed report
function showDetailedReport(x,y, detailedReport, emi){
    let monInt = Math.floor(x*y)
    let monPrin = emi - monInt
    let outBal = x - monPrin

    detailedReport.push({
        principal : x,
        monInt : monInt,
        monPrin : monPrin,
        outBal : outBal,
        emi: emi
    })

    if(outBal < 0 || outBal == 0)
        return
    else
        showDetailedReport(outBal,y, detailedReport, emi)    
}



//function for showing detailed report
function showTable(report){
    emiTable.innerHTML = `
            <!-- heading -->
            <div class="grid grid-cols-6">
                <h2 class="bg-blue-400 w-full px-4 text-white text-lg font-bold py-3 flex items-center justify-center border border-white">Month</h2>
                <h2 class="bg-blue-400 w-full px-4 text-white text-lg font-bold py-3 flex items-center justify-center border border-white">Begining Loan Balance</h2>
                <h2 class="bg-blue-400 w-full px-4 text-white text-lg font-bold py-3 flex items-center justify-center border border-white">EMI</h2>
                <h2 class="bg-blue-400 w-full px-4 text-white text-lg font-bold py-3 flex items-center justify-center border border-white">Principal</h2>
                <h2 class="bg-blue-400 w-full px-4 text-white text-lg font-bold py-3 flex items-center justify-center border border-white">Monthly Interest</h2>
                <h2 class="bg-blue-400 w-full px-4 text-white text-lg font-bold py-3 flex items-center justify-center border border-white">Outstanding Balance</h2>
            </div>
    `

    report.forEach((value,index)=>{
        emiTable.innerHTML += `
            <!-- details -->
            <div class="grid grid-cols-6">
                <h2 class="bg-gray-200 w-full px-4 text-lg py-3 flex items-center justify-center border border-gray-300">${index+1}</h2>
                <h2 class="bg-gray-200 w-full px-4 text-lg py-3 flex items-center justify-center border border-gray-300">₹ ${value.principal} </h2>
                <h2 class="bg-gray-200 w-full px-4 text-lg py-3 flex items-center justify-center border border-gray-300">₹ ${value.emi}</h2>
                <h2 class="bg-gray-200 w-full px-4 text-lg py-3 flex items-center justify-center border border-gray-300">₹ ${value.monPrin}</h2>
                <h2 class="bg-gray-200 w-full px-4 text-lg py-3 flex items-center justify-center border border-gray-300">₹ ${value.monInt}</h2>
                <h2 class="bg-gray-200 w-full px-4 text-lg py-3 flex items-center justify-center border border-gray-300">₹ ${value.outBal}</h2>
            </div>
        `
    })    
}



//function to customize background of table
function customizeBackground(){

    for(let i=0; i< emiTable.children.length; i++){
        if(i%2 != 0){
            const target = emiTable.children[i]
            for(let j=0; j<target.children.length; j++){
                target.children[j].classList.remove("bg-gray-200")
            }
        }            
    }
}



//function to show graph
function showGraph(data){
    const ctx = document.querySelector("canvas")
    ctx.classList.remove("hidden")

    new Chart(ctx,{
        type: 'line',
        data:  {
            labels: data.map((value,index)=> index+=1),
            datasets: [{
                label: 'Principal',
                data: data.map(row=> row.monPrin),
                borderWidth: 1,
                borderColor: 'red'
        },{
                label: 'Interest',
                data: data.map(row=> row.monInt),
                borderWidth: 1,
                borderColor: 'blue'
        },{
                label: 'EMI',
                data: data.map(row=> row.emi),
                borderWidth: 1,
                borderColor: 'yellow'
        }]
        },
        options: {
            responsive: false,
            AspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    title: {
                        display: true,
                        text: 'Months',
                        font: {
                            size: 24
                        }                        
                    },        
                }
            }
        }
    });
}