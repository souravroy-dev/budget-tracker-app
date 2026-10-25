package com.takajournal.app.ui.quickadd

import com.takajournal.app.domain.model.Category
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.domain.model.Wallet

data class QuickAddUiState(
    val type: TransactionType = TransactionType.EXPENSE,
    val naturalInput: String = "",
    val detectedAmount: Double? = null,
    val amountInput: String = "",
    val description: String = "",
    val selectedWalletId: String = "",
    val targetWalletId: String = "",
    val selectedCategoryId: String = "cat_food",
    val timestamp: Long = System.currentTimeMillis(),
    val notes: String = "",
    val tags: List<String> = emptyList(),
    val isAdvancedExpanded: Boolean = false,
    val wallets: List<Wallet> = emptyList(),
    val categories: List<Category> = emptyList(),
    val isDirty: Boolean = false,
    val showDiscardDialog: Boolean = false,
    val showPersistenceNotice: Boolean = false
)
