const pro=document.getElementById("pro");//Input processes value
const error=document.getElementById("error");//Error class
const reset=document.getElementById("reset");//Reset Button
const set=document.getElementById("set");//Add Processes Button
const table = document.getElementById("tab");//selects the whole table
const lab = document.getElementById("lab");//Input field border
const con = document.getElementById("con");//Input field label
let row, process=[], bt=[],wt=[], ct=[], at=[], tat=[], pri=[]; //Declare arrays and Row variable

/**
 * Checks the input processes value and displays error if value is less than 1 or greater than 10
 * O(1)
 */
$("#pro").on("input", function () {
    if(pro.value === "") {
        set.disabled = true;
        set.classList.remove("btn--stripe");
        set.classList.add("disabled");
    } else if (pro.value > 10 || pro.value < 1 && pro.value !== "") {
        error.style.visibility = "visible";
        lab.style.setProperty('--bcol', "#ff3333");
        con.style.setProperty('--bcol', "#ff3333");
        pro.style.color = "#ff3333";
        document.getElementById("err").classList.add("input--error");
        set.disabled = true;
        set.classList.remove("btn--stripe");
        set.classList.add("disabled");
    }else {
        removeerr();
    }
});

/**
 * Executes when 'Add Processes' button is clicked
 * O(N)
 */

function addProcesses() {
    removeerr();
    pro.readOnly = true;
    con.style.visibility="hidden";
    document.getElementById("data").style.visibility = "visible";//Displays the table content
    //Creates the first row
    table.insertRow(0);
    row = table.rows[0];
    row.id = "trid";
    $('#trid').append("<th>Process No.</th><th>Arrival Time</th><th>Burst Time</th><th>Priority</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th>");
    //For creating rows based on processes value
    for (let i=0; i<pro.value; i++) {
        table.insertRow(i+1);
        row = table.rows[i+1];
        row.insertCell(0);
        row.insertCell(1);
        row.insertCell(2);
        row.insertCell(3);
        row.insertCell(4);
        row.insertCell(5);
        row.insertCell(6);
        row.cells[4].style.textAlign="center";
        row.cells[5].style.textAlign="center";
        row.cells[6].style.textAlign="center";
        row.cells[0].innerHTML="P<sub>" + i + "</sub>";
        row.cells[0].style.textAlign="center";
        row.cells[1].innerHTML="<div class=\"col\"><label><input class=\"eff\" type=\"text\" placeholder=\"Enter Arrival Time\"></label><span class=\"focus-bg\"></div>";
        row.cells[2].innerHTML="<div class=\"col\"><label><input class=\"eff\" type=\"text\" placeholder=\"Enter Burst Time\"></label><span class=\"focus-bg\"></div>";
        row.cells[3].innerHTML="<div class=\"col\"><label><input class=\"eff\" type=\"text\" placeholder=\"Enter Priority\"></label><span class=\"focus-bg\"></div>";
    }
    reset.classList.remove("disabled");
    set.classList.add("disabled");
    set.classList.remove("btn--stripe");
    set.disabled=true;
    reset.classList.add("btn--stripe");
    document.getElementById("datab").innerHTML += "<button id='cal' class=\"btn disabled\"  style=\"margin: 2% 1%\" onclick=\"calculate()\">Calculate</button>";
}

/**
 * Validates and assigns AT and BT values
 * Removes gantt chart if it exists
 * O(N^2)
 */
$("#tab").on("input", function () {
    var y;
    let cal=document.getElementById("cal");
    for (let i = 0; i < pro.value ; i++) {
        y = table.rows[i+1].cells;
        for (let j = 0; j < 1; j++) {
            process[i]= i;
            pri[i]=parseInt(y[3].getElementsByTagName('input')[0].value);
            bt[i]=parseInt(y[2].getElementsByTagName('input')[0].value);
            at[i]=parseInt(y[1].getElementsByTagName('input')[0].value);
        }
        if (at[i] < 0 || bt[i] < 1 || isNaN(at[i]) || isNaN(bt[i]) || at[i] === "" || bt[i] === "" ){
            cal.disabled=true;
            cal.classList.add("disabled");
            cal.classList.remove("btn--stripe");
            break;
        } else {
            cal.disabled=false;
            cal.classList.add("btn--stripe");
            cal.classList.remove("disabled");
        }
    }
    $("#label").empty();
    $("#chart").empty();
})

/**
 * Calculate timings
 * O(N)
 */
