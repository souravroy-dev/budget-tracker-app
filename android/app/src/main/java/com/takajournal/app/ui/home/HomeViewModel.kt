package com.takajournal.app.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.takajournal.app.TakaApplication
import com.takajournal.app.domain.repository.BudgetRepository
import com.takajournal.app.domain.repository.TransactionRepository
import com.takajournal.app.domain.repository.WalletRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

class HomeViewModel(
    private val transactionRepository: TransactionRepository = TakaApplication.instance.transactionRepository,
    private val walletRepository: WalletRepository = TakaApplication.instance.walletRepository,
    private val budgetRepository: BudgetRepository = TakaApplication.instance.budgetRepository
) : ViewModel() {

    val uiState: StateFlow<HomeUiState> = combine(
        transactionRepository.getSummary(),
        transactionRepository.getRecentTransactions(limit = 5),
        budgetRepository.getCurrentMonthBudget(),
        walletRepository.getAllWallets()
    ) { summary, recentTx, budget, wallets ->
        HomeUiState.Success(
            summary = summary,
            recentTransactions = recentTx,
            currentBudget = budget,
            hasWallets = wallets.isNotEmpty()
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HomeUiState.Loading
    )
}
