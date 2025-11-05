import React, {useContext, useState } from "react"
import axios from 'axios'
// const BASE_URL = "http://localhost:5000/api/v1/";

const BASE_URL = process.env.REACT_APP_BASE_URL + "/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income)
            getIncomes()
            return true;
        } catch (err) {
            setError(err.response ? err.response.data.message : "Error adding income");
            return false;
        }
    }

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`)
            setIncomes(response.data)
            // console.log(response.data)
        } catch (err) {
            console.error("getIncomes Error:", err.response ? err.response.data.message : err.message)
        }
    }
    
    const deleteIncome = async (id) => {
        try{
            const res = await axios.delete(`${BASE_URL}delete-income/${id}`)
            getIncomes()
        }catch(err) {
            console.error("deleteIncomes Error:", err.response ? err.response.data.message : err.message)
        }
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome = totalIncome + income.amount
        })
        return totalIncome;
    }

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense)
            getExpenses()
            return true;
        } catch (err) {
            setError(err.response ? err.response.data.message : "Error adding expense");
            return false;
        }
    }

    const getExpenses = async () => {
        try{
            const response = await axios.get(`${BASE_URL}get-expenses`)
            setExpenses(response.data)
            //console.log(response.data)
        }catch(err){
            console.error("getExpenses Error:", err.response ? err.response.data.message : err.message)
        }
    }
    
    const deleteExpense = async (id) => {
        try{
            const res = await axios.delete(`${BASE_URL}delete-expense/${id}`)
            getExpenses()
    
        }catch(err){
            console.error("deleteExpense Error:", err.response ? err.response.data.message : err.message)
        }
    }
    const totalExpenses = () => {
        let totalExpense = 0; 
        expenses.forEach((expense) => {
            totalExpense = totalExpense + expense.amount
        })
        return totalExpense; 
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a,b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value ={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}