function calculate() {

    let chart = $("#chart"), label = $("#label"),pos, temp, st=[],ft=[];

    for (let i = 0; i < pro.value; i++) {
        for (let j = 0; j < pro.value; j++) {
            if (pri[i] < pri[j]) {
                temp=process[i];
                process[i]=process[j];
                process[j]=temp;

                temp=bt[i];
                bt[i]=bt[j];
                bt[j]=temp;

                temp=at[i];
                at[i]=at[j];
                at[j]=temp;

                temp=pri[i];
                pri[i]=pri[j];
                pri[j]=temp;
            }
        }
    }

    let burst=0;
    for (let j = 0; j < pro.value; j++) {
        burst = burst + bt[j];
        let k=1, min = bt[k];
        for (let i = k; i < pro.value; i++) /*main logic*/ {
            min = pri[k];
            if (burst >= at[i]) {
                if (pri[i] < min) {
                    temp = process[k];
                    process[k] = process[i];
                    process[i] = temp;
                    temp = at[k];
                    at[k] = at[i];
                    at[i] = temp;
                    let temp1 = bt[k];
                    bt[k] = bt[i];
                    bt[i] = temp1;
                    temp = pri[k];
                    pri[k] = pri[i];
                    pri[i] = temp;
                }
            }
        }
        k++;
    }
    wt[0] = 0;
    insertCT(process.indexOf(0),6,wt[0])
    let sum=0, ta=0;
    for (let i = 1; i < pro.value; i++) {
        sum = sum + bt[i - 1];
        wt[i] = sum - at[i];
        insertCT(i,6,wt[i])
    }
    for (let i = 0; i < pro.value; i++) {
        ta = ta + bt[i];
        tat[i] = ta - at[i];
        insertCT(i,5,tat[i])
    }

    //For calculating the values
    //findCompletionTime(pro.value);
    //findTurnaroundTime();
    //findWaitingTime();

    //For the first process
    //Check if the CPU is idle before the first process arrives
    if (at[0] > 0) {
        chart.append("<div>idle</div><div>P<sub>" + process[0] + "</sub></div>");
        label.append("<div>0</div><div>" + at[0] + "</div><div>" + ct[0] + "</div>").css("width",(5*(parseInt(pro.value)+4)) + "%");
    } else {
        chart.append("<div>P<sub>" + process[0] + "</sub></div>");
        label.append("<div>" + at[0] + "</div><div>" + ct[0] + "</div>").css("width",(5*(parseInt(pro.value)+4)) + "%");
    }

    //For the rest
    //Inserts the process names in gantt chart
    for (let i = 1; i < pro.value; i++) {
        //Checks if CPU is idle or not by comparing the value of current process's arrival time to previous process's completion time
        if (at[i] < ct[i-1] || at[i] === ct[i-1]){
            chart.append("<div>P<sub>" + process[i] + "</sub></div>");
            label.append("<div>" + ct[i] + "</div>").css("width", 5 * ($("#chart").find("div").length) + "vw");

        } else {
            chart.append("<div>idle</div><div>P<sub>" + process[i] + "</sub></div>");
            label.append("<div>" + at[i] + "</div><div>" + ct[i] + "</div>").css("width", 5 * ($("#chart").find("div").length) + "vw");
        }
    }
}

/**
 * O(N)
 * @param n - Number of rows
 */

function findCompletionTime(n) {
    //Condition to check if CPU is idle at first
    let j;
    for (let i = 0; i < pro.value; i++) {
        j=process.indexOf(i)
        if (process[j]===0) {
            ct[j] = bt[j];
            insertCT(j,4,ct);
        } else {
            if (at[j] < at[j-1]) {
                ct[j] = parseInt(ct[j-1])+parseInt(bt[j]);
                insertCT(j,4,ct);
            } else {
                var wasted=parseInt(ct[process.indexOf(i-1)])-parseInt(at[j]); // Calculate wasted time if CPU idles
                ct[j] = parseInt(bt[j]) + wasted;
                insertCT(j,4,ct);
            }
        }
    }

}

/**
 * O(N)
 */
function findTurnaroundTime() {
    for (let i = 0; i < pro.value; i++) {
        tat[i] = ct[i] - at[i];
        insertCT(i,5,tat);
    }
}

/**
 * O(N)
 */
function findWaitingTime() {
    for (let i = 0; i < pro.value; i++) {
        wt[i] = tat[i] - bt[i];
        insertCT(i,6,wt);
    }
}

/**
 * Function to reset styling to default
 * O(1)
 */
function removeerr() {
    lab.style.setProperty('--bcol', "#5fa8d3");
    con.style.setProperty('--bcol', "#5fa8d3");
    pro.style.color = "#333";
    document.getElementById("err").classList.remove("input--error");
    error.style.visibility = "hidden";
    set.disabled = false;
    set.classList.remove("disabled");
    set.classList.add("btn--stripe");
}

/**
 * Insert Cells
 * @param i - Row in which data is to be inserted
 * @param j - Cell number in which data is to be inserted
 * @param k - Array variable
 * O(1)
 */
function insertCT(i,j,k) {
    table.rows[i+1].cells[j].innerHTML="<p>" + parseInt(k) + "</p>";
}

/**
 * Remove the table and gantt chart
 * O(1)
 */
function removeProcesses() {
    $("#tab tr").remove();
    $("#data button").remove();
    $("#label").empty();
    $("#chart").empty();
    set.classList.remove("disabled");
    reset.classList.add("disabled");
    reset.classList.remove("btn--stripe");
    set.classList.add("btn--stripe");
    reset.diabled=true;
    set.disabled=false;
    $("#tab").append("<tr></tr>");
    pro.readOnly = false;
    con.style.visibility="visible";
}

