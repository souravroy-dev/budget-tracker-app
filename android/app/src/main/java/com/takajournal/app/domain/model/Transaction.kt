package com.takajournal.app.domain.model

data class Transaction(
    val id: String,
    val type: TransactionType,
    val amount: Double,
    val currency: String = "BDT",
    val description: String,
    val walletId: String,
    val targetWalletId: String? = null, // for TRANSFER
    val categoryId: String? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val notes: String = "",
    val photoUri: String? = null,
    val locationName: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val tags: List<String> = emptyList()
)
