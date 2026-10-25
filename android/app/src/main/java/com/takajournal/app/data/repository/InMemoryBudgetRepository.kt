package com.takajournal.app.data.repository

import com.takajournal.app.domain.model.Budget
import com.takajournal.app.domain.repository.BudgetRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import java.util.Calendar

/**
 * In-memory budget repository for Milestone 1.
 */
class InMemoryBudgetRepository : BudgetRepository {

    private val _budgets = MutableStateFlow<List<Budget>>(emptyList())
    val budgets = _budgets.asStateFlow()

    override fun getCurrentMonthBudget(): Flow<Budget?> = _budgets.map { list ->
        val cal = Calendar.getInstance()
        val currentMonth = cal.get(Calendar.MONTH)
        val currentYear = cal.get(Calendar.YEAR)
        list.find { it.categoryId == null && it.month == currentMonth && it.year == currentYear }
    }

    override fun getCategoryBudgets(): Flow<List<Budget>> = _budgets.map { list ->
        val cal = Calendar.getInstance()
        val currentMonth = cal.get(Calendar.MONTH)
        val currentYear = cal.get(Calendar.YEAR)
        list.filter { it.categoryId != null && it.month == currentMonth && it.year == currentYear }
    }

    override suspend fun setMonthlyBudget(amount: Double, month: Int, year: Int) {
        val existing = _budgets.value.filterNot { it.categoryId == null && it.month == month && it.year == year }
        val newBudget = Budget(
            id = "budget_${month}_${year}",
            categoryId = null,
            amountLimit = amount,
            month = month,
            year = year
        )
        _budgets.value = existing + newBudget
    }
}
