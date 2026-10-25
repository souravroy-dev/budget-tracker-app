package com.takajournal.app.domain.repository

import com.takajournal.app.domain.model.Wallet
import kotlinx.coroutines.flow.Flow

interface WalletRepository {
    fun getAllWallets(): Flow<List<Wallet>>
    fun getWalletById(id: String): Flow<Wallet?>
    suspend fun insertWallet(wallet: Wallet)
    suspend fun updateWallet(wallet: Wallet)
    suspend fun deleteWallet(id: String)
    suspend fun transferBetweenWallets(sourceWalletId: String, targetWalletId: String, amount: Double)
}
