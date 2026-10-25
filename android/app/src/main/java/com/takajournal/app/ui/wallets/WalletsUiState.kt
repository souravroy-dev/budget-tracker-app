package com.takajournal.app.ui.wallets

import com.takajournal.app.domain.model.Wallet

data class WalletsUiState(
    val wallets: List<Wallet> = emptyList(),
    val totalBalance: Double = 0.0,
    val isLoading: Boolean = false,
    val showAddWalletDialog: Boolean = false,
    val showTransferDialog: Boolean = false
)
