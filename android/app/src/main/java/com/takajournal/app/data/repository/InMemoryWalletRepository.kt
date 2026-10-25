package com.takajournal.app.data.repository

import com.takajournal.app.domain.model.Wallet
import com.takajournal.app.domain.repository.WalletRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map

/**
 * In-memory wallet repository for Milestone 1.
 * Starts in an honest zero-state (empty list) as per requirements.
 */
class InMemoryWalletRepository : WalletRepository {

    private val _wallets = MutableStateFlow<List<Wallet>>(emptyList())
    val wallets = _wallets.asStateFlow()

    override fun getAllWallets(): Flow<List<Wallet>> = _wallets.map { list ->
        list.filterNot { it.isArchived }
    }

    override fun getWalletById(id: String): Flow<Wallet?> = _wallets.map { list ->
        list.find { it.id == id }
    }

    override suspend fun insertWallet(wallet: Wallet) {
        _wallets.value = _wallets.value + wallet
    }

    override suspend fun updateWallet(wallet: Wallet) {
        _wallets.value = _wallets.value.map {
            if (it.id == wallet.id) wallet else it
        }
    }

    override suspend fun deleteWallet(id: String) {
        _wallets.value = _wallets.value.filterNot { it.id == id }
    }

    override suspend fun transferBetweenWallets(
        sourceWalletId: String,
        targetWalletId: String,
        amount: Double
    ) {
        _wallets.value = _wallets.value.map { wallet ->
            when (wallet.id) {
                sourceWalletId -> wallet.copy(currentBalance = wallet.currentBalance - amount)
                targetWalletId -> wallet.copy(currentBalance = wallet.currentBalance + amount)
                else -> wallet
            }
        }
    }
}
