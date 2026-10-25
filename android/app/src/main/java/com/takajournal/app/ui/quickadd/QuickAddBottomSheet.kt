package com.takajournal.app.ui.quickadd

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.ui.common.DiscardDraftDialog
import com.takajournal.app.ui.theme.ExpenseCrimsonLight
import com.takajournal.app.ui.theme.IncomeMintLight
import com.takajournal.app.ui.theme.TransferIndigoLight
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuickAddBottomSheet(
    onDismissRequest: () -> Unit,
    onSaveSuccess: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: QuickAddViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()
    var isWalletMenuExpanded by remember { mutableStateOf(false) }
    var isCategoryMenuExpanded by remember { mutableStateOf(false) }

    fun closeSheet() {
        scope.launch { sheetState.hide() }.invokeOnCompletion {
            onDismissRequest()
        }
    }

    ModalBottomSheet(
        onDismissRequest = {
            viewModel.onRequestDismiss(onCanDismiss = ::closeSheet)
        },
        sheetState = sheetState,
        shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
        containerColor = MaterialTheme.colorScheme.surface,
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .navigationBarsPadding()
                .imePadding()
                .verticalScroll(rememberScrollState())
        ) {
            // Header Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Quick Record",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                IconButton(onClick = { viewModel.onRequestDismiss(onCanDismiss = ::closeSheet) }) {
                    Icon(Icons.Default.Close, contentDescription = "Close sheet")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 1. Transaction Type Selector (Expense | Income | Transfer)
            SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                TransactionType.values().forEachIndexed { index, txType ->
                    SegmentedButton(
                        selected = state.type == txType,
                        onClick = { viewModel.onTypeSelected(txType) },
                        shape = SegmentedButtonDefaults.itemShape(
                            index = index,
                            count = TransactionType.values().size
                        ),
                        colors = SegmentedButtonDefaults.colors(
                            activeContainerColor = when (txType) {
                                TransactionType.EXPENSE -> ExpenseCrimsonLight.copy(alpha = 0.15f)
                                TransactionType.INCOME -> IncomeMintLight.copy(alpha = 0.15f)
                                TransactionType.TRANSFER -> TransferIndigoLight.copy(alpha = 0.15f)
                            },
                            activeContentColor = when (txType) {
                                TransactionType.EXPENSE -> ExpenseCrimsonLight
                                TransactionType.INCOME -> IncomeMintLight
                                TransactionType.TRANSFER -> TransferIndigoLight
                            }
                        )
                    ) {
                        Text(txType.label, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 2. Natural Free-Text Input
            OutlinedTextField(
                value = state.naturalInput,
                onValueChange = viewModel::onNaturalInputChanged,
                label = { Text("Smart Entry (e.g. Rickshaw 60, Lunch 250 tk)") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            if (state.detectedAmount != null) {
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Detected amount: ৳${String.format("%.2f", state.detectedAmount)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 3. Amount & Description Fields
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = state.amountInput,
                    onValueChange = viewModel::onAmountChanged,
                    label = { Text("Amount (৳)") },
                    prefix = { Text("৳ ", fontWeight = FontWeight.Bold) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = state.description,
                    onValueChange = viewModel::onDescriptionChanged,
                    label = { Text("Description") },
                    singleLine = true,
                    modifier = Modifier.weight(1.3f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 4. Wallet Picker
            if (state.wallets.isNotEmpty()) {
                ExposedDropdownMenuBox(
                    expanded = isWalletMenuExpanded,
                    onExpandedChange = { isWalletMenuExpanded = it }
                ) {
                    val selectedWallet = state.wallets.find { it.id == state.selectedWalletId }
                    OutlinedTextField(
                        value = selectedWallet?.name ?: "Select Wallet",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Paid From / Stored In") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isWalletMenuExpanded) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                    ExposedDropdownMenu(
                        expanded = isWalletMenuExpanded,
                        onDismissRequest = { isWalletMenuExpanded = false }
                    ) {
                        state.wallets.forEach { w ->
                            DropdownMenuItem(
                                text = { Text("${w.name} (${w.type.title})") },
                                onClick = {
                                    viewModel.onWalletSelected(w.id)
                                    isWalletMenuExpanded = false
                                }
                            )
                        }
                    }
                }
            } else {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "No custom wallets added yet. Entry will default to Cash.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 5. Expandable Advanced Details
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { viewModel.toggleAdvanced() }
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Advanced Details (Category, Notes, Date)",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.primary
                )
                Icon(
                    imageVector = if (state.isAdvancedExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            }

            AnimatedVisibility(visible = state.isAdvancedExpanded) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    // Category Picker
                    ExposedDropdownMenuBox(
                        expanded = isCategoryMenuExpanded,
                        onExpandedChange = { isCategoryMenuExpanded = it }
                    ) {
                        val selectedCat = state.categories.find { it.id == state.selectedCategoryId }
                        OutlinedTextField(
                            value = selectedCat?.name ?: "Select Category",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Category") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isCategoryMenuExpanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )
                        ExposedDropdownMenu(
                            expanded = isCategoryMenuExpanded,
                            onDismissRequest = { isCategoryMenuExpanded = false }
                        ) {
                            state.categories
                                .filter { it.type == state.type }
                                .forEach { c ->
                                    DropdownMenuItem(
                                        text = { Text(c.name) },
                                        onClick = {
                                            viewModel.onCategorySelected(c.id)
                                            isCategoryMenuExpanded = false
                                        }
                                    )
                                }
                        }
                    }

                    // Notes Field
                    OutlinedTextField(
                        value = state.notes,
                        onValueChange = viewModel::onNotesChanged,
                        label = { Text("Notes / Remarks") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        maxLines = 3
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Milestone 1 Persistence Notice Banner
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.25f)
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Milestone 1 Preview: Data is stored in state. Persistent Room SQLite database will be connected in Milestone 2.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Action Buttons (Save & Cancel)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = { viewModel.onRequestDismiss(onCanDismiss = ::closeSheet) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Cancel")
                }

                Button(
                    onClick = {
                        viewModel.saveTransaction { message ->
                            closeSheet()
                            onSaveSuccess(message)
                        }
                    },
                    modifier = Modifier.weight(1.5f),
                    enabled = (state.amountInput.toDoubleOrNull() ?: 0.0) > 0.0,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Text("Save Entry", fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // Discard Draft Dialog
    if (state.showDiscardDialog) {
        DiscardDraftDialog(
            onDismissRequest = viewModel::onCancelDiscard,
            onConfirmDiscard = {
                viewModel.onConfirmDiscard(onDismissed = ::closeSheet)
            }
        )
    }
}
