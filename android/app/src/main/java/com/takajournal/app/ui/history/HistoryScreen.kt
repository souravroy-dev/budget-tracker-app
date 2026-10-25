package com.takajournal.app.ui.history

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.ui.common.EmptyStateView
import com.takajournal.app.ui.common.TabularCurrencyText
import com.takajournal.app.ui.common.TakaTopBar
import com.takajournal.app.ui.home.TransactionRowItem

@Composable
fun HistoryScreen(
    onNavigateToTransactionDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: HistoryViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TakaTopBar(
                title = "History"
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Search Input Field
            Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                OutlinedTextField(
                    value = state.searchQuery,
                    onValueChange = viewModel::onSearchQueryChanged,
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search description, note, or tag...") },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search"
                        )
                    },
                    trailingIcon = {
                        if (state.searchQuery.isNotEmpty()) {
                            IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear search")
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface
                    )
                )
            }

            // Filter Chips Bar (Type & Date)
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Type Filter Chips
                item {
                    FilterChip(
                        selected = state.selectedTypeFilter == null,
                        onClick = { viewModel.onTypeFilterSelected(null) },
                        label = { Text("All Types") }
                    )
                }
                item {
                    FilterChip(
                        selected = state.selectedTypeFilter == TransactionType.EXPENSE,
                        onClick = { viewModel.onTypeFilterSelected(TransactionType.EXPENSE) },
                        label = { Text("Expense") }
                    )
                }
                item {
                    FilterChip(
                        selected = state.selectedTypeFilter == TransactionType.INCOME,
                        onClick = { viewModel.onTypeFilterSelected(TransactionType.INCOME) },
                        label = { Text("Income") }
                    )
                }
                item {
                    FilterChip(
                        selected = state.selectedTypeFilter == TransactionType.TRANSFER,
                        onClick = { viewModel.onTypeFilterSelected(TransactionType.TRANSFER) },
                        label = { Text("Transfer") }
                    )
                }

                // Date Filter Chips
                item {
                    FilterChip(
                        selected = state.selectedDateFilter == "TODAY",
                        onClick = {
                            viewModel.onDateFilterSelected(if (state.selectedDateFilter == "TODAY") "ALL" else "TODAY")
                        },
                        label = { Text("Today") }
                    )
                }
                item {
                    FilterChip(
                        selected = state.selectedDateFilter == "WEEK",
                        onClick = {
                            viewModel.onDateFilterSelected(if (state.selectedDateFilter == "WEEK") "ALL" else "WEEK")
                        },
                        label = { Text("This Week") }
                    )
                }
                item {
                    FilterChip(
                        selected = state.selectedDateFilter == "MONTH",
                        onClick = {
                            viewModel.onDateFilterSelected(if (state.selectedDateFilter == "MONTH") "ALL" else "MONTH")
                        },
                        label = { Text("This Month") }
                    )
                }
            }

            // Grouped Transactions List OR Empty State
            if (state.groupedTransactions.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    EmptyStateView(
                        icon = Icons.Default.History,
                        title = if (state.searchQuery.isNotEmpty() || state.selectedTypeFilter != null)
                            "No matching records"
                        else
                            "No transaction history",
                        description = if (state.searchQuery.isNotEmpty() || state.selectedTypeFilter != null)
                            "Try clearing or altering your filters to see more results."
                        else
                            "Recorded expenses, incomes, and transfers will be archived here grouped chronologically by day."
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(state.groupedTransactions, key = { it.dateLabel }) { dayGroup ->
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            // Day Header
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = dayGroup.dateLabel,
                                    style = MaterialTheme.typography.labelLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )

                                if (dayGroup.dayTotalExpense > 0) {
                                    Text(
                                        text = "-৳${String.format("%.2f", dayGroup.dayTotalExpense)}",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.error
                                    )
                                }
                            }

                            // Items in this day
                            dayGroup.transactions.forEach { tx ->
                                TransactionRowItem(
                                    transaction = tx,
                                    onClick = { onNavigateToTransactionDetail(tx.id) }
                                )
                            }
                        }
                    }

                    item {
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }
        }
    }
}
