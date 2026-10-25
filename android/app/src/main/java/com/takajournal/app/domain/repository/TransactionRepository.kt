package com.takajournal.app.domain.repository

import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.model.TransactionType
import kotlinx.coroutines.flow.Flow

data class FinancialSummary(
    val todaySpending: Double,
    val monthSpending: Double,
    val monthIncome: Double,
    val totalTransactionsCount: Int
)

interface TransactionRepository {
    fun getAllTransactions(): Flow<List<Transaction>>
    fun getRecentTransactions(limit: Int = 10): Flow<List<Transaction>>
    fun getTransactionById(id: String): Flow<Transaction?>
    fun getSummary(): Flow<FinancialSummary>
    fun searchTransactions(query: String, typeFilter: TransactionType? = null): Flow<List<Transaction>>

    suspend fun insertTransaction(transaction: Transaction)
    suspend fun updateTransaction(transaction: Transaction)
    suspend fun deleteTransaction(id: String)
}
