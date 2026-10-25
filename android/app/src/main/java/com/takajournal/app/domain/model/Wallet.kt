package com.takajournal.app.domain.model

enum class WalletType(val title: String) {
    CASH("Physical Cash"),
    MFS_BKASH("bKash"),
    MFS_NAGAD("Nagad"),
    MFS_ROCKET("Rocket"),
    BANK("Bank Account"),
    OTHER("Other Account")
}

data class Wallet(
    val id: String,
    val name: String,
    val type: WalletType,
    val initialBalance: Double = 0.0,
    val currentBalance: Double = 0.0,
    val currency: String = "BDT",
    val colorHex: String = "#006C4C",
    val isArchived: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
