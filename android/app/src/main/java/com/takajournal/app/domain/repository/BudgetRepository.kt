package com.takajournal.app.domain.repository

import com.takajournal.app.domain.model.Budget
import kotlinx.coroutines.flow.Flow

interface BudgetRepository {
    fun getCurrentMonthBudget(): Flow<Budget?>
    fun getCategoryBudgets(): Flow<List<Budget>>
    suspend fun setMonthlyBudget(amount: Double, month: Int, year: Int)
}
