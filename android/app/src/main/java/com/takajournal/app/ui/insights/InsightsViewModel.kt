package com.takajournal.app.ui.insights

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.takajournal.app.TakaApplication
import com.takajournal.app.domain.model.Category
import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.domain.repository.TransactionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import java.util.Calendar

class InsightsViewModel(
    private val transactionRepository: TransactionRepository = TakaApplication.instance.transactionRepository
) : ViewModel() {

    private val _selectedPeriod = MutableStateFlow(InsightsPeriod.MONTH)

    val uiState: StateFlow<InsightsUiState> = combine(
        transactionRepository.getAllTransactions(),
        _selectedPeriod
    ) { allTransactions, period ->
        val now = Calendar.getInstance()
        val filtered = allTransactions.filter { tx ->
            val cal = Calendar.getInstance().apply { timeInMillis = tx.timestamp }
            when (period) {
                InsightsPeriod.DAY -> {
                    now.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                            now.get(Calendar.DAY_OF_YEAR) == cal.get(Calendar.DAY_OF_YEAR)
                }
                InsightsPeriod.WEEK -> {
                    now.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                            now.get(Calendar.WEEK_OF_YEAR) == cal.get(Calendar.WEEK_OF_YEAR)
                }
                InsightsPeriod.MONTH -> {
                    now.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                            now.get(Calendar.MONTH) == cal.get(Calendar.MONTH)
                }
                InsightsPeriod.YEAR -> {
                    now.get(Calendar.YEAR) == cal.get(Calendar.YEAR)
                }
            }
        }

        var expenseSum = 0.0
        var incomeSum = 0.0
        val categoryMap = mutableMapOf<String, Double>()

        for (tx in filtered) {
            when (tx.type) {
                TransactionType.EXPENSE -> {
                    expenseSum += tx.amount
                    val catId = tx.categoryId ?: "cat_other_exp"
                    categoryMap[catId] = (categoryMap[catId] ?: 0.0) + tx.amount
                }
                TransactionType.INCOME -> {
                    incomeSum += tx.amount
                }
                TransactionType.TRANSFER -> {}
            }
        }

        val topCategories = categoryMap.entries.map { (catId, amount) ->
            val category = Category.defaultCategories.find { it.id == catId }
            CategorySpending(
                categoryId = catId,
                categoryName = category?.name ?: "Other",
                totalAmount = amount,
                percentage = if (expenseSum > 0) (amount / expenseSum).toFloat() else 0f,
                colorHex = category?.colorHex ?: "#616161"
            )
        }.sortedByDescending { it.totalAmount }

        InsightsUiState(
            selectedPeriod = period,
            totalExpense = expenseSum,
            totalIncome = incomeSum,
            netSavings = incomeSum - expenseSum,
            topCategories = topCategories,
            transactionCount = filtered.size,
            isLoading = false
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = InsightsUiState(isLoading = true)
    )

    fun onPeriodSelected(period: InsightsPeriod) {
        _selectedPeriod.value = period
    }
}
