package com.takajournal.app.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.takajournal.app.TakaApplication
import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.domain.repository.TransactionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class HistoryViewModel(
    private val transactionRepository: TransactionRepository = TakaApplication.instance.transactionRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    private val _typeFilter = MutableStateFlow<TransactionType?>(null)
    private val _dateFilter = MutableStateFlow("ALL")

    val uiState: StateFlow<HistoryUiState> = combine(
        transactionRepository.getAllTransactions(),
        _searchQuery,
        _typeFilter,
        _dateFilter
    ) { allTransactions, query, type, dateFilter ->
        val filtered = allTransactions.filter { tx ->
            val matchesQuery = query.isBlank() ||
                    tx.description.contains(query, ignoreCase = true) ||
                    tx.notes.contains(query, ignoreCase = true) ||
                    tx.tags.any { it.contains(query, ignoreCase = true) }

            val matchesType = type == null || tx.type == type

            val matchesDate = when (dateFilter) {
                "TODAY" -> isToday(tx.timestamp)
                "WEEK" -> isThisWeek(tx.timestamp)
                "MONTH" -> isThisMonth(tx.timestamp)
                else -> true
            }

            matchesQuery && matchesType && matchesDate
        }

        // Group by day (e.g., "18 October 2026")
        val dayFormatter = SimpleDateFormat("d MMMM yyyy", Locale.US)
        val groupedMap = filtered.groupBy { tx ->
            dayFormatter.format(Date(tx.timestamp))
        }

        val groupedList = groupedMap.map { (dateLabel, txList) ->
            var dayExpense = 0.0
            var dayIncome = 0.0
            for (item in txList) {
                if (item.type == TransactionType.EXPENSE) dayExpense += item.amount
                if (item.type == TransactionType.INCOME) dayIncome += item.amount
            }
            DayGroupedTransactions(
                dateLabel = dateLabel,
                dayTotalExpense = dayExpense,
                dayTotalIncome = dayIncome,
                transactions = txList
            )
        }

        HistoryUiState(
            searchQuery = query,
            selectedTypeFilter = type,
            selectedDateFilter = dateFilter,
            groupedTransactions = groupedList,
            totalCount = filtered.size,
            isLoading = false
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HistoryUiState(isLoading = true)
    )

    fun onSearchQueryChanged(newQuery: String) {
        _searchQuery.value = newQuery
    }

    fun onTypeFilterSelected(type: TransactionType?) {
        _typeFilter.value = type
    }

    fun onDateFilterSelected(filter: String) {
        _dateFilter.value = filter
    }

    private fun isToday(timestamp: Long): Boolean {
        val now = Calendar.getInstance()
        val cal = Calendar.getInstance().apply { timeInMillis = timestamp }
        return now.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                now.get(Calendar.DAY_OF_YEAR) == cal.get(Calendar.DAY_OF_YEAR)
    }

    private fun isThisWeek(timestamp: Long): Boolean {
        val now = Calendar.getInstance()
        val cal = Calendar.getInstance().apply { timeInMillis = timestamp }
        return now.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                now.get(Calendar.WEEK_OF_YEAR) == cal.get(Calendar.WEEK_OF_YEAR)
    }

    private fun isThisMonth(timestamp: Long): Boolean {
        val now = Calendar.getInstance()
        val cal = Calendar.getInstance().apply { timeInMillis = timestamp }
        return now.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                now.get(Calendar.MONTH) == cal.get(Calendar.MONTH)
    }
}
