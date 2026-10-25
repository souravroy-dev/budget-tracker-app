package com.takajournal.app.data.repository

import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.domain.repository.FinancialSummary
import com.takajournal.app.domain.repository.TransactionRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import java.util.Calendar

/**
 * In-memory transaction repository for Milestone 1.
 * Starts in a clean zero-state without fake balances or fictional transactions.
 * Ready for Room SQLite entity mapping in Milestone 2.
 */
class InMemoryTransactionRepository : TransactionRepository {

    private val _transactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions = _transactions.asStateFlow()

    override fun getAllTransactions(): Flow<List<Transaction>> = _transactions.map { list ->
        list.sortedByDescending { it.timestamp }
    }

    override fun getRecentTransactions(limit: Int): Flow<List<Transaction>> = _transactions.map { list ->
        list.sortedByDescending { it.timestamp }.take(limit)
    }

    override fun getTransactionById(id: String): Flow<Transaction?> = _transactions.map { list ->
        list.find { it.id == id }
    }

    override fun getSummary(): Flow<FinancialSummary> = _transactions.map { list ->
        val now = Calendar.getInstance()
        val currentYear = now.get(Calendar.YEAR)
        val currentMonth = now.get(Calendar.MONTH)
        val currentDay = now.get(Calendar.DAY_OF_YEAR)

        var todaySpend = 0.0
        var monthSpend = 0.0
        var monthIncome = 0.0

        for (tx in list) {
            val txCal = Calendar.getInstance().apply { timeInMillis = tx.timestamp }
            val isCurrentYear = txCal.get(Calendar.YEAR) == currentYear
            val isCurrentMonth = isCurrentYear && txCal.get(Calendar.MONTH) == currentMonth
            val isToday = isCurrentYear && txCal.get(Calendar.DAY_OF_YEAR) == currentDay

            when (tx.type) {
                TransactionType.EXPENSE -> {
                    if (isToday) todaySpend += tx.amount
                    if (isCurrentMonth) monthSpend += tx.amount
                }
                TransactionType.INCOME -> {
                    if (isCurrentMonth) monthIncome += tx.amount
                }
                TransactionType.TRANSFER -> {
                    // Internal transfer does not alter net spending/income
                }
            }
        }

        FinancialSummary(
            todaySpending = todaySpend,
            monthSpending = monthSpend,
            monthIncome = monthIncome,
            totalTransactionsCount = list.size
        )
    }

    override fun searchTransactions(query: String, typeFilter: TransactionType?): Flow<List<Transaction>> =
        _transactions.map { list ->
            list.filter { tx ->
                val matchesQuery = query.isBlank() ||
                        tx.description.contains(query, ignoreCase = true) ||
                        tx.notes.contains(query, ignoreCase = true) ||
                        tx.tags.any { it.contains(query, ignoreCase = true) }

                val matchesType = typeFilter == null || tx.type == typeFilter

                matchesQuery && matchesType
            }.sortedByDescending { it.timestamp }
        }

    override suspend fun insertTransaction(transaction: Transaction) {
        _transactions.value = _transactions.value + transaction
    }

    override suspend fun updateTransaction(transaction: Transaction) {
        _transactions.value = _transactions.value.map {
            if (it.id == transaction.id) transaction else it
        }
    }

    override suspend fun deleteTransaction(id: String) {
        _transactions.value = _transactions.value.filterNot { it.id == id }
    }
}
