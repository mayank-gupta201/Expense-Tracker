// import React from 'react'
// import {Chart as ChartJs, 
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
// } from 'chart.js'

// import {Line} from 'react-chartjs-2'
// import styled from 'styled-components'
// import { useGlobalContext } from '../../context/globalContext'
// import { dateFormat } from '../../utils/dateFormat'

// ChartJs.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
// )

// function Chart() {
//     const {incomes, expenses} = useGlobalContext()

//     const data = {
//         labels: incomes.map((inc) =>{
//             const {date} = inc
//             return dateFormat(date)
//         }),
//         datasets: [
//             {
//                 label: 'Income',
//                 data: [
//                     ...incomes.map((income) => {
//                         const {amount} = income
//                         return amount
//                     })
//                 ],
//                 backgroundColor: 'green',
//                 borderColor: 'green',
//                 tension: .2
//             },
//             {
//                 label: 'Expenses',
//                 data: [
//                     ...expenses.map((expense) => {
//                         const {amount} = expense
//                         return amount
//                     })
//                 ],
//                 backgroundColor: 'red',
//                 borderColor: 'red',
//                 tension: .2
//             }
//         ]
//     }


//     return (
//         <ChartStyled >
//             <Line data={data} />
//         </ChartStyled>
//     )
// }

// const ChartStyled = styled.div`
//     background: #FCF6F9;
//     border: 2px solid #FFFFFF;
//     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//     padding: 1rem;
//     border-radius: 20px;
//     height: 100%;
// `;

// export default Chart

import React from 'react'
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

function Chart() {
    const {incomes, expenses} = useGlobalContext()

    // --- YEH HAI FINAL FIX ---
    // Ek helper function jo date ko 'dd/MM/yyyy' format mein hi laayega
    // Aur NULL ya INVALID dates ko filter kar dega
    const formatDate = (dateStr) => {
        if (!dateStr) return null; // Agar date null ya undefined hai
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null; // Agar date invalid hai
        
        return date.toLocaleDateString('en-GB'); // 'en-GB' locale 'dd/MM/yyyy' format deta hai
    }

    // 1. Saare dates nikaalo (par format karke)
    const allDates = [
        ...incomes.map(inc => formatDate(inc.date)),
        ...expenses.map(exp => formatDate(exp.date))
    ].filter(date => date !== null); // <-- YEH IMPORTANT HAI: Saare null/invalid dates hata do

    // 2. Sirf unique dates rakho aur unhe sort karo
    const uniqueLabels = [...new Set(allDates)].sort((a, b) => {
        // Sort_ing ke liye 'dd/MM/yyyy' ko 'yyyy-MM-dd' mein badalna padega
        try {
            const [dayA, monthA, yearA] = a.split('/');
            const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
            
            const [dayB, monthB, yearB] = b.split('/');
            const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
            
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
            
            return dateA - dateB;
        } catch (e) {
            console.error("Date sorting error", e, a, b);
            return 0;
        }
    });

    // 3. Har unique date ke liye, poora income/expense data-point banao
    const incomeData = uniqueLabels.map(label => {
        let dayTotal = 0;
        incomes.forEach(inc => {
            // Yahan bhi naye robust formatDate se check karo
            if (formatDate(inc.date) === label) {
                dayTotal += inc.amount;
            }
        });
        return dayTotal;
    });

    const expenseData = uniqueLabels.map(label => {
        let dayTotal = 0;
        expenses.forEach(exp => {
            // Yahan bhi naye robust formatDate se check karo
            if (formatDate(exp.date) === label) {
                dayTotal += exp.amount;
            }
        });
        return dayTotal;
    });


    const data = {
        labels: uniqueLabels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'green',
                tension: .2,
                fill: true
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'red',
                tension: .2,
                fill: true
            }
        ]
    }


    return (
        <ChartStyled >
            {uniqueLabels.length > 0 ? <Line data={data} /> : <p>No data to display in chart yet.</p>}
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Chart
