package com.takajournal.app.ui.wallets

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.takajournal.app.TakaApplication
import com.takajournal.app.domain.model.Wallet
import com.takajournal.app.domain.model.WalletType
import com.takajournal.app.domain.repository.WalletRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class WalletsViewModel(
    private val walletRepository: WalletRepository = TakaApplication.instance.walletRepository
) : ViewModel() {

    private val _showAddWalletDialog = MutableStateFlow(false)
    private val _showTransferDialog = MutableStateFlow(false)

    val uiState: StateFlow<WalletsUiState> = combine(
        walletRepository.getAllWallets(),
        _showAddWalletDialog,
        _showTransferDialog
    ) { wallets, showAdd, showTransfer ->
        val total = wallets.sumOf { it.currentBalance }
        WalletsUiState(
            wallets = wallets,
            totalBalance = total,
            isLoading = false,
            showAddWalletDialog = showAdd,
            showTransferDialog = showTransfer
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = WalletsUiState(isLoading = true)
    )

    fun onAddWalletClicked() {
        _showAddWalletDialog.value = true
    }

    fun onDismissAddWalletDialog() {
        _showAddWalletDialog.value = false
    }

    fun onTransferClicked() {
        _showTransferDialog.value = true
    }

    fun onDismissTransferDialog() {
        _showTransferDialog.value = false
    }

    fun createWallet(name: String, type: WalletType, initialBalance: Double) {
        viewModelScope.launch {
            val wallet = Wallet(
                id = UUID.randomUUID().toString(),
                name = name,
                type = type,
                initialBalance = initialBalance,
                currentBalance = initialBalance,
                colorHex = when (type) {
                    WalletType.MFS_BKASH -> "#E2136E"
                    WalletType.MFS_NAGAD -> "#F7941D"
                    WalletType.MFS_ROCKET -> "#8C3494"
                    WalletType.BANK -> "#1E88E5"
                    WalletType.CASH -> "#006C4C"
                    WalletType.OTHER -> "#546E7A"
                }
            )
            walletRepository.insertWallet(wallet)
            _showAddWalletDialog.value = false
        }
    }

    fun executeTransfer(sourceWalletId: String, targetWalletId: String, amount: Double) {
        viewModelScope.launch {
            walletRepository.transferBetweenWallets(sourceWalletId, targetWalletId, amount)
            _showTransferDialog.value = false
        }
    }
}
