package com.takajournal.app.ui.history

import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.model.TransactionType

data class DayGroupedTransactions(
    val dateLabel: String,
    val dayTotalExpense: Double,
    val dayTotalIncome: Double,
    val transactions: List<Transaction>
)

data class HistoryUiState(
    val searchQuery: String = "",
    val selectedTypeFilter: TransactionType? = null,
    val selectedDateFilter: String = "ALL", // "ALL", "TODAY", "WEEK", "MONTH"
    val groupedTransactions: List<DayGroupedTransactions> = emptyList(),
    val totalCount: Int = 0,
    val isLoading: Boolean = false
)
