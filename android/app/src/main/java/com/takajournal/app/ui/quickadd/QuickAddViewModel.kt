package com.takajournal.app.ui.quickadd

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.takajournal.app.TakaApplication
import com.takajournal.app.domain.model.Category
import com.takajournal.app.domain.model.Transaction
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.domain.repository.TransactionRepository
import com.takajournal.app.domain.repository.WalletRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID
import java.util.regex.Pattern

class QuickAddViewModel(
    private val transactionRepository: TransactionRepository = TakaApplication.instance.transactionRepository,
    private val walletRepository: WalletRepository = TakaApplication.instance.walletRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        QuickAddUiState(categories = Category.defaultCategories)
    )

    val uiState: StateFlow<QuickAddUiState> = combine(
        _uiState,
        walletRepository.getAllWallets()
    ) { current, wallets ->
        val effectiveWalletId = if (current.selectedWalletId.isBlank() && wallets.isNotEmpty()) {
            wallets.first().id
        } else {
            current.selectedWalletId
        }
        current.copy(
            wallets = wallets,
            selectedWalletId = effectiveWalletId
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = _uiState.value
    )

    fun onTypeSelected(type: TransactionType) {
        _uiState.value = _uiState.value.copy(type = type, isDirty = true)
    }

    fun onNaturalInputChanged(input: String) {
        val detected = detectAmountFromText(input)
        val description = extractDescriptionFromText(input, detected)

        _uiState.value = _uiState.value.copy(
            naturalInput = input,
            detectedAmount = detected,
            amountInput = if (detected != null && _uiState.value.amountInput.isBlank()) detected.toString() else _uiState.value.amountInput,
            description = if (description.isNotBlank() && _uiState.value.description.isBlank()) description else _uiState.value.description,
            isDirty = true
        )
    }

    fun onAmountChanged(amount: String) {
        _uiState.value = _uiState.value.copy(amountInput = amount, isDirty = true)
    }

    fun onDescriptionChanged(desc: String) {
        _uiState.value = _uiState.value.copy(description = desc, isDirty = true)
    }

    fun onWalletSelected(walletId: String) {
        _uiState.value = _uiState.value.copy(selectedWalletId = walletId, isDirty = true)
    }

    fun onTargetWalletSelected(targetWalletId: String) {
        _uiState.value = _uiState.value.copy(targetWalletId = targetWalletId, isDirty = true)
    }

    fun onCategorySelected(categoryId: String) {
        _uiState.value = _uiState.value.copy(selectedCategoryId = categoryId, isDirty = true)
    }

    fun onNotesChanged(notes: String) {
        _uiState.value = _uiState.value.copy(notes = notes, isDirty = true)
    }

    fun toggleAdvanced() {
        _uiState.value = _uiState.value.copy(isAdvancedExpanded = !_uiState.value.isAdvancedExpanded)
    }

    fun onRequestDismiss(onCanDismiss: () -> Unit) {
        if (_uiState.value.isDirty && (_uiState.value.amountInput.isNotBlank() || _uiState.value.description.isNotBlank())) {
            _uiState.value = _uiState.value.copy(showDiscardDialog = true)
        } else {
            resetState()
            onCanDismiss()
        }
    }

    fun onConfirmDiscard(onDismissed: () -> Unit) {
        resetState()
        onDismissed()
    }

    fun onCancelDiscard() {
        _uiState.value = _uiState.value.copy(showDiscardDialog = false)
    }

    fun saveTransaction(onComplete: (successMessage: String) -> Unit) {
        val amount = _uiState.value.amountInput.toDoubleOrNull() ?: 0.0
        if (amount <= 0.0) return

        viewModelScope.launch {
            val tx = Transaction(
                id = UUID.randomUUID().toString(),
                type = _uiState.value.type,
                amount = amount,
                currency = "BDT",
                description = _uiState.value.description.ifBlank { _uiState.value.type.label },
                walletId = _uiState.value.selectedWalletId,
                targetWalletId = if (_uiState.value.type == TransactionType.TRANSFER) _uiState.value.targetWalletId else null,
                categoryId = _uiState.value.selectedCategoryId,
                timestamp = _uiState.value.timestamp,
                notes = _uiState.value.notes
            )

            transactionRepository.insertTransaction(tx)
            resetState()

            // Honest indicator that persistence is simulated in Milestone 1
            onComplete("Milestone 1 Preview: Persistence to Room SQLite is slated for Milestone 2. Entry verified in app state!")
        }
    }

    private fun resetState() {
        _uiState.value = QuickAddUiState(categories = Category.defaultCategories)
    }

    private fun detectAmountFromText(text: String): Double? {
        val pattern = Pattern.compile("(\\b\\d+(?:\\.\\d{1,2})?\\b)")
        val matcher = pattern.matcher(text)
        return if (matcher.find()) {
            matcher.group(1)?.toDoubleOrNull()
        } else null
    }

    private fun extractDescriptionFromText(text: String, detectedAmount: Double?): String {
        var clean = text
        if (detectedAmount != null) {
            clean = clean.replace(detectedAmount.toString(), "")
            clean = clean.replace(detectedAmount.toInt().toString(), "")
        }
        return clean.replace(Regex("(?i)\\b(tk|taka|bdt|৳)\\b"), "").trim()
    }
}
