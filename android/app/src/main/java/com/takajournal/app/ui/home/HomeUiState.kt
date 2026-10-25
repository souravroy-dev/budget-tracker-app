package com.takajournal.app.ui.home

import com.takajournal.app.domain.model.Budget
import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.repository.FinancialSummary

sealed interface HomeUiState {
    object Loading : HomeUiState
    data class Success(
        val summary: FinancialSummary,
        val recentTransactions: List<Transaction>,
        val currentBudget: Budget?,
        val hasWallets: Boolean
    ) : HomeUiState
    data class Error(val message: String) : HomeUiState
}
