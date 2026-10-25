package com.takajournal.app

import android.app.Application
import com.takajournal.app.data.repository.InMemoryBudgetRepository
import com.takajournal.app.data.repository.InMemoryTransactionRepository
import com.takajournal.app.data.repository.InMemoryWalletRepository
import com.takajournal.app.domain.repository.BudgetRepository
import com.takajournal.app.domain.repository.TransactionRepository
import com.takajournal.app.domain.repository.WalletRepository

/**
 * Main Application container providing service locator dependencies for Milestone 1.
 * Ready to be swapped with Hilt / Room Database in Milestone 2.
 */
class TakaApplication : Application() {

    lateinit var transactionRepository: TransactionRepository
        private set

    lateinit var walletRepository: WalletRepository
        private set

    lateinit var budgetRepository: BudgetRepository
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Offline-first repository implementations
        walletRepository = InMemoryWalletRepository()
        transactionRepository = InMemoryTransactionRepository()
        budgetRepository = InMemoryBudgetRepository()
    }

    companion object {
        lateinit var instance: TakaApplication
            private set
    }
}
