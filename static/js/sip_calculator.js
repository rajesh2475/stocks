function calculateInvestment() {
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value);
    const investmentYears = parseInt(document.getElementById("investmentYears").value);
    const expectedReturn = parseFloat(document.getElementById("expectedReturn").value) / 100;
    const incrementRate = parseFloat(document.getElementById("incrementRate").value);
    const incrementType = document.getElementById("incrementType").value;
    const holdingPeriod = parseInt(document.getElementById("holdingPeriod").value);

    let resultTableBody = document.getElementById("resultTableBody");
    resultTableBody.innerHTML = ""; // Clear previous results

    let beginningValue = 0;
    let annualInvestment = monthlyInvestment * 12;
    let totalInvestment = 0;
    let totalInvestmentPlusReturn = 0;

    // Data for the graph
    const years = [];
    const actualInvestments = [];
    const investmentWithReturns = [];

    for (let year = 1; year <= holdingPeriod; year++) {
        let endValue = beginningValue + (annualInvestment > 0 ? annualInvestment : 0) + (beginningValue + (annualInvestment > 0 ? annualInvestment : 0)) * expectedReturn;

        let row = `<tr>
                    <td>${year}</td>
                    <td>${beginningValue.toFixed(2)}</td>
                    <td>${annualInvestment > 0 ? annualInvestment.toFixed(2) : "0.00"}</td>
                    <td>${endValue.toFixed(2)}</td>
                </tr>`;
        resultTableBody.innerHTML += row;

        // Add data to the graph arrays
        years.push(year);
        actualInvestments.push((annualInvestment > 0 ? annualInvestment : 0) * year); // Accumulated investment
        investmentWithReturns.push(endValue); // Total with returns

        beginningValue = endValue;
        totalInvestment += annualInvestment;
        totalInvestmentPlusReturn = endValue;

        if (year < investmentYears) {
            if (incrementType === "percentage") {
                annualInvestment *= (1 + incrementRate / 100); // Percentage increase
            } else {
                annualInvestment += incrementRate * 12; // Fixed amount added annually
            }
        } else if (year === investmentYears) {
            annualInvestment = 0;
        }
    }

    // Display the chart with updated data
    displayChart(years, actualInvestments, investmentWithReturns);
}

function displayChart(years, actualInvestments, investmentWithReturns) {
    const ctx = document.getElementById('investmentChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy(); // Destroy existing chart instance to avoid overlap
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Actual Investment',
                    data: actualInvestments,
                    borderColor: '#007BFF',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true
                },
                {
                    label: 'Investment + Returns',
                    data: investmentWithReturns,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: Rs ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Investment Value (Rs)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
